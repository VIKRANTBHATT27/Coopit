import { Hospital, Staff, User } from "../models/index.js";
import APIError from "../utils/APIError.utils";

export const handleGetAll = async (req, res, next) => {
    try {
        const { page, limit, role } = req.parsedQuery;
        const { hospitalId } = req.user;

        const skip = (page - 1) * limit;

        const filter = { hospitalId, ...(role && { role }) };

        const [total, staffList] = await Promise.all([
            Staff.countDocuments(filter),
            Staff.find(filter)
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 })
        ]);

        if (!staffList.length) {
            return res.status(200).json({
                data: [],
                message: "No staff found"
            });
        }

        return res.status(200).json({
            data: staffList,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasNextPage: page < Math.ceil(total / limit),
                hasPrevPage: page > 1
            }
        });

    } catch (err) {
        return next(err);
    }
};

export const handleLookUp = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff not activated or Invalid StaffId")
            );
        }

        return res.status(200).json({
            message: "Details of Staff Member",
            data: staffMember
        });

    } catch (err) {
        return next(err);
    }
};

export const handleRegister = async (req, res, next) => {
    try {
        const { userId, employeeId, department, role, shift, designation } = req.parsedBody;

        // add hospitalId in authToken
        const { hospitalId } = req.user;

        const user = await User.findById(userId);
        if (!user) {
            return next(
                new APIError(404, "User not found"),
            );
        }

        const staffMember = await Staff.create({
            ...req.parsedBody,
            hospitalId
        });


        return res.status(201).json({
            message: "successfully created staffMember",
            EmpId: staffMember.employeeId,
            staffId: staffMember._id,
        });

    } catch (err) {
        return next(err);
    }
};

export const handleChangeRole = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { role } = req.parsedBody;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff not activated or Invalid StaffId")
            );
        }

        await staffMember.updateOne({
            $set: { role }
        });

        return res.status(200).json({
            message: "updated role successfully"
        });

    } catch (err) {
        return next(err);
    }
};

export const handleChangeDetails = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff not activated or Invalid StaffId")
            );
        }

        await staffMember.updateOne({
            $set: req.parsedBody
        });

        return res.status(200).json({
            message: "updated details successfully"
        });
    } catch (err) {
        return next(err);
    }
};

export const handleReactivate = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "INACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff Account is already activated or Invalid StaffId")
            );
        }

        await staffMembers.updateOne({
            $set: { status: "ACTIVE" }
        });

        return res.status(200).json({
            message: "Staff Member got Inactive account"
        });

    } catch (err) {
        return next(err);
    }
};

export const handleDeactivate = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff Account is already activated or Invalid StaffId")
            );
        }

        await staffMembers.updateOne({
            $set: { status: "INACTIVE" }
        });

        return res.status(200).json({
            message: "Staff Member got Inactive account"
        });
    } catch (err) {
        return next(err);
    }
};