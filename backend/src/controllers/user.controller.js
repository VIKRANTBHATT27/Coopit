
import { User, Otp, PasswordReset } from "../models/index.js";
import {
    hashPassword,
    passwordMatch
} from "../utils/password.utils.js";
import {
    generateToken,
    getDataFromToken
} from "../utils/token.utils.js";

import {
    checkEmailOtp,
    checkPhoneOtp,
    generateAndSendEmailOtp,
    generateAndSendPhoneOtp
} from "../utils/otp.utils.js";

import { decryptSecret, encryptSecret } from "../utils/encryptionSecret.utils.js";
import resolveRoleReferences from "../utils/roleReference.utils.js";
import APIError from "../utils/ApiError.utils.js";

import QRCode from "qrcode";
import crypto from "node:crypto";
import speakeasy from "speakeasy";
import mongoose from "mongoose";

import 'dotenv/config';
import ApiResponse from "../utils/ApiResponse.utilis.js";

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
        const { emailId, password, phoneNumber } = req.parsedBody;

        const existingUser = await User.exists({ emailId });

        if (existingUser) {
            if (existingUser.emailIdVerified) {
                return next(
                    new APIError(409, "emailId already registered")
                );
            }

            return next(
                new APIError(
                    409,
                    "An OTP has already been sent. If it has expired, resend new OTP"
                )
            );
        }

        const tempUser = await User.create({
            ...req.parsedBody,
            phoneNumberEnc: phoneNumber,
            passwordHash: password
        });

        if (!tempUser) {
            return next(
                new APIError(500, "Failed to create a user profile")
            );
        }

        await generateAndSendEmailOtp(tempUser);

        const {
            _id,
            firstName,
            middleName,
            lastName,
            emailIdVerified,
            gender,
            role,
            districtName,
            state,
            createdAt,
            mfaEnabled,
        } = tempUser;

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    emailId,
                    _id,
                    firstName,
                    middleName,
                    lastName,
                    emailIdVerified,
                    gender,
                    role,
                    districtName,
                    state,
                    createdAt,
                    mfaEnabled,
                },
                'An OTP has been sent to the email address for verification.'
            )
        );



    } catch (err) {
        return next(err);
    }
};

export const handleSendEmailOTP = async (req, res, next) => {
    try {
        const { emailId } = req.parsedBody;

        const existingUser = await User.findOne({ emailId }).select("_id emailIdVerified").lean();

        if (!existingUser) {
            return next(
                new APIError(404, "User not found")
            );
        }

        if (existingUser.emailIdVerified) {
            return next(
                new APIError(409, "emailId already registered")
            );
        }

        await generateAndSendEmailOtp(existingUser);

        return res.status(201).json(
            new ApiResponse(
                201,
                existingUser,
                'An OTP has been sent to the email address for verification.'
            )
        );

    } catch (err) {
        return next(err);
    }
};

export const handleVerifyEmailId = async (req, res, next) => {
    try {
        const { emailId, otpCode } = req.parsedBody;

        const tempUser = await User.findOne({ emailId });

        if (!tempUser) {
            return next(
                new APIError(404, "no user found with this Email Id")
            );
        }

        await checkEmailOtp(tempUser._id, otpCode);

        tempUser.emailIdVerified = true;
        await tempUser.save();

        return res.status(200).json(
            new ApiResponse(
                200,
                null,
                "email has been successfully verified"
            )
        );

    } catch (err) {
        return next(err);
    }
};

export const handleSetMFA = async (req, res, next) => {
    try {
        const { emailId } = req.body;

        const tempUser = await User.findOne({ emailId });

        if (!tempUser) {
            return next(
                new APIError(404, "no user found with this Email Id")
            );
        }

        if (!tempUser.emailIdVerified) {
            return next(
                new APIError(404, "Email Id is not verified")
            );
        }

        const mfaSecret = speakeasy.generateSecret({
            name: `Coopit (${emailId})`,
        });

        const encryptedPayload = encryptSecret(mfaSecret.base32);

        tempUser.mfaEncryptedPayload = encryptedPayload;
        tempUser.mfaEnabled = true;

        tempUser.save();

        // await is important even though it says doesn't require => DON'T TOUCH IT
        const qrCodeUrl = await QRCode.toDataURL(mfaSecret.otpauth_url);

        res.status(200).json(
            new ApiResponse(
                200,
                qrCodeUrl,      // Render this string inside an <img> tag on your frontend
                "Multi-factor authentication is required."
            )
        );

    } catch (err) {
        return next(err);
    }
};

export const handleVerifyMFA = async (req, res, next) => {
    try {
        const { emailId, otpCode } = req.body;

        const tempUser = await User.findOne({ emailId }).select("_id mfaEncryptedPayload");

        if (!tempUser) {
            return next(
                new APIError(404, "No user found with this email address. Please sign up again.")
            );
        }

        const mfaSecret = decryptSecret(tempUser.mfaEncryptedPayload);

        const isVerified = speakeasy.totp.verify({
            secret: mfaSecret,
            encoding: 'base32',
            token: otpCode,
        });

        console.log(isVerified);
        console.log(otpCode);


        if (!isVerified) {
            return res.status(401).json({
                verified: false,
                message: 'Invalid OTP token'
            });
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                tempUser,
                "email has been successfully registered. Please login"
            )
        );

    } catch (err) {
        return next(err);
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

        // const isValid = await fetchPhoneNumber(phoneNumber);
        // if (!isValid) {
        //     return next(
        //         new APIError(400, "Invalid Phone Number")
        //     );
        // }

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

        // const isValid = await fetchPhoneNumber(phoneNumber);

        // if (!isValid) {
        //     return next(
        //         new APIError(400, "Invalid phone")
        //     );
        // }

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