import { Patient, Staff, Nurse, Doctor, Receptionist, LabTechnician, User, PendingUser, Otp } from "../models/index.js";
import mongoose from "mongoose";
import {
     createPasswordHash,
     passwordMatch
} from "../utils/password.utils.js";
import {
     getDataFromToken
} from "../utils/token.utils.js";


import {
     checkPhoneOtpAndGenerateToken,
     generateAndSendEmailOtp,
     generateAndSendPhoneOtp
} from "../utils/otp.utils.js";

import { config } from "dotenv";
import { fetchPhoneNumber } from "../infrastructure/twilio.service.js";
config();

// a route for sending otp only may be ?
export const handleUserSignup = async (req, res, next) => {
     try {
          const { emailId, phoneNumber } = req.parsedBody;

          const [existingUser, existingPending] = await Promise.all([
               User.exists({ emailId }),
               PendingUser.exists({ emailId })
          ]);

          if (existingUser)
               return res.status(409).json({
                    err: "This email already registered"
               });

          if (existingPending)
               return res.status(409).json({
                    err: "OTP already sent, please verify"
               });

          const isValid = await fetchPhoneNumber(phoneNumber);
          if (!isValid)
               return res.status(400).json({
                    err: "Invalid Phone Number"
               });

          const tempUser = await PendingUser.create({
               ...req.parsedBody,
               phoneNumberEnc: phoneNumber,
               passwordHash: password
          });

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

          if (!tempUser)
               return res.status(404).json({
                    err: "no user found with this emailId"
               });

          const [user, otp] = await Promise.all([
               Otp.findOneAndDelete({ userId: tempUser._id }).session(session),
               User.create(
                    [{
                         ...tempUser,
                         isVerified: true
                    }],
                    { session }
               )
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
          if (!user) return res.status(404).json({ err: "user not found" });

          const isVerified = await argon2.verify(user.passwordHash, password);
          if (!isVerified) return res.status(401).json({ err: "invalid password" });

          await generateAndSendPhoneOtp(user);

          return res.status(200).json({ success: true, emailId: user.emailId });
     } catch (err) {
          return next(err);
     }
};

export const handleVerifyUserLogin = async (req, res, next) => {
     try {
          const { emailId, otpCode } = req.parsedBody;

          const user = await User.findOne({ emailId });
          if (!user) return res.status(404).json({ err: "invalid emailId" });

          const token = await checkPhoneOtpAndGenerateToken(user._id, otpCode);

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

export const handleLogout = async (req, res, next) => {
     try {
          if (!req.user) return res.status(401).json({ success: false, err: "unauthorized" });

          res.clearCookie("authToken");

          return res.status(200).json({ success: true, msg: "logout successful" });
     } catch (err) {
          return next(err);
     }
}

// export const handleGetUserFromToken = async (req, res, next) => {
//      try {
//           const { userId } = req.user;

//           const user = await User.findById(userId);
//           if (!user)
//                return res.status(404).json({ err: "No user found with this Id" });

//           return res.status(200).json({ success: true, data: user });
//      } catch (err) {
//           return next(err);
//      }
// };

export const handleUserUpdate = async (req, res, next) => {
     try {
          const { password, phoneNumber } = req.parsedBody;
          const { userId } = req.user;

          const updatedUser = await User.findByIdAndUpdate(
               userId,
               {
                    $set: {
                         ...req.parsedBody,
                         passwordHash: password,
                         phoneNumberEnc: phoneNumber
                    }
               },
               { returnDocument: "after" }
          );

          if (!updatedUser) return res.status(400).json({ err: "Invalid user" });

          return res.status(200).json({ success: true, data: updatedUser });
     } catch (err) {
          return next(err);
     }
};

export const handleUpdatePhone = async (req, res, next) => {
     try {
          const { emailId, password, phoneNumber } = req.parsedBody;

          const user = await User.findOne({ emailId });
          if (!user) return res.status(404).json({ err: "user not found" });

          const isVerified = await argon2.verify(user.passwordHash, password);
          if (!isVerified) return res.status(401).json({ err: "invalid password" });

          const isValid = await fetchPhoneNumber(phoneNumber);
          if (!isValid)
               return res.status(400).json({
                    err: "Invalid Phone Number"
               });

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

// export const handleUserPasswordReset = async (req, res) => {
// // otp on email => otp fill and then pass reset window => version 2
//      try {
//           const { emailId, oldPass, newPass } = req.parsedBody;

//           // if (oldPass !== newPass) return res.status(404).json({ msg: "new password matches old password" });

//           const user = await userModel.findOne({ emailId });
//           if (!user) return res.status(404).json({ msg: "User not found" });

//           const isPassMatch = await passwordMatch(user.password, oldPass);
//           if (!isPassMatch) return res.status(401).json({ err: "Password not matched!" });

//           const hashedPassword = await createPasswordHash(newPass);

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
