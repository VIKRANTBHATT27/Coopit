import { Patient, Staff, Nurse, Doctor, Receptionist, LabTechnician, User, PendingUser, Otp } from "../models/index.js";

import {
     createPasswordHash,
     passwordMatch
} from "../utils/password.utils.js";
import {
     getDataFromToken
} from "../utils/token.utils.js";


import {
     checkOtpAndGenerateToken,
     generateAndSendEmailOtp,
     generateAndSendOtp
} from "../utils/otp.utils.js";

import { config } from "dotenv";
config();

export const handleUserSignup = async (req, res) => {
     try {
          const { emailId } = req.parsedBody;

          const [existingUser, existingPending] = await Promise.all([
               User.findOne({ emailId }),
               PendingUser.findOne({ emailId })
          ]);
          if (existingUser) return res.status(409).json({ err: "Email already registered" });
          if (existingPending) return res.status(409).json({ err: "OTP already sent, please verify" });

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
          console.error("User signup failed\n", err.message);

          return res.status(500).json({ success: false, err: "INTERNAL SERVER ERROR" });
     }
};

export const handleVerifyEmailId = async (req, res) => {
     try {
          const { emailId, otpCode } = req.parsedBody;

          const tempUser = await PendingUser.findOne({ emailId });
          if (!tempUser) return res.status(404).json({ err: "no user found with this emailId" });

          const [user, otp] = await Promise.all([
               User.create({
                    ...tempUser,
                    isVerified: true
               }),
               Otp.findOneAndDelete({ userId: tempUser._id })
          ]);

          return res.status(201).json({ success: true, message: "user has successfully registered" });
     } catch (err) {
          console.error("Failed during user email verification\n", err.message);

          return res.status(500).json({ success: false, err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUserPasswordCheck = async (req, res) => {
     try {
          const { emailId, password } = req.parsedBody;

          const user = await User.findOne({ emailId });
          if (!user) return res.status(404).json({ err: "User not found" });

          const isPassMatched = await passwordMatch(user.password, password);
          if (!isPassMatched) return res.status(400).json({ err: "Invalid Credientials" });

          return res.status(200).json({ success: true, emailId: user.emailId });
     } catch (err) {
          console.error("User Login Failed\n", err.message);

          return res.status(500).json({ success: false, err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUserSendOtp = async (req, res) => {
     try {
          const { emailId } = req.parsedBody;

          const user = await User.findOne({ emailId });
          if (!user) return res.status(400).json({ err: "no user exists" });

          await generateAndSendOtp(user);

          return res.status(200).json({ success: true, msg: "otp send successfully" });
     } catch (err) {
          console.error("Cannot Send OTP\n", err.message);
          return res.status(500).json({ success: false, err: 'INTERNAL SERVER ERROR' });
     }
};

export const handleUserLoginCheckOtp = async (req, res) => {
     try {
          const { otpCode, emailId } = req.parsedBody;

          const user = await userModel.findOne({ emailId });
          if (!user) return res.status(404).json({ err: "invalid emailId" });

          const token = await checkOtpAndGenerateToken(user.phoneNumberHash, otpCode, emailId);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
               maxAge: 24 * 60 * 60 * 1000
          });

          return res.status(200).json({ success: true, msg: "login successful" });
     } catch (err) {
          console.error("failed during user otp check\n", err);
          return res.status(500).json({ success: false, err: 'INTERNAL SERVER ERROR' });
     }
};

export const handleLogout = async (req, res) => {
     try {
          res.clearCookie("authToken");

          return res.status(200).json({ success: true, msg: "logout successful" });
     } catch (err) {
          console.err("Failed Logout", err);

          return res.status(500).json({ success: false, err: "INTERNAL SERVER ERROR" });
     }
}

export const handleGetUserFromToken = async (req, res) => {
     try {
          const { userId } = req.user;

          const user = await User.findById(userId);
          if (!user) return res.status(404).json({ err: "No user found with this Id" });

          return res.status(200).json({ success: true, data: user });
     } catch (err) {
          console.error("error: ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};


export const handleUserUpdate = async (req, res) => {
     try {
          const { userId } = req.user;

          const updatedUser = await User.findByIdAndUpdate(
               userId,
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!updatedUser) return res.status(400).json({ err: "Invalid userId" });

          return res.status(200).json({ success: true, data: updatedUser });
     } catch (err) {
          console.log("failed to update user query\n", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
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
