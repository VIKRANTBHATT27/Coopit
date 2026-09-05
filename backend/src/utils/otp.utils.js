import crypto from "node:crypto";
import APIError from "./APIError.utils.js";
import { dispatchSMS } from "../infrastructure/twilio.js";
import { decryptPhoneFn } from "./phoneNumber.utils.js";
import { Otp, PendingUser } from "../models/index.js";
import sendMail from "../infrastructure/sendGrid.js";

import OTPGenerationSchema from "../zodSchemas/otp.schema.js";

const generateOTP = async (data) => {
    const { otpType, userId } = OTPGenerationSchema.parse(data);

    const oneTimePassword = crypto.randomInt(100000, 1000000).toString();

    await Otp.findOneAndUpdate(
        { userId },
        {
            otpType,
            otpCode: oneTimePassword,
            createdAt: new Date()
        },
        { upsert: true }
    );

    return oneTimePassword;
};

export const generateAndSendPhoneOtp = async ({ _id: userId, phoneNumberEnc, phoneIV, phoneAuthTag }) => {
    const oneTimePassword = await generateOTP({
        userId,
        otpType: 'PHONE',
    });

    const phoneNo = decryptPhoneFn(phoneNumberEnc, phoneIV, phoneAuthTag);

    const response = await dispatchSMS(phoneNo, oneTimePassword);

    if (!response) {
        await Otp.findOneAndDelete({ userId });
        throw new APIError(500, "SMS Gateway failed to dispatch OTP code");
    }
};

export const checkPhoneOtp = async (userId, otpCode) => {
    const otpRecord = await Otp.findOne({ userId });

    if (!otpRecord)
        throw new APIError(404, "OTP expired or not found");

    if (otpRecord.attempts >= 3) {
        await Otp.findByIdAndDelete(otpRecord._id);

        throw new APIError(429, "Too many attempts. Please login again.");
    }

    if (otpCode !== otpRecord.otpCode) {
        await Otp.findByIdAndUpdate(otpRecord._id,
            {
                $inc: { attempts: 1 }
            }
        );

        throw new APIError(401, "Incorrect OTP");
    }
};

export const generateAndSendEmailOtp = async ({ _id: userId, emailId }) => {
    const oneTimePassword = await generateOTP({
        userId,
        otpType: 'EMAIL',
    });

    const response = await sendMail(emailId, oneTimePassword);

    if (!response) {
        await Otp.findOneAndDelete({ userId });

        await PendingUser.findByIdAndDelete(userId);

        throw new APIError(
            500,
            "Email Gateway failed to dispatch an otp"
        );
    }

    return response;
};

export const checkEmailOtp = async (userId, otpCode) => {
    const otpRecord = await Otp.findOne({ userId });
    if (!otpRecord)
        throw new APIError(404, "OTP expired");

    if (otpRecord.attempts >= 3) {
        await Otp.findByIdAndDelete(otpRecord._id);

        throw new APIError(429, "Too many attempts. Please login again.");
    }

    if (otpCode !== otpRecord.otpCode) {
        await Otp.findByIdAndUpdate(otpRecord._id,
            {
                $inc: { attempts: 1 }
            }
        );

        throw new APIError(401, "Incorrect OTP");
    }
};