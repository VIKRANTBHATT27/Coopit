import { config } from "dotenv";
config();

import { checkOneTimePassword, sendOneTimePassword } from "../services/phone-number.service.js";
import { createPasswordHash, passwordMatch } from "../services/password.service.js";
import { generateToken, getUserFromToken } from "../utils/token.utils.js";
import userModel from "../models/user.models.js";
import mongoose from "mongoose";
import Patient from "../models/Patient.js";
import Staff from "../models/Staff.js";
import Nurse from "../models/Nurse.js";
import Doctor from "../models/Doctor.js";
import Receptionist from "../models/Receptionist.js";
import LabTechnician from "../models/LabTechnician.js";

import resolveRoleReferences from "../services/role-reference.service.js";

export const handleUserSignup = async (req, res) => {
     try {
          const isAlreadyUser = await userModel.findOne({ emailId: req.parsedBody.emailId });
          if (isAlreadyUser) return res.status(400).json({ msg: "User already exist with this Email" });

          const hashedPassword = await createPasswordHash(req.parsedBody.password);

          const user = await userModel.create({
               ...parsedData,
               password: hashedPassword,
          });

          return res.status(201).json({
               msg: "successfully created a user",
               userId: user._id
          });
     } catch (error) {
          console.error("User signup Failed\n", error.message);

          if (error.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUserLogin = async (req, res) => {
     try {
          const user = await userModel.findOne({ emailId });
          if (!user) throw new Error("User not found");

          const isPassMatched = await passwordMatch(user.password, password);
          if (!isPassMatched) return res.status(400).json({ err: "Invalid Credientials" });

          return res.status(200).json({ msg: "success", emailId: user.emailId });
     } catch (err) {
          console.error("User Login Failed\n", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUserSendOtp = async (req, res) => {
     try {
          const user = await userModel.findOne({ emailId: req.parsedBody.emailId });

          if (!user) return res.status(400).json({ err: "no user exists" });

          const response = await sendOneTimePassword(user.phoneNumber);

          console.log("response: ", response);
          return res.status(200).json(response);
     } catch (err) {
          console.error("Cannot Send OTP\N", err.message);
          return res.status(500).json({ err: 'INTERNAL SERVER ERROR' });
     }
};

export const handleUserLoginCheckOtp = async (req, res) => {
     try {
          const response = await checkOneTimePassword(req.parsedBody.otp);
          console.log(response);

          if (!response) return res.status(401).json({ msg: "incorrect otp" });

          const user = await userModel.findOneAndUpdate(
               { emailId },
               { $set: { isVerified: true } },
               { returnDocument: "after"  }
          );
          if (!user) return res.status(404).json({ err: "invalid emailId" });

          const { staffId, roleDoc } = resolveRoleReferences(user);

          const token = generateToken(user, staffId, roleDoc);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: process.env.NODE_ENV === "production",
               sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
               maxAge: 24 * 60 * 60 * 1000
          });

          return res.status(200).json({ msg: "login successful" });
     } catch (err) {
          console.error("failed during user otp check\n", err);
          return res.status(500).json({ err: 'INTERNAL SERVER ERROR' });
     }
};

export const handleLogout = async (req, res) => {
     try {
          res.clearCookie("authToken");

          return res.status(200).json({ msg: "logout successful" });
     } catch (err) {
          console.err("Failed Logout", err);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
}

export const handleGetUser = async (req, res) => {
     if (!req.params.Id || !mongoose.Types.ObjectId.isValid(req.params.Id)) return res.status(400).json({ err: "Invalid user Id" });

     try {
          const user = await userModel.findById(Object(req.params.Id));
          if (!user) return res.status(404).json({ err: "No user found with this Id" });

          return res.status(200).json(user);
     } catch (err) {
          console.error("failed getting user details form db\n", err.message);
          return res.status(500).json({ error: "Error fetching user data" });
     }
};

export const handleGetUserFromToken = async (req, res) => {
     try {
          const user = getUserFromToken(req.cookies.authToken);
          console.log(user);

          return res.status(200).json(user);
     } catch (err) {
          console.error("error: ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
}

export const handleUserUpdate = async (req, res) => {
     try {
          const updatedUser = await userModel.findOneAndUpdate(
               { emailId: req.parsedBody.emailId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!updatedUser) {
               return res.status(400).json({ err: "No user found with this emailId" });
          }

          return res.status(200).json(updatedUser);
     } catch (err) {
          console.log("error: ", err.message);

          if (err.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUserPasswordReset = async (req, res) => {

     try {
          const { emailId, oldPass, newPass } = req.parsedBody;

          if (oldPass !== newPass) return res.status(404).json({ msg: "new password matches old password" });

          const user = await userModel.findOne({ emailId });
          if (!user) return res.status(404).json({ msg: "User not found" });

          const isPassMatch = await passwordMatch(user.password, oldPass);
          if (!isPassMatch) return res.status(401).json({ err: "Password not matched!" });

          const hashedPassword = await createPasswordHash(newPass);

          await userModel.findOneAndUpdate({ emailId },
               { $set: { password: hashedPassword } },
               { returnDocument: "after" }
          );

          return res.status(200).json({ msg: "successfully updated the password", Id: user._id });
     } catch (err) {
          console.log("error: ", err.message);

          if (
               err.message === "Password not matched" ||
               err.message === "User not found" ||
               err.message === "ValidationError"
          ) {
               return res.status(401).json({ err: err.message });
          }

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetUserLookup = async (req, res) => {
     try {
          const { emailId } = req.parsedBody;

          const user = await userModel.findOne({ emailId }).select("_id");
          if (!user) return res.status(404).json({ msg: "no user found" });

          return res.status(200).json({ status: "ok", userId: user._id });
     } catch (err) {
          console.error("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};