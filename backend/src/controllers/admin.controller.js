import { Receptionist, Staff, User } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetUser = async (req, res, next) => {
    try {
        const { emailId } = req.parsedBody;

        const user = await User.findOne({ emailId }).select("_id").lean();

        if (!user) {
            return next(
                new APIError(404, "User not found")
            );
        }

        return res.status(200).json({
            message: "User found",
            data: { userId: user._id }
        });

    } catch (err) {
        return next(err);
    }
};

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

export const handleRegister = async (req, res, next) => {
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

export const handleChangeRole = async (req, res, next) => {
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

export const handleChangeDetails = async (req, res, next) => {
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

export const handleToggleStatus = async (req, res, next) => {
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

export const handleCreateReceptionist = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;
        const { hospitalId } = req.user;

        const [staffExists, receptionistExists] = await Promise.all([
            Staff.exists({ _id: staffId }),
            Receptionist.exists({ staffId })
        ]);

        if (!staffExists) {
            return next(
                new APIError(404, "Staff Record not found")
            );
        }
        if (receptionistExists) {
            return next(
                new APIError(400, "Receptionist already exists")
            );
        }

        const receptionist = await Receptionist.create({
            ...req.parsedBody,
            hospitalId,
            staffId
        });

        return res.status(201).json({
           message: "Successfully created a Receptionist",
           data: receptionist
        });
    } catch (err) {
        return next(err);
    };
};

export const handleUpdateReceptionist = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId });

          if (!staffRecord)
               return res.status(400).json({
                    err: "No staff record found with this staffId"
               });

          const receptionist = await Receptionist.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         ...req.parsedBody,
                         staffId
                    }
               },
               { returnDocument: "after", runValidator: true }
          );

          if (!receptionist)
               return res.status(404).json({
                    err: "No receptionist found with this staffId"
               });

          return res.status(200).json({
               msg: "successfully updated",
               staffId
          });

     } catch (err) {
          console.error("failed during receptionist updation\nErrorMsg: ", err.message);

          return next(err);
     }
};