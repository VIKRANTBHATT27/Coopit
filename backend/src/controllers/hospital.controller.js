import mongoose from "mongoose";
import { Hospital, Staff, User } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetAllHospitals = async (req, res, next) => {
    try {
        const allHospitals = await Hospital.find({});

        if (!allHospitals) {
            return res.status(404).json({
                message: "No hospitals found"
            });
        }

        return res.status(200).json({
            data: allHospitals
        });
    } catch (err) {
        return next(err);
    }
};

export const handleRegisterHospital = async (req, res, next) => {

    const {
        hospitalName,
        hospitalAddress,
        hospitalType,
        hospitalPhones,
        hospitalDepts,
        licenseNumber,
        location,
    } = req.parsedBody.hospital;

    const { adminEmailId } = req.parsedBody.admin;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const adminRecord = await User.findOne({ emailId: adminEmailId }).select("_id");

        if (!adminRecord) {
            return next(
                new APIError("No admin record found")
            );
        }

        const [hospital] = await Hospital.create(
            [{
                name: hospitalName,
                address: hospitalAddress,
                hospitalType,
                phones: hospitalPhones,
                departments: hospitalDepts,
                licenseNumber,
                location
            }],
            { returnDocument: true, runValidators: true, session }
        );

        const [adminStaff] = await Staff.create(
            [{
                userId: adminRecord._id,
                employeeId: adminEmployeeId,
                department: "MANAGEMENT",
                role: "HOSPITAL_ADMIN",
            }],
            { returnDocument: true, runValidators: true, session }
        );

        await Hospital.findByIdAndUpdate(
            hospital._id,
            { $push: { adminIds: adminStaff._id } },
            { session }
        );

        await session.commitTransaction();

        return res.status(201).json({
            message: "Hospital Registration is complete",
            hospital: hospital._id
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        await session.endSession();
    }
};

export const handleGetHospitalDetails = async (req, res, next) => {
    try {
        const { hospitalId } = req.parsedParams;

        const hospital = await Hospital.findOne({ _id: hospitalId })
            .populate({
                path: "adminIds",
                populate: {
                    path: "userId",
                    select: "-passwordHash -phoneNumberHash -phoneNumberEnc -phoneIV -phoneAuthTag"
                }
            });

        if (!hospital) {
            return next(
                new APIError(400, "Hospital record not found")
            );
        }

        return res.status(200).json({
            data: hospital
        });
    } catch (err) {
        return next(err);
    }
};

export const handleUpdateHospital = async (req, res, next) => {
    try {
        const { hospitalId } = req.parsedParams;

        const {
            hospitalName,
            hospitalAddress,
            hospitalType,
            hospitalPhones,
            hospitalDepts,
            licenseNumber,
            location,
        } = req.parsedBody;

        const hospital = await Hospital.findOneAndUpdate(
            { _id: hospitalId },
            {
                name: hospitalName,
                address: hospitalAddress,
                hospitalType,
                phones: hospitalPhones,
                departments: hospitalDepts,
                licenseNumber,
                location
            },
            { returnDocument: true, runValidators: true }
        );

        if (!hospital) {
            return next(
                new APIError(400, "Hospital record not found")
            );
        }

        return res.status(200).json({
            message: "successfully updated hospital data",
            data: hospital
        });

    } catch (err) {
        return next(err);
    }
};

export const handleToggleHospitalStatus = async (req, res, next) => {
    try {
        const { hospitalId } = req.parsedParams;
        const { status } = req.parsedBody;

        const hospital = await Hospital.findOneAndUpdate(
            {
                _id: hospitalId,
                status: { $ne: status }
            },
            { $set: { status } },
            { returnDocument: true, runValidators: true }
        );

        if (!hospital) {
            const exists = await Hospital.exists({ _id: hospitalId });

            if (!exists) {
                return next(
                    new APIError(404, "Hospital not found")
                );
            }

            return res.status(400).json({
                message: `Hospital is already marked as ${status}`
            })
        }

        return res.status(200).json({
            message: `Hospital status updated to ${status} successfully`,
            data: hospital
        });

    } catch (err) {
        return next(err);
    }
};