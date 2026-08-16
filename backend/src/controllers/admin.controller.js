import { Hospital, Staff, User } from "../models/index.js";
import APIError from "../utils/APIError.utils";

export const handleGetAllStaff = async (req, res, next) => {
    try {
        const { role } = req.parsedBody;
        const { hospitalId } = req.user;

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

        const allStaff = await Staff.find({
            hospitalId,
            role
        });

        if (!allStaff) {
            return res.status(204).json({
                message: "No staff account is found"
            });
        }

        return res.status(200).json({
            message: `All Staff account of role: ${role} in your hospital`,
            data: allStaff
        });

    } catch (err) {
        return next(err);
    }
};

export const handleStaffLookUp = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId: hospitalId,
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

export const handleRegisterStaff = async (req, res, next) => {
    try {
        const { userId, employeeId, department, role, shift, designation } = req.parsedBody;

        // add hospitalId in authToken
        const { hospitalId } = req.user;

        const [user, hospital] = await Promise.all([
            User.findById(userId),
            Hospital.findById(hospitalId)
        ]);

        if (!user) {
            return next(
                new APIError(404, "User not found"),
            );
        }

        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
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

export const handleChangeStaffRole = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { role } = req.parsedBody;
        const { hospitalId } = req.user;

        const [hospital, staffMember] = await Promise.all([
            Hospital.findById(hospitalId),
            Staff.findOne({
                _id: staffId,
                hospitalId: hospitalId,
                status: "ACTIVE"
            })
        ]);

        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

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

export const handleChangeStaffDetails = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const [hospital, staffMember] = await Promise.all([
            Hospital.findById(hospitalId),
            Staff.findOne({
                _id: staffId,
                hospitalId: hospitalId,
                status: "ACTIVE"
            })
        ]);

        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

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

export const handleReactivateStaff = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const [hospital, staffMember] = await Promise.all([
            Hospital.findById(hospitalId),
            Staff.findOne({
                _id: staffId,
                hospitalId: hospitalId,
                status: "INACTIVE"
            })
        ]);

        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

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

export const handleInactiveStaff = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const [hospital, staffMember] = await Promise.all([
            Hospital.findById(hospitalId),
            Staff.findOne({
                _id: staffId,
                hospitalId: hospitalId,
                status: "ACTIVE"
            })
        ]);

        if (!hospital) {
            return next(
                new APIError(404, "Hospital not found")
            );
        }

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