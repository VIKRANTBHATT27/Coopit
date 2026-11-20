import crypto from "node:crypto";
import APIError from "./ApiError.utils.js";
import { decryptPhoneFn } from "./phoneNumber.utils.js";
import { Otp, User } from "../models/index.js";
import sendMail from "../infrastructure/resend.js";

const generateOTP = async (data) => {
    const { otpType, userId } = data;

    const plainOtp = crypto.randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash("sha256").update(plainOtp).digest("hex");

    await Otp.findOneAndUpdate(
        { userId },
        {
            $set: {
                otpType,
                otpCode: otpHash,
                createdAt: new Date()
            },
            $setOnInsert: { userId }
        },
        { upsert: true, setDefaultsOnInsert: true }
    );

    return plainOtp;
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
    const plainOtp = await generateOTP({
        userId,
        otpType: 'EMAIL',
    });

    const response = await sendMail(emailId, plainOtp);

    if (!response) {
        await Otp.findOneAndDelete({ userId });

        await User.findByIdAndDelete(userId);

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

        throw new APIError(429, "Too many attempts. Request a new OTP.");
    }

    const incomingHash = crypto.createHash("sha256").update(otpCode.toString()).digest("hex");

    const providedBuffer = Buffer.from(incomingHash, "hex");
    const storedBuffer = Buffer.from(otpRecord.otpCode, "hex");

    if (
        providedBuffer.length !== storedBuffer.length ||
        !crypto.timingSafeEqual(providedBuffer, storedBuffer)
    ) {
        otpRecord.attempts += 1;
        await otpRecord.save();

        throw new APIError(400, "Invalid OTP");
    }

    await Otp.deleteOne({ userId });
};