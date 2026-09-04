import mongoose from "mongoose";
import { Checkup, DicomStudy } from "../models/index.js";
import { previewDicomInstance } from "../services/dicom.service.js";
import { createDicomStudy } from "../services/dicomStudy.service.js";
import APIError from "../utils/APIError.utils.js";
import { logTimelineEvent } from "../services/timelineEvent.service.js";

export const handlePreviewDicomStudy = async (req, res, next) => {
    try {
        const { dicomStudyId } = req.parsedParams;

        const dicomStudy = await DicomStudy.findOne({
            _id: dicomStudyId,
            isDeleted: false
        }).lean();

        if (!dicomStudy) {
            return next(
                new APIError(404, "Dicom study record not found")
            );
        }

        const {
            studyInstanceId,
            seriesInstanceId,
            sopInstanceUid
        } = dicomStudy;

        const buffer = await previewDicomInstance(studyInstanceId, seriesInstanceId, sopInstanceUid);

        return res.type('application/dicom').send(buffer);
    } catch (err) {
        return next(err);
    }
};

export const handleGetAllDicomStudies = async (req, res, next) => {
    try {
        const { checkupId } = req.parsedParams;

        const checkupRecord = await Checkup.exists({ _id: checkupId });

        if (!checkupRecord) {
            return next(
                new APIError(404, "Checkup record not found")
            );
        }

        const dicoms = await DicomStudy.find({
            checkupId,
            isDeactivated: false
        }).lean();

        return res.status(200).json({
            data: dicoms,
            message: dicoms.length === 0 ? "No dicom files found" : "Dicom files fetched"
        });

    } catch (err) {
        return next(err);
    }
};

export const handleUploadDicomStudy = async (req, res, next) => {

    const { staffRole, roleRefId } = req.user;
    const { checkupId } = req.parsedParams;
    const { BASE_API_URL } = process.env;
    const {
        studyUid,
        seriesUid,
        instanceUid,
        modality,
        bodyPartExamined
    } = req.dicomPayload;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const generatedFileUrl = `${BASE_API_URL}/dicom/study/${studyUid}/series/${seriesUid}/instance/${instanceUid}`;

        const sliceArray = [{
            fileName,
            fileUrl: generatedFileUrl,
            sopInstanceUid: instanceUid,
            seriesInstanceId: seriesUid,
            bodyPart: bodyPartExamined || "Unknown"
        }];

        const { patientId, medicalCaseId } = await Checkup.findById(checkupId).select("patientId medicalCaseId");

        const { _id: dicomStudyId } = await createDicomStudy({
            checkupId,
            patientId,
            medicalCaseId,
            uploadedBy: roleRefId,
            studyInstanceId: studyUid,
            modality: modality || "Others",
            slices: sliceArray
        }, session);

        const { _id: timlineId } = await logTimelineEvent({
            patientId,
            eventData: {
                eventType: 'DICOM_UPLOADED',
                performedByRole: staffRole,
                performedBy: roleRefId,
                eventReferenceId: dicomStudyId,
                referenceModel: 'DicomStudy',
                note: `${sliceArray.length} DICOM files uploaded`
            }
        }, session);

        session.commitTransaction();

        return res.status(201).json({
            message: "successfully uploaded dicom file",
            timlineId,
            recordId: dicomStudyId
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleDicomZip = async (req, res, next) => {

    const { BASE_API_URL } = process.env;
    const { checkupId } = req.parsedParams;
    const { staffRole, roleRefId } = req.user;
    const { dicomResults, studyUid, modality } = req.dicomPayload;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const sliceArray = [];
        const failedUploads = [];

        for (const result of dicomResults) {
            if (result.status === "rejected") {
                failedUploads.push({
                    fileName: result.fileName,
                    reason: result.reason?.message ||
                        "failed to upload to Google Cloud"
                });

                continue;
            }

            const { metaData, fileName } = result;
            const {
                studyUid,
                seriesUid,
                instanceUid,
                bodyPartExamined
            } = metaData;

            const fileUrl = `${BASE_API_URL}/dicom/study/${studyUid}/series/${seriesUid}/instance/${instanceUid}`;

            sliceArray.push({
                fileName,
                fileUrl,
                sopInstanceUid: instanceUid,
                seriesInstanceId: seriesUid,
                bodyPart: bodyPartExamined || "Unknown"
            });
        }

        const { patientId, medicalCaseId } = await Checkup.findById(checkupId).select("patientId medicalCaseId");

        const { _id: dicomStudyId } = await createDicomStudy({
            patientId,
            checkupId,
            medicalCaseId,
            uploadedBy: roleRefId,
            studyInstanceId: studyUid,
            modality: modality || "Others",
            slices: sliceArray
        }, session);

        const { _id: timelineEventId } = await logTimelineEvent({
            patientId,
            eventData: {
                eventType: 'DICOM_UPLOADED',
                performedByRole: staffRole,
                performedBy: roleRefId,
                eventReferenceId: dicomStudyId,
                referenceModel: 'DicomStudy',
                note: `${sliceArray.length} DICOM files uploaded`
            }
        }, session);

        await session.commitTransaction();

        return res.status(201).json({
            totalProcessed: dicomResults.length,
            successCount: sliceArray.length,
            failedCount: failedUploads.length,
            failedFiles: failedUploads,
            msg: `Successfully processed and stored ${sliceArray.length} DICOM instances.`,
            recordId: dicomStudyId,
            timelineEventId,
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};

// export const handleDeleteDicomStudy = async (req, res, next) => {
//      if (!req.params.studyUid)
//           return res.status(400).json({ err: "no study instance Id is provided!" });

//      try {
//           const result = await dicomWebDeleteStudy(req.params.studyUid);

//           console.log(result);

//           return res.status(200).json({ msg: "successfully deleted the dicom file" });
//      } catch (err) {
//           console.error("failed during dicom file deletion\n", err.message);
//           if (err.message.includes("404")) {
//                return res.status(404).json({ err: "no dicom file found with this studyInstanceId" });
//           }
//           next(err);
//      }
// };
