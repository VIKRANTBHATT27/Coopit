import mongoose from "mongoose";
import { getSignedUrlFromS3, uploadFileToS3 } from "../infrastructure/aws.js";
import { Checkup, LabReport, MedicalCase, Patient } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import { logTimelineEvent } from "../services/timelineEvent.service.js";

export const handleGetAllLabReports = async (req, res, next) => {
    try {
        const { checkupId } = req.parsedParams;

        const checkupRecord = await Checkup.exists({ _id: checkupId });

        if (!checkupRecord) {
            return next(
                new APIError(404, "Checkup record not found")
            );
        }

        const allLabReports = await LabReport.find({
            checkupId,
            isDeactivated: false
        }).lean();

        return res.status(200).json({
            data: allLabReports,
            message: allLabReports.length === 0 ? "No reports found" : "Reports fetched"
        })
    } catch (err) {
        return next(err);
    }
};

export const handleGetReport = async (req, res, next) => {
    try {
        const { labReportId } = req.parsedParams;

        const labReport = await LabReport.findById(labReportId).select("s3Key");

        if (!labReport) {
            return next(
                new APIError(404, "Lab reports not found")
            );
        }

        const { s3Key } = labReport;
        const redirectingURL = await getSignedUrlFromS3(s3Key);

        return res.status(200).json({
            message: "successfully getting the signed URL from aws s3",
            data: redirectingURL
        });
    } catch (err) {
        return next(err);
    }
};

export const handleUploadReport = async (req, res, next) => {
    const { path: filePath } = req.file;
    const { checkupId } = req.parsedParams;
    const { patientId } = req.parsedBody;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [patientRecord, checkupRecord] = await Promise.all([
            Patient.exists({ _id: patientId }),
            Checkup.findOne({ _id: checkupId }).select("medicalCaseId")
        ]);


        if (!patientRecord) {
            return next(
                new APIError(404, "Patient record not found")
            );
        }

        if (!checkupRecord) {
            return next(
                new APIError(404, "Checkup record not found")
            );
        }

        const { medicalCaseId } = checkupRecord;

        const { timelineId } = await MedicalCase.findById(medicalCaseId).select("timelineId");

        if (!timelineId) {
            return next(
                new APIError(500, "Nurse didn't created a timeline error. TimlineId is absent in the medical case of this checkup")
            );
        }

        const s3Key = `patient/${patientId}/report/${crypto.randomUUID()}.pdf`;

        await uploadFileToS3(s3Key, filePath);

        req.s3Key = s3Key;

        const { _id: labReportId } = await LabReport.create(
            [{
                ...req.parsedBody,
                checkupId,
                medicalCaseId,
                s3Key,
                uploadedBy: roleRefId,
                uploadedAt: Date.now()
            }],
            { session }
        );

        await logTimelineEvent({
            timelineId,
            eventData: {
                eventType: 'REPORT_UPLOADED',
                performedBy: roleRefId,
                performedByRole: role,
                eventReferenceId: labReportId,
                referenceModel: 'LabReport',
                note: 'Lab report uploaded'
            }
        }, session);

        await session.commitTransaction();

        return res.status(201).json({
            message: "report file uploaded successfully",
            labReportId,
            timelineId
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};