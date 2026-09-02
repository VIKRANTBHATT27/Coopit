import fs from 'fs';
import { healthcareClient } from '../services/googleHealthcare.service.js';
import APIError from '../utils/APIError.utils.js';
import dicomParser from 'dicom-parser';
import AdmZip from 'adm-zip';

const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

export const extractAndUploadDicoms = async (req, res, next) => {
    try {
        const zip = new AdmZip(req.file.path);
        const zipEntries = zip.getEntries();

        const localParsedFiles = [];
        const studyUidSet = new Set();

        let firstValidMeta = null;

        for (const entry of zipEntries) {
            if (
                entry.isDirectory ||
                !entry.entryName.toLowerCase().endsWith('.dcm')
            ) continue;

            const fileBuffer = entry.getData();
            const dataset = dicomParser.parseDicom(fileBuffer);

            const studyUid = dataset.string("x0020000d");

            if (studyUid) studyUidSet.add(studyUid);

            if (studyUidSet.size > 1) {
                return next(
                    new APIError(
                        400,
                        "Multiple study UIDs found in the ZIP.\nPlease upload a ZIP containing a single imaging session."
                    )
                );
            }

            localParsedFiles.push({
                buffer: fileBuffer,
                fileName: entry.entryName,
                metaData: {
                    studyUid,
                    seriesUid: dataset.string('x0020000e'),
                    instanceUid: dataset.string('x00080018'),
                    modality: dataset.string('x00080060'),
                    bodyPartExamined: dataset.string('x00180015')
                }
            });
        }

        if (localParsedFiles.length === 0) {
            return next(
                new APIError(
                    400,
                    "No valid DICOM (.dcm) files found in the ZIP archive"
                )
            );
        }

        const uploadPromises = localParsedFiles.map(file =>
            healthcareClient.projects.locations.datasets.dicomStores.studies.storeInstances({
                parent,
                dicomWebPath: 'studies',
                requestBody: file.buffer,
                headers: { 'Content-Type': 'application/dicom' }
            })
        );

        const results = await Promise.allSettled(uploadPromises);

        const dicomResults = results.map((result, index) => {
            const metaData = localParsedFiles[index].metaData;

            if (result.status === "fulfilled" && !firstValidMeta) {
                firstValidMeta = metaData;
            }

            return {
                ...result,
                fileName: localParsedFiles[index].fileName,
                metaData: localParsedFiles[index].metaData
            }
        });

        req.dicomPayload = {
            studyUid: studyUidSet.values().next().value,
            modality: firstValidMeta?.modality || "Others",
            dicomResults,
        };

        return next();
    } catch (err) {
        return next(
            new APIError(
                500,
                "Error during extract of zip and uploading Dicoms"
            )
        );
    }
};

export const uploadDicomToGoogleCloud = async (req, res, next) => {
    try {
        const fileBuffer = fs.readFileSync(req.file.path);

        const dataset = dicomParser.parseDicom(fileBuffer);

        req.dicomPayload = {
            studyUid: dataset.string('x0020000d'),
            seriesUid: dataset.string('x0020000e'),
            instanceUid: dataset.string('x00080018'),
            modality: dataset.string('x00080060'),
            bodyPartExamined: dataset.string('x00180015')
        };

        await healthcareClient.projects.locations.datasets.dicomStores.studies.storeInstances({
            parent: parent,
            requestBody: fileBuffer,
            headers: {
                'Content-Type': 'multipart/related; type="application/dicom"',
            },
        });



        return next();
    } catch (err) {
        console.error(
            "Error uploading DICOM to Google Cloud\n",
            err.response?.data || err.message,
        );

        return next(
            new APIError(500, "Failed to upload DICOM file")
        );
    }
};