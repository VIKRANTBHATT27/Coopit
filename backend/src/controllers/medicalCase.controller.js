import mongoose from "mongoose";
import { Nurse, Doctor, MedicalCase, Patient } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetNurseMedicalCases = async (req, res) => {
    try {
        const { roleRefId } = req.user;
        const { patientId } = req.parsedParams;

        const patient = await Patient.exists({ _id: patientId });
        if (!patient) {
            return next(
                new APIError(404, "No patient record found")
            );
        }

        const nurseMedicalCases = await MedicalCase.find({
            patientId,
            assistedBy: roleRefId
        }).sort({ createdAt: -1 });

        if (nurseMedicalCases.length === 0) {
            return res.status(200).json({
                status: "ok",
                data: [],
                messsage: "no medical cases exist yet"
            });
        }

        return res.status(200).json({
            status: "ok",
            data: nurseMedicalCases
        });

    } catch (err) {
        return next(err);
    }
};

export const handleGetDoctorMedicalCases = async (req, res, next) => {
    try {
        const { staffId } = req.user;

        const doctor = await Doctor.findOne({ staffId });

        const allMedicalCase = [];

        for (const medicalCaseId of doctor.assignedMedicalCases) {
            const medicalCase = await MedicalCase.findById(medicalCaseId)
                .populate({
                    path: "patientId",
                    populate: {
                        path: "userId",
                        select: "fullName gender dateOfBirth"
                    }
                });

            allMedicalCase.push(medicalCase);
        }

        if (allMedicalCase.length === 0) {
            return res.status(200).json({
                message: "No medical cases found",
            });
        }

        return res.status(200).json({
            message: "All medical cases",
            data: allMedicalCase
        });

    } catch (err) {
        return next(err);
    }
};

export const handleApproveMedicalCase = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { roleRefId } = req.user;
        const { medicalCaseId } = req.parsedParams;

        // const [doctor, medicalCase] = await Promise.all([

        // ]);

        const medicalCase = await MedicalCase.findOneAndUpdate(
            {
                medicalCaseId,
                diagnosedBy: roleRefId,
            },
            { $set: { isApproved: true } },
            { session }
        );

        if (!medicalCase) {
            return next(
                new APIError(404, "No medical case record found")
            );
        }

        await Doctor.findByIdAndUpdate(
            roleRefId,
            { $pull: { assignedMedicalCases: medicalCaseId } },
            { session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            message: "Successfully approved the medical case"
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleCreateMedicalCase = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { roleRefId } = req.user;
        const { patientId } = req.parsedParams;
        const { doctorId } = req.parsedBody;

        const patient = await Patient.exists({ _id: patientId });
        if (!patient) {
            return next(
                new APIError(404, "No patient record found")
            );
        }

        if (doctorId) {
            const doctor = await Doctor.exists({ _id: doctorId });

            if (!doctor) {
                return next(
                    new APIError(404, "No doctor record found")
                );
            }
        }

        const [medicalCase] = await MedicalCase.create(
            [{
                ...req.parsedBody,
                patientId,
                assistedBy: roleRefId,
                diagnosedBy: doctorId || null,
                timelineEventId: null
            }],
            { returnDocument: "after", runValidators: true, session }
        );

        if (doctorId) {
            await Doctor.findByIdAndUpdate(
                doctorId,
                {
                    $addToSet: { assignedMedicalCases: medicalCase._id }
                },
                { session }
            );
        }

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "Medical case successfully created",
            data: medicalCase
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        session.endSession();
    }
};

export const handleUpdateMedicalCase = async (req, res) => {
    try {
        const { medicalCaseId } = req.parsedParams;

        const medicalCase = await MedicalCase.exists({ _id: medicalCaseId });

        if (!medicalCase) {
            return next(
                new APIError(404, "No medical case record found")
            );
        }

        const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
            medicalCaseId,
            { ...req.parsedBody },
            { returnDocument: "after", runValidators: true }
        );

        return res.status(200).json({
            status: "ok",
            message: "Medical Case record updated successfully",
            data: updatedMedicalCase
        });

    } catch (err) {
        return next(err);
    }
};

export const handleAssignMedicalCase = async (req, res, next) => {
    try {
        const { medicalCaseId, doctorId } = req.parsedParams;

        const [medicalCase, doctor] = await Promise.all([
            MedicalCase.exists({ _id: medicalCaseId }),
            Doctor.findById(doctorId)
        ]);

        if (!medicalCase) {
            return next(
                new APIError(404, "Medical case record not found")
            );
        }

        if (!doctor) {
            return next(
                new APIError(404, "Doctor record not found")
            );
        }

        doctor.assignedMedicalCases.addToSet(medicalCaseId);

        await doctor.save();

        return res.status(200).json({
            message: "Successfully assigned medical case to the doctor",
            data: doctor
        });

    } catch (err) {
        return next(err);
    }
};

export const handleChangeNurse = async (req, res, next) => {
    try {
        const { roleRefId } = req.user;
        const { nurseId, medicalCaseId } = req.parsedParams;

        if (roleRefId === nurseId) {
            return next(
                new APIError(400, "Nurse ID matches the logged-in nurse")
            );
        }

        const [nurseExists, medicalCaseExists] = await Promise.all([
            Nurse.exists({ _id: nurseId }),
            MedicalCase.exists({
                _id: medicalCaseId,
                assistedBy: roleRefId
            })
        ]);

        if (!nurseExists) {
            return next(
                new APIError(404, "Nurse record not found")
            );
        }

        if (!medicalCaseExists) {
            return next(
                new APIError(404, "Either medical case not found or it is not assigned to you")
            );
        }

        const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
            medicalCaseId,
            { $set: { assistedBy: nurseId } },
            { returnDocument: true, runValidators: true }
        );

        return res.status(200).json({
            status: "ok",
            message: "New nurse is added to the medical case.",
            data: updatedMedicalCase
        });

    } catch (err) {
        return next(err);
    }
};

export const handleChangeDoctor = async (req, res, next) => {
    try {
        const { roleRefId } = req.user;
        const { doctorId, medicalCaseId } = req.parsedParams;

        const [doctorExists, medicalCaseExists] = await Promise.all([
            Doctor.exists({ _id: doctorId }),
            MedicalCase.exists({
                _id: medicalCaseId,
                assistedBy: roleRefId
            })
        ]);

        if (!doctorExists) {
            return next(
                new APIError(404, "Doctor record not found")
            );
        }

        if (!medicalCaseExists) {
            return next(
                new APIError(404, "Either medical case not found or it is not assigned to you")
            );
        }

        const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
            medicalCaseId,
            { $set: { diagnosedBy: doctorId } },
            { returnDocument: true, runValidators: true }
        );

        return res.status(200).json({
            status: "ok",
            message: "New doctor is added to the medical case.",
            data: updatedMedicalCase
        });

    } catch (err) {
        return next(err);
    }
};

export const handleChangeTimelineEvent = async (req, res, next) => {
    try {


    } catch (err) {
        return next(err);
    }
};
