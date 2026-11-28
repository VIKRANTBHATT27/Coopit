import { User, PasswordReset } from "../models/index.js";
import {
    hashPassword,
    passwordMatch
} from "../utils/password.utils.js";
import {
    generateAccessAndRefreshToken
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
import ApiResponse from "../utils/ApiResponse.utils.js";

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

        const hashedPassword = await hashPassword(password);

        const tempUser = await User.create({
            ...req.parsedBody,
            phoneNumberEnc: phoneNumber,
            passwordHash: hashedPassword
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

        if (tempUser.emailIdVerified) {
            return next(
                new APIError(409, "emailId already registered")
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
        const { emailId } = req.parsedBody;

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

        if (tempUser.mfaEnabled) {
            return next(
                new APIError(404, "mfa is already verified")
            );
        }

        const mfaSecret = speakeasy.generateSecret({
            name: "Coopit"
        });

        const encryptedPayload = encryptSecret(mfaSecret.base32);

        tempUser.mfaEncryptedPayload = encryptedPayload;
        tempUser.mfaEnabled = true;

        await tempUser.save();

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
        const { emailId, otpCode } = req.parsedBody;

        const tempUser = await User.findOne({ emailId })
            .select("_id mfaEncryptedPayload mfaEnabled");

        if (!tempUser) {
            return next(
                new APIError(404, "No user found with this email address. Please sign up again.")
            );
        }

        if (!tempUser.mfaEnabled) {
            return next(
                new APIError(400, "multi factor authentication is not enabled.")
            );
        }

        const mfaSecret = decryptSecret(tempUser.mfaEncryptedPayload);

        const isVerified = speakeasy.totp.verify({
            secret: mfaSecret,
            encoding: 'base32',
            token: otpCode,
        });

        if (!isVerified) {
            return res.status(401).json({
                verified: false,
                message: 'Invalid OTP token'
            });
        }

        return res.status(201).json(
            new ApiResponse(
                201,
                {
                    _id: tempUser._id,
                    mfaEnabled: tempUser.mfaEnabled
                },
                "user has been successfully verified. Please login"
            )
        );

    } catch (err) {
        return next(err);
    }
};

export const handleUserLogin = async (req, res, next) => {
    try {
        const { emailId, password, otpCode } = req.parsedBody;

        const user = await User.findOne({ emailId }).select("_id passwordHash mfaEncryptedPayload mfaEnabled role");

        if (!user) {
            return next(
                new APIError(404, "Invalid EmailId")
            );
        }

        if (!user.mfaEnabled) {
            return next(
                new APIError(400, "multi factor authentication is not enabled.")
            );
        }

        const isPassMatch = await passwordMatch(user.passwordHash, password);

        if (!isPassMatch) {
            return next(
                new APIError(401, "Invalid Password")
            );
        }

        const mfaSecret = decryptSecret(user.mfaEncryptedPayload);

        const isVerified = speakeasy.totp.verify({
            secret: mfaSecret,
            encoding: 'base32',
            token: otpCode,
        });

        if (!isVerified) {
            return res.status(401).json({
                verified: false,
                message: 'Invalid OTP token'
            })
        }

        const roleRefDetails = await resolveRoleReferences(user);

        const {
            accessToken,
            refreshToken
        } = generateAccessAndRefreshToken(user, roleRefDetails);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "login successful"
                )
            );
    } catch (err) {
        return next(err);
    }
};

export const handleChangePhone = async (req, res, next) => {
    try {
        const { emailId, password, phoneNumber } = req.parsedBody;

        const user = await User.findOne({ emailId }).select("passwordHash");
        if (!user) {
            return next(
                new APIError(404, "user not found")
            );
        }

        const isVerified = await passwordMatch(user.passwordHash, password);
        if (!isVerified) {
            return next(
                new APIError(401, "Invalid Password")
            );
        }

        user.phoneNumberEnc = phoneNumber;
        await user.save({ validateBeforeSave: false });

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

        await generateAndSendEmailOtp(user);

        return res.status(200).json({
            success: true,
            msg: "OTP has been send on email",
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
                new APIError(404, "Reset Token is expired")
            );
        }

        await checkEmailOtp(resetRecord.userId, otpCode);

        const user = await User.findById(resetRecord.userId);

        user.passwordHash = newPassword;
        await user.save({ validateBeforeSave: false });

        await PasswordReset.deleteOne({ _id: resetRecord._id });

        return res.status(200).json({
            msg: "Password reset successfully. Please login."
        });
    } catch (err) {
        return next(err);
    }
};

export const handleGetUserData = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const userData = await User.findById(userId);

        if (!userData) {
            return next(
                new APIError(404, "Invalid User Id")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                userData,
                "user data fetched successfully"
            )
        );

    } catch (err) {
        return next(err);
    }
};

