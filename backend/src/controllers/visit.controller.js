import { Nurse, Visit, Patient } from "../models/index.js";
import APIError from "../utils/ApiError.utils.js";
import mongoose from "mongoose";
import ApiResponse from "../utils/ApiResponse.utils.js";

export const handleGetAllVisit = async (req, res, next) => {
    const { page, limit } = req.parsedQuery;
    const { roleRefId, hospitalId } = req.user;

    const skip = (page - 1) * limit;
    const filter = {
        createdBy: roleRefId,
        hospitalId,
        status: "WAITING"
    };

    try {
        const [total, allVisits] = await Promise.all([
            Visit.countDocuments(filter),
            Visit.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ visitDate: -1 })
                .populate([
                    {
                        path: "patientId",
                        select: "pfp_url chronicConditions",
                        populate: {
                            path: "userId",
                            select: "firstName middleName lastName"
                        }
                    },
                    {
                        path: "assignedNurseId",
                        select: "pfp_url wardAssigned workingHours",
                        populate: {
                            path: "staffId",
                            select: "employeeId department role shift",
                            populate: {
                                path: "userId",
                                select: "firstName middleName lastName"
                            }
                        }
                    }
                ])
        ]);

        return res.status(200).json(
            new ApiResponse(
                200,
                allVisits,
                allVisits.length === 0 ? "No visits present yet" : "successfully fetched all the visits",
                {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: page < Math.ceil(total / limit),
                    hasPrevPage: page > 1
                }
            )
        );
    } catch (err) {
        return next(err);
    }
};

export const handleCreatePatientVisit = async (req, res, next) => {
    const { patientId } = req.parsedParams;
    const { nurseStaffId } = req.parsedBody;
    const { roleRefId, hospitalId } = req.user;

    const session = await mongoose.startSession();

    try {
        const [patient, nurse] = await Promise.all([
            Patient.exists({ _id: patientId }),
            Nurse.exists({ staffId: nurseStaffId })
        ]);

        if (!patient) {
            throw new APIError(404, "No patient record found");
        }

        if (!nurse) {
            throw new APIError(404, "No nurse record found");
        }

        let visitRecord;
        let updatedNurseRecord;

        await session.withTransaction(async () => {
            const createdVisits = await Visit.create(
                [{
                    ...req.parsedBody,
                    status: "WAITING",
                    patientId,
                    hospitalId,
                    createdBy: roleRefId,
                    visitDate: Date.now(),
                    assignedNurseId: nurse._id
                }],
                { runValidators: true, session }
            );

            visitRecord = createdVisits[0];
            if (!visitRecord) {
                throw new APIError(500, "Failed to create a visit for the patient");
            }

            updatedNurseRecord = await Nurse.findByIdAndUpdate(
                nurse._id,
                { $push: { assignedPatients: patientId } },
                { returnDocument: "after", runValidators: true, session }
            );
            if (!updatedNurseRecord) {
                throw new APIError(500, "Failed to assign visit to nurse");
            }
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    visitRecord,
                    nurseData: updatedNurseRecord
                },
                "successfully created and assigned the visit to the nurse"
            )
        );

    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleChangeNurse = async (req, res, next) => {
    const { visitId, nurseStaffId } = req.parsedParams;

    const session = await mongoose.startSession();

    try {
        const [visitRecord, nurseRecord] = await Promise.all([
            Visit.findById(visitId).select("assignedNurseId patientId"),
            Nurse.exists({ staffId: nurseStaffId }),
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

        const oldNurseId = visitRecord.assignedNurseId;

        if (oldNurseId.toString() === nurseRecord._id.toString()) {
            return next(
                new APIError(400, "This nurse is already assigned to the visit")
            );
        }

        let updatedVisitRecord;
        let updatedOldNurseRecord;
        let updatedNewNurseRecord;

        await session.withTransaction(async () => {
            visitRecord.assignedNurseId = nurseRecord._id;
            updatedVisitRecord = await visitRecord.save({ session, new: true });

            if (!updatedVisitRecord) {
                throw new APIError(500, "Failed to update the assigned nurse for the visit");
            }

            updatedOldNurseRecord = await Nurse.findByIdAndUpdate(
                oldNurseId,
                { $pull: { assignedPatients: visitRecord.patientId } },
                { runValidators: true, returnDocument: "after", session }
            );

            if (!updatedOldNurseRecord) {
                throw new APIError(500, "Failed in removal of the visit from old nurse record")
            }

            updatedNewNurseRecord = await Nurse.findByIdAndUpdate(
                nurseRecord._id,
                { $addToSet: { assignedPatients: visitRecord.patientId } },
                { runValidators: true, returnDocument: "after", session }
            );

            if (!updatedNewNurseRecord) {
                throw new APIError(500, "Failed to update the new nurse's assigned patients");
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    updatedVisitRecord,
                    updatedOldNurseRecord,
                    updatedNewNurseRecord
                },
                "Successfully changed the assigned nurse",
            )
        );

    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleCloseVisit = async (req, res, next) => {
    const { visitId } = req.parsedParams;

    const session = await mongoose.startSession();

    try {
        let visitRecord;
        let nurseRecord;

        await session.withTransaction(async () => {
            visitRecord = await Visit.findOneAndUpdate(
                {
                    _id: visitId,
                    status: "WAITING"
                },
                { $set: { status: "CHECKUP_DONE" } },
                { returnDocument: "after", runValidators: true, session }
            );

            if (!visitRecord) {
                throw new APIError(404, "Visit record doesn't exisit");
            }

            nurseRecord = await Nurse.findByIdAndUpdate(
                visitRecord.assignedNurseId,
                { $pull: { assignedPatients: visitRecord.patientId } },
                { returnDocument: "after", runValidators: true, session }
            );

            if (!nurseRecord) {
                throw new APIError(404, "Assigned nurse not found");
            }
        });

        return res.status(200).json(
            new ApiResponse(
                200,
                {
                    visitRecord,
                    nurseRecord
                },
                "Successfully closed the visit",
            )
        );

    } catch (err) {
        return next(err);
    } finally {
        await session.endSession();
    }
};