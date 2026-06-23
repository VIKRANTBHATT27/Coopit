import crypto from "crypto";
import APIError from "./APIError.utils.js";
import { dispatchSMS } from "../services/twilio.service.js";
import { decryptPhoneFn, hashPhone } from "./phoneNumber.utils.js";
import { User, Otp } from "../models/index.js";
import resolveRoleReferences from "./roleReference.utils.js";
import { generateToken } from "./token.utils.js";
import mongoose from "mongoose";
import sendMail from "../services/sendGrid.service.js";

const generateOTP = async (type, userId) => {
     if (!['EMAIL', 'PHONE'].includes(type)) {
          throw new APIError(400, "Invalid OTP type. Must be EMAIL or PHONE");
     }
     if (!userId || !mongoose.Schema.Types.ObjectId(userId)) {
          throw new APIError(400, "Invalid mongoose Id");
     }

     const oneTimePassword = crypto.randomInt(100000, 1000000).toString();

     await Otp.findOneAndUpdate(
          { userId },
          {
               otpCode: oneTimePassword,
               otpType: type,
               createdAt: new Date()
          },
          { upsert: true }
     );

     return oneTimePassword;
};


export const generateAndSendPhoneOtp = async ({ _id: userId, phoneNumberEnc, phoneIV, phoneAuthTag }) => {
     const oneTimePassword = await generateOTP('PHONE', userId);

     const phoneNo = decryptPhoneFn(phoneNumberEnc, phoneIV, phoneAuthTag);

     const response = await dispatchSMS(phoneNo, oneTimePassword);

     if (!response) {
          await Otp.findOneAndDelete({ userId });
          throw new APIError(500, "SMS Gateway failed to dispatch OTP code");
     }
};

export const checkPhoneOtpAndGenerateToken = async (userId, otpCode) => {
     const otpRecord = await Otp.findOne({ userId });

     if (!otpRecord) throw new APIError(404, "OTP expired or not found");

     if (otpCode !== otpRecord.otpCode) throw new APIError(401, "Incorrect OTP");

     const user = await User.findByIdAndUpdate(
          userId,
          { $set: { isVerified: true } },
          { returnDocument: "after" }
     );

     const { staffId, roleDoc } = resolveRoleReferences(user);

     const token = generateToken(user, staffId, roleDoc);

     return token;
};

export const generateAndSendEmailOtp = async ({ _id: userId, emailId }) => {
     const oneTimePassword = await generateOTP('EMAIL', userId);

     const response = await sendMail(emailId, oneTimePassword);

     if (!response) {
          await Otp.findOneAndDelete({ userId });
          throw new APIError(500, "Email Gateway failed to dispatch an otp");
     }
};

export const checkEmailOtp = async (userId, otpCode) => {
     const otpRecord = await Otp.findOne({ userId });

     if (!otpRecord) throw new APIError(404, "OTP expired or not found");

     if (otpCode !== otpRecord.otpCode) throw new APIError(401, "Incorrect OTP");

};