export const handleGenerateNewAccessToken = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId).select("_id role refreshToken");

        if (!user) {
            throw new APIError(404, "User not found")
        }

        const providedTokenHash = crypto
            .createHash("sha256")
            .update(String(req.refreshToken ?? ""))
            .digest();
        const storedTokenHash = crypto
            .createHash("sha256")
            .update(String(user.refreshToken ?? ""))
            .digest();

        if (!crypto.timingSafeEqual(providedTokenHash, storedTokenHash)) {
            throw new APIError(401, "Refresh token is expired or used. Please login again")
        }

        const roleRefDetails = await resolveRoleReferences(user);

        const {
            accessToken,
            refreshToken
        } = generateAccessAndRefreshToken(user, roleRefDetails);

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: true,
            sameSite: "none"
        };

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    { accessToken, refreshToken },
                    "login successful"
                )
            );

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

        await User.findByIdAndUpdate(
            req.user.userId,
            {
                $unset: {
                    refreshToken: 1         // this removes the field from document
                }
            }
        )

        const options = {
            httpOnly: true,
            secure: true
        }

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logged Out"))
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
        await user.save({ validateBeforeSave: false });

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

// export const handleUpdatePhone = async (req, res, next) => {
//     try {
//         const { userId } = req.user;
//         const { phoneNumber } = req.parsedBody;

//         // const isValid = await fetchPhoneNumber(phoneNumber);

//         // if (!isValid) {
//         //     return next(
//         //         new APIError(400, "Invalid phone")
//         //     );
//         // }

//         const user = await User.findById(userId);
//         if (!user) {
//             return next(
//                 new APIError(404, "User not found")
//             );
//         }

//         user.phoneNumberEnc = phoneNumber;
//         await user.save({ validateBeforeSave: false });

//         res.clearCookie("authToken");

//         return res.status(200).json({
//             msg: "Phone updated. Login again to verify."
//         });

//     } catch (err) {
//         return next(err);
//     }
// };

export const handleUpdatePassword = async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { currentPassword, newPassword } = req.parsedBody;

        if (currentPassword === newPassword) {
            return next(
                new APIError(400, "new password is same as old password")
            );
        }

        const user = await User.findById(userId).select("passwordHash");
        if (!user) {
            return next(
                new APIError(404, "User not found")
            );
        }

        const isPassMatch = await passwordMatch(user.passwordHash, currentPassword);
        if (!isPassMatch) {
            return next(
                new APIError(401, "Password not matched!")
            );
        }

        const hashedPassword = await hashPassword(newPassword);

        user.passwordHash = hashedPassword;
        await user.save({ validateBeforeSave: false });

        res.clearCookie("authToken");
        res.clearCookie("refreshToken");

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

        const userData = await User.findOne({ emailId })
            .select("_id firstName middleName lastName role emailId emailIdVerified mfaEnabled");

        if (!userData) {
            return next(
                new APIError(404, "user not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                userData,
                "User Exists"
            )
        );
    } catch (err) {
        return next(err);
    }
};

export const handleGetUserById = async (req, res, next) => {
    try {
        const { userId } = req.parsedParams;

        const user = await User.findById(userId).select("_id firstName middleName lastName role");

        if (!user) {
            return next(
                new APIError(404, "user not found")
            );
        }

        return res.status(200).json(
            new ApiResponse(
                200,
                user,
                "user data fetched"
            )
        );
    } catch (err) {
        return next(err);
    }
};