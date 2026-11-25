import { Staff, User } from "../models/index.js";
import APIError from "../utils/ApiError.utils.js";
import ApiResponse from "../utils/ApiResponse.utils.js";

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
                .populate({
                    path: "userId"
                })
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
            status: "ACTIVE"
        }).populate({
            path: "userId"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff record not found")
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
        const { userId } = req.parsedParams;
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
            hospitalId,
            userId
        });

        await staffMember.populate({
            path: "userId"
        });

        return res.status(201).json(
            new ApiResponse(
                201,
                staffMember,
                "successfully created staff Member",
            )
        );

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
            status: "ACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff record not found")
            );
        }

        if (staffMember.role === "HOSPITAL_ADMIN") {
            new APIError(
                401,
                "This staff member is a hospital admin and cannot have their role changed"
            )
        }

        staffMember.role = role;
        await staffMember.save({ new: true, validateBeforeSave: true });

        return res.status(200).json(
            new ApiResponse(
                200,
                staffMember,
                "updated staff role successfully"
            )
        );
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
            status: "ACTIVE"
        });

        if (!staffMember) {
            return next(
                new APIError(404, "Staff record not found")
            );
        }

        if (staffMember.role === "HOSPITAL_ADMIN") {
            return next(
                new APIError(
                    401,
                    "This staff member is a hospital admin and cannot have their role changed"
                )
            )
        }

        staffMember.set(req.parsedBody);
        await staffMember.save({ validateBeforeSave: true, new: true });

        return res.status(200).json(
            new ApiResponse(
                200,
                staffMember,
                "updated details successfully"
            )
        );

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
                role: { $ne: "HOSPITAL_ADMIN" },
            },
            { $set: { status } },
            { returnDocument: 'after', runValidator: true }
        );

        if (!staffMember) {
            const staffExists = await Staff.findOne({
                _id: staffId,
                hospitalId,
            }).select("role");

            if (!staffExists) {
                return next(
                    new APIError(404, "No Staff Account found")
                );
            }

            if (staffExists.role === "HOSPITAL_ADMIN") {
                return next(
                    new APIError(
                        401,
                        "This staff member is a hospital admin and cannot have their role changed"
                    )
                )
            }

            return next(
                new APIError(400, `Staff Account is already set to ${status}`)
            );
        }

        return res.status(200).json({
            message: `successfully marked Staff Account as ${status}`,
            data: staffMember
        });

    } catch (err) {
        return next(err);
    }
};
