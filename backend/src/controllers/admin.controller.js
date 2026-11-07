import { Staff, User } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetAllStaffMembers = async (req, res, next) => {
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

        if (staffList.length === 0) {
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

export const handleStaffLookUp = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE",
            role: { $ne: "Admin" },
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

export const handleRegisterStaffMember = async (req, res, next) => {
    try {
        const { userId } = req.parsedBody;
        const { hospitalId } = req.user;

        const [userExsists, staffExists] = await Promise.all([
            User.exists({ _id: userId }),
            Staff.exists({ userId, hospitalId })
        ]);

        if (!userExsists) {
            return next(
                new APIError(404, "User not found"),
            );
        }

        if (staffExists) {
            return next(
                new APIError(409, "User is already registered as staff"),
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

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE",
            role: { $ne: "Admin" },
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

export const handleChangeStaffDetails = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOne({
            _id: staffId,
            hospitalId,
            status: "ACTIVE",
            role: { $ne: "Admin" },
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff not activated or Staff do not exist")
            );
        }

        staffMember.set(req.parsedBody);
        await staffMember.save();

        return res.status(200).json({
            message: "updated details successfully"
        });
    } catch (err) {
        return next(err);
    }
};

export const handleToggleStaffStatus = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { status } = req.parsedBody;
        const { hospitalId } = req.user;

        const staffMember = await Staff.findOneAndUpdate(
            {
                _id: staffId,
                hospitalId,
                status: { $ne: status },
                role: { $ne: "Admin" },
            },
            { $set: { status } },
            { returnDocument: true, runValidator: true }
        );

        if (!staffMember) {
            const exists = await Staff.exists({
                _id: staffId,
                hospitalId,
            });

            if (!exists) {
                return next(
                    new APIError(404, "No Staff Account found")
                );
            }

            return next(
                new APIError(400, `Staff Account is already set to ${status}`)
            );
        }

        return res.status(200).json({
            message: `successfully marked Staff Account  as ${status}`,
            data: staffMember
        });

    } catch (err) {
        return next(err);
    }
};
