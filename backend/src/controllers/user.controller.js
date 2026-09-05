
import { User, PendingUser, Otp, PasswordReset } from "../models/index.js";
import {
    hashPassword,
    passwordMatch
} from "../utils/password.utils.js";
import {
    generateToken,
    getDataFromToken
} from "../utils/token.utils.js";

import {
    checkPhoneOtp,
    generateAndSendEmailOtp,
    generateAndSendPhoneOtp
} from "../utils/otp.utils.js";

import { fetchPhoneNumber } from "../infrastructure/twilio.js";
import APIError from "../utils/APIError.utils.js";
import resolveRoleReferences from "../utils/roleReference.utils.js";
import mongoose from "mongoose";

export const handleGetUserId = async (req, res, next) => {
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

export const handleUserSignup = async (req, res, next) => {
    try {
        const { emailId, phoneNumber } = req.parsedBody;

        const [existingUser, existingPending] = await Promise.all([
            User.exists({ emailId }),
            PendingUser.exists({ emailId })
        ]);

        if (existingUser) {
            return next(
                new APIError(409, "emailId already registered")
            );
        }

        if (existingPending) {
            return next(
                new APIError(409, "OTP already sent, please verify")
            );
        }

        const isValid = await fetchPhoneNumber(phoneNumber);
        if (!isValid) {
            return next(
                new APIError(400, "Invalid Phone Number")
            );
        }

        const tempUser = await PendingUser.create({
            ...req.parsedBody,
            phoneNumberEnc: phoneNumber,
            passwordHash: password
        });

        if (!tempUser) {
            return next(
                new APIError(500, "Failed to create a temp user")
            );
        }

        await generateAndSendEmailOtp(tempUser);

        return res.status(201).json({
            success: true,
            message: 'an Email has been send containing OTP',
            data: tempUser
        });
    } catch (err) {
        return next(err);
    }
};

export const handleVerifyEmailId = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { emailId, otpCode } = req.parsedBody;

        const tempUser = await PendingUser.exists({ emailId });

        if (!tempUser) {
            return next(
                new APIError(404, "no user found with this Email Id")
            );
        }

        const [user, otp] = await Promise.all([
            User.create([
                {
                    ...tempUser,
                    isVerified: true
                }
            ], { session }),
            Otp.findOneAndDelete({ userId: tempUser._id }).session(session),
        ]);

        await session.commitTransaction();

        return res.status(201).json({
            success: true,
            message: "email has been successfully verified"
        });

    } catch (err) {
        await session.abortTransaction();

        return next(err);
    } finally {
        session.endSession();
    }
};

export const handleUserLogin = async (req, res, next) => {
    try {
        const { emailId, password } = req.parsedBody;

        const user = await User.findOne({ emailId });

        if (!user) {
            return next(
                new APIError(404, "Invalid EmailId")
            );
        }

        const isVerified = await argon2.verify(user.passwordHash, password);

        if (!isVerified) {
            return next(
                new APIError(401, "Invalid Password")
            );
        }

        await generateAndSendPhoneOtp(user);

        return res.status(200).json({
            success: true,
            emailId: user.emailId,
            msg: "OTP has been send on phone Number"
        });
    } catch (err) {
        return next(err);
    }
};

export const handleVerifyUserLogin = async (req, res, next) => {
    try {
        const { emailId, otpCode } = req.parsedBody;

        const userData = await User.findOne({ emailId });
        if (!userData) {
            return next(
                new APIError(404, "Invalid EmailId")
            );
        }

        await checkPhoneOtp(user._id, otpCode);

        const user = await User.findByIdAndUpdate(
            user._id,
            { $set: { isVerified: true } },
            { returnDocument: "after" }
        );

        const roleRefDetails = await resolveRoleReferences(user);

        const token = generateToken(user, roleRefDetails);

        res.cookie("authToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 24 * 60 * 60 * 1000
        });

        return res.status(200).json({ success: true, msg: "login successful" });
    } catch (err) {
        return next(err);
    }
};

export const handleChangePhone = async (req, res, next) => {
    try {
        const { emailId, password, phoneNumber } = req.parsedBody;

        const user = await User.findOne({ emailId });
        if (!user) {
            return next(
                new APIError(404, "user not found")
            );
        }

        const isVerified = await argon2.verify(user.passwordHash, password);
        if (!isVerified) {
            return next(
                new APIError(401, "Invalid Password")
            );
        }

        const isValid = await fetchPhoneNumber(phoneNumber);
        if (!isValid) {
            return next(
                new APIError(400, "Invalid Phone Number")
            );
        }

        await User.findByIdAndUpdate(user._id, {
            phoneNumberEnc: phoneNumber
        });

        return res.status(200).json({
            message: "updated user phone number"
        });

    } catch (err) {
        return next(err);
    }
};

