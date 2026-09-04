import { Checkup, DicomStudy, LabReport, MedicalCase, Patient, Timeline } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetTimelines = async (req, res, next) => {
    try {
        const { patientId } = req.user;

        const allTimelines = await Timeline.find({ patientId });

        return res.status(200).json({
            message: allTimelines.length === 0 ? "No timeline record present" : "all timeline record fetched",
            data: allTimelines
        })

    } catch (err) {
        return next(err);
    }
};

export const handleGetPatientTimeline = async (req, res, next) => {
    try {
        const { roleRefId } = req.user;

        const { patientId, medicalCaseId } = req.parsedParams;

        const [patientRecord, medicalCaseRecord] = await Promise.all([
            Patient.exists({ _id: patientId }),
            MedicalCase.exists({
                _id: medicalCaseId,
                assistedBy: roleRefId,
                patientId,
            })
        ]);

        if (!patientRecord) {
            return next(
                new APIError(404, "No patient record found")
            );
        }

        if (!medicalCaseRecord) {
            return next(
                new APIError(404, "Medical case not found or you do not have access to this case")
            );
        }

        const Timeline = await Timeline.findOne({
            patientId,
            medicalCaseId
        });

        if (!Timeline) {
            return next(
                new APIError(404, "No timeline record found for this patient")
            );
        }

        return res.status(200).json({
            message: "timeline events for the patient",
            data: Timeline
        });

    } catch (err) {
        return next(err);
    }
};


export const handleCreatePatientTimeline = async (req, res, next) => {
    try {
        const { roleRefId } = req.user;
        const { patientId, medicalCaseId } = req.parsedParams;

        const [patient, medicalCase] = await Promise.all([
            Patient.exists({ _id: patientId }),
            MedicalCase.exists({
                _id: medicalCaseId,
                assistedBy: roleRefId,
                patientId,
            })
        ]);

        if (!patient) {
            return next(
                new APIError(404, "Patient record not found")
            );
        }

        if (!medicalCase) {
            return next(
                new APIError(404, "Medical Case not found")
            );
        }

        const timeline = await Timeline.create({
            ...req.parsedBody,
            startedAt: Date.now(),
            eventData: {
                ...req.parsedBody.eventData,
                performedByRole: "NURSE",
                performedBy: roleRefId,
                performedByReference: "Nurse",
                eventReferenceId: medicalCaseId,
                eventReferenceType,
            }
        });

        return res.status(201).json({
            message: "Successfully created a patient timeline with given medical case",
            data: timeline
        });

    } catch (err) {
        return next(err);
    }
};

export const handleUpdatePatientTimeline = async (req, res, next) => {
    try {
        const { roleRefId } = req.user;
        const { patientId, medicalCaseId } = req.parsedParams;

        const [patient, medicalCase] = await Promise.all([
            Patient.exists({ _id: patientId }),
            MedicalCase.exists({
                _id: medicalCaseId,
                assistedBy: roleRefId,
                patientId,
            })
        ]);

        if (!patient) {
            return next(
                new APIError(404, "Patient record not found")
            );
        }

        if (!medicalCase) {
            return next(
                new APIError(404, "Medical Case not found")
            );
        }

        const eventModel = {
            Checkup,
            DicomStudy,
            LabReport,
        }[eventReferenceType];

        const eventData = eventModel.exists({
            _id: eventReferenceId,
            medicalCaseId,
            patientId
        });

        if (!eventData) {
            return next(
                new APIError(404, `${eventReferenceType} record not found`)
            );
        }

        const timeline = await Timeline.findOneAndUpdate(
            {
                patientId,
                medicalCaseId,
            },
            {
                ...req.parsedBody,
                eventData: {
                    ...req.parsedBody.eventData,
                    performedByRole: "NURSE",
                    performedBy: roleRefId,
                    performedByReference: "Nurse",
                    eventReferenceId,
                    eventReferenceType,
                }
            },
            { returnDocument: "after", runValidators: true }
        );

        return res.status(201).json({
            message: "Successfully updated patient timeline with given medical case",
            data: timeline
        });

    } catch (err) {
        return next(err);
    }
};
