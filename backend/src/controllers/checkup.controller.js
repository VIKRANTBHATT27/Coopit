import { Checkup, LabTechnician, MedicalCase } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetCheckups = async (req, res, next) => {
    try {
        const { medicalCaseId } = req.parsedParams;

        const medicalCase = await MedicalCase.exists({ _id: medicalCaseId }).lean();

        if (!medicalCase) {
            return next(
                new APIError(404, "No medical case record found")
            );
        }

        const checkupRecords = await Checkup.find({ medicalCaseId });

        if (checkupRecords.length === 0) {
            return res.status(204).json({
                message: "No check up records exists",
                data: [],
            })
        }

        return res.status(200).json({
            status: "ok",
            data: checkupRecords
        });

    } catch (err) {
        return next(err);
    }
};

export const handleCreateCheckup = async (req, res, next) => {
    try {
        const { medicalCaseId } = req.parsedParams;

        const medicalCase = await MedicalCase.findById(medicalCaseId)
            .select("patientId diagonsedBy");

        if (!medicalCase) {
            return next(
                new APIError(404, "No medical case record found")
            );
        }

        if (!medicalCase.diagnosedBy) {
            return next(
                new APIError(400, "No doctor is assigned to this medical case.")
            );
        }

        const { patientId, diagnosedBy: doctorId } = medicalCase;

        const checkup = await Checkup.create({
            ...req.parsedBody,
            vaccinationsGiven: {
                ...req.parsedBody.vaccinationsGiven,
                administeredBy: doctorId
            },
            visitDate: Date.now(),
            medicalCaseId,
            patientId,
            doctorId
        });

        return res.status(201).json({
            message: "Successfully created a checkup record",
            data: checkup
        });

    } catch (err) {
        return next(err);
    }
};

export const handleUpdateCheckup = async (req, res, next) => {
    try {
        const { checkupId } = req.parsedParams;

        const checkup = await Checkup.findByIdAndUpdate(
            checkupId,
            { $set: { ...req.parsedBody } },
            { returnDocument: "after", runValidators: true }
        );

        if (!checkup) {
            return next(
                new APIError(404, "No checkup record found")
            );
        }

        return res.status(200).json({
            message: "Successfully updated checkup record",
            data: checkup
        });
        
    } catch (err) {
        return next(err);
    }
};

export const handleAssignCheckup = async (req, res, next) => {
    try {
        const { checkupId, labTechId } = req.parsedParams;

        const [checkupRecord, labTechRecord] = await Promise.all([
            Checkup.exists({ _id: checkupId }).lean(),
            LabTechnician.findOne({ _id: labTechId })
        ]);

        if (!checkupRecord) {
            return next(
                new APIError(404, "No checkup record found")
            );
        }

        if (!labTechRecord) {
            return next(
                new APIError(404, "No lab technician record found")
            );
        }

        labTechRecord.assignedCheckups.push(checkupRecord);

        await labTechRecord.save();

        return res.status(200).json({
            message: "Successfully updated checkup record",
            data: labTechRecord
        });

    } catch (err) {
        return next(err);
    }
};