export const handleForgotPassword = async (req, res, next) => {
    try {
        const { emailId } = req.parsedBody;

        const user = await User.findOne({ emailId });
        if (!user) {
            return next(
                new APIError(404, "Invalid Email Id")
            );
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        await PasswordReset.create({
            userId: user._id,
            resetToken: resetTokenHash,
            expiresAt: new Date(Date.now() + 5 * 60 * 1000)
        });

        await generateAndSendPhoneOtp(user);

        return res.status(200).json({
            success: true,
            msg: "OTP has been send on phone Number",
            emailId: user.emailId,
            resetToken
        });

    } catch (err) {
        return next(err);
    }
};

export const handleResetPassword = async (req, res, next) => {
    try {
        const { resetToken, otpCode, newPassword } = req.parsedBody;

        const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

        const resetRecord = await PasswordReset.findOne({
            resetToken: resetTokenHash,
            expiresAt: { $gt: new Date() }
        });

        if (!resetRecord) {
            return next(
                new APIError(404, "Password Reset Record not found")
            );
        }

        const otpRecord = await Otp.findOne({ userId: resetRecord.userId });
        if (!otpRecord) {
            return next(
                new APIError(404, "OTP expired or not found")
            );
        }

        if (otpRecord.attempts >= 3) {
            await Otp.findByIdAndDelete(otpRecord._id);

            return next(
                new APIError(429, "Too many attempts. Please login again.")
            );
        }

        if (otpCode !== otpRecord.otpCode) {
            await Otp.findByIdAndUpdate(
                otpRecord._id,
                {
                    $inc: { attempts: 1 }
                }
            );

            return next(
                new APIError(401, "Incorrect OTP")
            );
        }

        const user = await User.findById(resetRecord.userId);

        user.passwordHash = newPassword;
        await user.save();

        await Promise.all([
            PasswordReset.deleteOne({ _id: resetRecord._id }),
            Otp.deleteOne({ _id: otpRecord._id })
        ]);

        return res.status(200).json({
            msg: "Password reset successfully. Please login."
        });
    } catch (err) {
        return next(err);
    }
};

export const handleLogout = async (req, res, next) => {
    try {
        if (!req.user) {
            return next(
                new APIError(403, "Unauthorized Access")
            );
        }

        res.clearCookie("authToken");

        return res.status(200).json({ success: true, msg: "logout successful" });
    } catch (err) {
        return next(err);
    }
}

export const handleUpdateProfile = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId);
        if (!user) {
            return next(
                new APIError(404, "User not found")
            );
        }

        Object.assign(user, req.parsedBody);
        await user.save();

        const {
            phoneIV,
            passwordHash,
            phoneAuthTag,
            phoneNumberHash,
            phoneNumberEnc,
            ...otherDetails
        } = user.toObject();

        return res.status(200).json({ success: true, data: otherDetails });
    } catch (err) {
        return next(err);
    }
};

export const handleUpdatePhone = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { phoneNumber } = req.parsedBody;

        const isValid = await fetchPhoneNumber(phoneNumber);

        if (!isValid) {
            return next(
                new APIError(400, "Invalid phone")
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(
                new APIError(404, "User not found")
            );
        }

        user.phoneNumberEnc = phoneNumber;
        await user.save();

        res.clearCookie("authToken");

        return res.status(200).json({
            msg: "Phone updated. Login again to verify."
        });

    } catch (err) {
        return next(err);
    }
};

export const handleUpdatePassword = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { currentPassword, newPassword } = req.parsedBody;

        if (currentPassword === newPassword) {
            return next(
                new APIError(400, "new password is same as old password")
            );
        }

        const user = await User.findById(userId);
        if (!user) {
            return next(
                new APIError(404, "User not found")
            );
        }

        const isPassMatch = await passwordMatch(user.passwordHash, newPassword);

        if (!isPassMatch) {
            return next(
                new APIError(401, "Password not matched!")
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        user.passwordHash = hashedPassword;
        await user.save();

        res.clearCookie("authToken");

        return res.status(200).json({
            msg: "Password updated. Login again to verify."
        });
    } catch (err) {
        return next(err);
    }
};

// export const handleUserPasswordReset = async (req, res) => {
// // otp on email => otp fill and then pass reset window => version 2
//      try {
//           const { emailId, oldPass, newPass } = req.parsedBody;

//           // if (oldPass !== newPass) return res.status(404).json({ msg: "new password matches old password" });

//           const user = await userModel.findOne({ emailId });
//           if (!user) return res.status(404).json({ msg: "User not found" });

//           const isPassMatch = await passwordMatch(user.password, oldPass);
//           if (!isPassMatch) return res.status(401).json({ err: "Password not matched!" });

//           const hashedPassword = await hashPassword(newPass);

//           await userModel.findOneAndUpdate({ emailId },
//                { $set: { password: hashedPassword } },
//                { returnDocument: "after" }
//           );

//           return res.status(200).json({ msg: "successfully updated the password", Id: user._id });
//      } catch (err) {
//           console.log("error: ", err.message);

//           if (
//                err.message === "Password not matched" ||
//                err.message === "User not found" ||
//                err.message === "ValidationError"
//           ) {
//                return res.status(401).json({ err: err.message });
//           }

//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      }
// };


/*
     LOOKS UNNECCESSARY RIGHT KNOW
*/
// export const handleGetUserLookup = async (req, res) => {
//      try {
//           const { emailId } = req.parsedBody;

//           const user = await userModel.findOne({ emailId }).select("_id");
//           if (!user) return res.status(404).json({ msg: "no user found" });

//           return res.status(200).json({ status: "ok", userId: user._id });
//      } catch (err) {
//           console.error("error: ", err.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      }
// };


//idk why this fn exists
// export const handleGetUser = async (req, res) => {
//      if (!req.params.Id || !mongoose.Types.ObjectId.isValid(req.params.Id)) return res.status(400).json({ err: "Invalid user Id" });

//      try {
//           const user = await userModel.findById(Object(req.params.Id));
//           if (!user) return res.status(404).json({ err: "No user found with this Id" });

//           return res.status(200).json(user);
//      } catch (err) {
//           console.error("failed getting user details form db\n", err.message);
//           return res.status(500).json({ error: "Error fetching user data" });
//      }
// };

export const handleGetUserLookup = async (req, res, next) => {
    try {
        const { emailId } = req.parsedBody;

        const user = await User.findOne({ emailId }).select("_id").lean();

        if (!user) {
            return next(
                new APIError(400, "No user found")
            );
        }

        return res.status(200).json({
            message: "User Exists",
            userId: user._id
        });
    } catch (err) {
        return next(err);
    }
};