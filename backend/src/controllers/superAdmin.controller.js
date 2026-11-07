import mongoose from "mongoose";
import { Hospital, Staff, User } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

// export const handleCreateAdmin = async (req, res, next) => {
//     try {
//         const { hospitalId } = req.parsedParams;

//         const hospitalExists = await Hospital.exists({ _id: hospitalId });

//         if (!hospitalExists) {
//             return next(
//                 new APIError(404, "Hospital not found")
//             );
//         }

//         const {
//             adminName,
//             adminEmailId,
//             adminPhone,
//             adminPassword,
//             adminGender,
//             adminDOB,
//             adminState,
//             adminDistrict,
//             adminEmployeeId
//         } = req.parsedBody;

//         const session = await mongoose.startSession();
//         session.startTransaction();

//         try {
//             const [adminUser] = await User.create(
//                 [{
//                     fullName: adminName,
//                     emailId: adminEmailId,
//                     phoneNumber: adminPhone,
//                     password: adminPassword,
//                     gender: adminGender,
//                     dateOfBirth: adminDOB,
//                     role: 'HOSPITAL_ADMIN',
//                     state: adminState,
//                     districtName: adminDistrict,
//                 }],
//                 { returnDocument: true, runValidators: true, session }
//             );


//             const [adminStaff] = await Staff.create(
//                 [{
//                     userId: adminUser._id,
//                     employeeId: adminEmployeeId,
//                     department: "Management",
//                     role: "Admin",
//                     hospitalId,
//                 }],
//                 { returnDocument: true, runValidators: true, session }
//             );

//             const hospital = await Hospital.findOneAndUpdate(
//                 { _id: hospitalId },
//                 {
//                     $addToSet: { adminIds: adminStaff._id }
//                 },
//                 { returnDocument: true, runValidators: true, session }
//             );

//             await session.commitTransaction();

//             return res.status(201).json({
//                 message: "successfully created and assigned hospital",
//                 data: {
//                     hospital,
//                     adminStaff,
//                     adminUser: {
//                         _id: adminUser._id,
//                         fullName: adminUser.fullName,
//                         emailId: adminUser.emailId,
//                         phoneNumber: adminUser.phoneNumber,
//                         role: adminUser.role,
//                     },
//                 },
//             });

//         } catch (err) {
//             await session.abortTransaction();

//             return next(err);
//         } finally {
//             session.endSession();
//         }

//     } catch (err) {
//         return next(err);
//     }
// };

export const handlePromoteToAdmin = async (req, res, next) => {
    try {
        const { hospitalId, adminId: staffId } = req.parsedParams;

        const [hospitalExists, staffExists] = await Promise.all([
            Hospital.exists({ _id: hospitalId }),
            Staff.exists({ _id: staffId, hospitalId })
        ]);

        if (!hospitalExists) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

        if (!staffExists) {
            return next(
                new APIError(404, "Staff Member not found in this hospital")
            );
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const hospital = await Hospital.findOneAndUpdate(
                { _id: hospitalId },
                {
                    $addToSet: { adminIds: staffId }
                },
                { returnDocument: true, runValidators: true, session }
            );

            await Staff.findOneAndUpdate(
                { _id: adminId },
                {
                    $set: { role: "Admin" }
                },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                message: "Admin added successfully",
                data: hospital
            });

        } catch (err) {
            await session.abortTransaction();

            return next(err);
        } finally {
            session.endSession();
        }

    } catch (err) {
        return next(err);
    }
};

export const handleRemoveAdmin = async (req, res, next) => {
    try {
        const { hospitalId, adminId } = req.parsedParams;
        const { role } = req.parsedBody;

        const [hospitalExists, staffExists] = await Promise.all([
            Hospital.exists({ _id: hospitalId }),
            Staff.exists({ _id: adminId, hospitalId })
        ]);

        if (!hospitalExists) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

        if (!staffExists) {
            return next(
                new APIError(404, "Admin data not found in this hospital")
            );
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const hospital = await Hospital.findOneAndUpdate(
                {
                    _id: hospitalId,
                    adminIds: adminId,
                    "adminIds.1": { $exists: true }
                },
                {
                    $pull: { adminIds: adminId }
                },
                { returnDocument: true, runValidators: true, session }
            );

            if (!hospital) {
                return next(
                    new APIError(
                        400,
                        "Cannot remove admin. A hospital must have at least one active administrator."
                    )
                );
            }

            await Staff.findOneAndUpdate(
                { _id: adminId },
                {
                    $set: { role }
                },
                { session }
            );

            await session.commitTransaction();

            return res.status(200).json({
                message: "successfully removed the admin",
                data: hospital
            });

        } catch (err) {
            await session.abortTransaction();

            return next(err);
        } finally {
            session.endSession();
        }

    } catch (err) {
        return next(err);
    }
};