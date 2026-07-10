import { healthcareClient } from "../infrastructure/googleHealthcare.js";
import APIError from "../utils/APIError.utils.js";

import dotenv from "dotenv";
dotenv.config();

export const previewDicomInstance = async (
    studyUid,
    seriesUid,
    instanceUid,
) => {
    try {
        const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
        const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
        const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
        const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

        const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

        const dicomWebPath = `studies/${studyUid}/series/${seriesUid}/instances/${instanceUid}`;

        const instance = await healthcareClient.projects.locations.datasets.dicomStores.studies.series.instances.retrieveInstance(
            { parent, dicomWebPath },
            {
                headers: {
                    Accept: 'application/dicom+json,multipart/related'
                },
                responseType: "arraybuffer"
            }
        );

        return Buffer.from(instance.data);
    } catch (err) {
        console.error("failed during previewing dicom instance\n", err.message);

        throw new APIError(500, "Failed to preview DICOM instance");
    }
};

export const uploadDicomInstance = async (
    dicomStoreName = 'x-rays',
    dicomFilePath,
) => {
    try {
        const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
        const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
        const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
        const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;

        const fileBuffer = fs.readFileSync(dcmFilePath);

        const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

        const request = {
            parent,
            dicomWebPath: 'studies',
            requestBody: fileBuffer,        // Pass the Buffer, not the stream
        };

        const instance = await healthcareClient.projects.locations.datasets.dicomStores.studies.storeInstances(
            request,
            {
                headers: {
                    'Content-Type': 'application/dicom',
                    'Accept': 'application/dicom+json',
                }
            }
        );

        console.log('Stored DICOM instance:', JSON.stringify(instance.data));

    } catch (err) {
        console.error(
            "Error during uploading DICOM file\n",
            err.response?.data || err.message,
        );

        throw new APIError(500, "Failed to upload DICOM instance");
    }
};

export const deleteDicomInstance = async (
    studyUid
) => {
    try {
        const cloudRegion = process.env.GOOGLE_CLOUD_CONSOLE_LOCATION;
        const projectId = process.env.GOOGLE_CLOUD_CONSOLE_PROJECT_ID;
        const datasetId = process.env.GOOGLE_CLOUD_CONSOLE_DATASET_ID;
        const dicomStoreId = process.env.GOOGLE_CLOUD_CONSOLE_DICOM_STORE_ID;


        const parent = `projects/${projectId}/locations/${cloudRegion}/datasets/${datasetId}/dicomStores/${dicomStoreId}`;

        const dicomWebPath = `studies/${studyUid}`;

        const response = await healthcareClient.projects.locations.datasets.dicomStores.studies.deleteStudy({ parent, dicomWebPath });

        console.log(`Deleted DICOM study with UID ${studyUid}:`, response.data);
    } catch (err) {
        console.error("failed during deleting dicom instance\n", err.response?.data || err.message);

        throw new APIError(500, "Failed to delete DICOM instance");
    }
};