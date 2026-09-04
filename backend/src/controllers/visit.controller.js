import { Nurse, Visit, Patient } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import mongoose from "mongoose";

export const handleGetAllVisit = async (req, res, next) => {
    const { roleRefId, hospitalId } = req.user;

    try {
        const allVisits = await Visit.find({
            createdBy: roleRefId,
            hospitalId,
            status: "WAITING"
        });

        return res.status(200).json({
            allVisits,
            message: allVisits.length === 0 ? "No visits present yet" : "successfully fetched all the visits",
        });
    } catch (err) {
        return next(err);
    }
};

export const handleCreatePatientVisit = async (req, res, next) => {
    const { patientId } = req.parsedParams;
    const { assignedNurseId } = req.parsedBody;
    const { roleRefId, hospitalId } = req.user;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [patient, nurse] = await Promise.all([
            Patient.exists({ _id: patientId }),
            Nurse.exists({ _id: assignedNurseId }),
        ]);

        if (!patient) {
            return next(
                new APIError(404, "No patient record found")
            );
        }

        if (!nurse) {
            return next(
                new APIError(404, "No nurse record found")
            );
        }


        const [visitRecord, updatedNurseRecord] = await Promise.all([
            Visit.create(
                [{
                    ...req.parsedBody,
                    status: "WAITING",
                    patientId,
                    hospitalId,
                    createdBy: roleRefId,
                    visitDate: Date.now()
                }],
                { returnDocument: true, runValidators: true, session }
            ),
            Nurse.findOneAndUpdate(
                { _id: assignedNurseId },
                { $push: { assignedPatients: patientId } },
                { returnDocument: true, runValidators: true, session }
            )
        ]);

        if (!Array.isArray(visitRecord) || visitRecord.length === 0) {
            return next(
                new APIError(
                    500, "Failed to create a visit for the patient"
                )
            );
        }

        if (!updatedNurseRecord) {
            return next(
                new APIError(
                    500, "Failed to assign visit to nurse"
                )
            );
        }

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "successfully created and assigned the visit to the nurse",
            data: visitRecord[0]
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleCloseVisit = async (req, res, next) => {

    const { visitId } = req.parsedParams;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const visit = await Visit.findByIdAndUpdate(
            visitId,
            { $set: { status: "CHECKUP_DONE" } },
            { returnDocument: "after", runValidators: true, session }
        );

        await Nurse.findByIdAndUpdate(
            visit.assignedNurseId,
            { $pull: { assignedPatients: visit.patientId } },
            { runValidators: true, session }
        );

        await session.commitTransaction();

        return res.status(200).json({
            message: "Successfully closed the visit",
            data: visit
        });
    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleChangeNurse = async (req, res, next) => {
    const { visitId, nurseId: assignedNurseId } = req.parsedParams;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const [visitRecord, nurseRecord] = await Promise.all([
            Visit.findById(visitId).select("assignedNurseId patientId"),
            Nurse.exists({ _id: assignedNurseId }),
        ]);

        if (!visitRecord) {
            return next(
                new APIError(404, "No visit record found")
            );
        }

        if (!nurseRecord) {
            return next(
                new APIError(404, "No nurse record found")
            );
        }

        if (visitRecord.assignedNurseId?.toString() === assignedNurseId.toString()) {
            return next(
                new APIError(400, "This nurse is already assigned to the visit")
            );
        }

        const [updatedVisit, updatedOldNurse, updatedNewNurse] = await Promise.all([
            Visit.findByIdAndUpdate(
                visitId,
                { $set: { assignedNurseId } },
                { returnDocument: "after", runValidators: true, session }
            ),
            Nurse.findByIdAndUpdate(
                visitRecord.assignedNurseId,
                { $pull: { assignedPatients: visitRecord.patientId } },
                { runValidators: true, session }
            ),
            Nurse.findByIdAndUpdate(
                assignedNurseId,
                { $addToSet: { assignedPatients: visitRecord.patientId } },
                { runValidators: true, session }
            )
        ]);

        if (!updatedVisit) {
            return next(new APIError(500, "Failed to update the assigned nurse for the visit"));
        }

        if (!updatedOldNurse || !updatedNewNurse) {
            return next(new APIError(500, "Failed to update the nurse assignment records"));
        }

        await session.commitTransaction();

        return res.status(200).json({
            success: true,
            message: "Successfully changed the assigned nurse",
            data: updatedVisit,
        });
    } catch (err) {
        await session.abortTransaction();
        return next(err);
    } finally {
        await session.endSession();
    }
};