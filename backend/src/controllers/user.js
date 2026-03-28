import { checkOneTimePassword, sendOneTimePassword } from "../service/checkPhoneNumber.js";
import checkPassword from "../service/checkPassword.js";
import { generateToken, getUserFromToken } from "../service/auth.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import * as z from "zod";

const userSchema = z.object({
     fullName: z.string().min(1).max(60),
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
     password: z.string().min(8, "Password must be at least 8 characters long")
          .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
     phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     dateofBirth: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform(val => new Date(val)).optional(),
     role: z.string(),
     state: z.string(),
     districtName: z.string(),
     landmark: z.string(),
     birthPlace: z.string(),
});
const userUpdationSchema = z.object({
     fullName: z.string().min(1).max(60).optional(),
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
     phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits").optional(),
     gender: z.enum(['Male', 'Female', 'Others']).optional(),
     dateofBirth: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform(val => new Date(val)).optional(),
     role: z.string().optional(),
     state: z.string().optional(),
     districtName: z.string().optional(),
     landmark: z.string().optional(),
     birthPlace: z.string().optional(),
});

// const loginSchema = userSchema.pick({
//      emailId: true,
//      password: true,
// });

export const handleUserSignup = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const isAlreadyUser = await userModel.findOne({ emailId: req.body.emailId });
          if (isAlreadyUser) return res.status(400).json({ msg: "User already exist with this Email" });

          const parsedData = userSchema.parse(req.body);

          const hashedPassword = await bcrypt.hash(parsedData.password, 13);

          const user = await userModel.create({
               ...parsedData,
               password: hashedPassword,
          });

          return res.status(201).json({
               msg: "✅ successfully created a user",
               userId: user._id
          });
     } catch (error) {
          console.log("❌ User signup Failed", error.message);

          if (error.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUserLogin = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     const { emailId, password } = req.body;

     if (!emailId || !password) return res.status(400).json({ err: "emailId and password are required!" });

     try {
          const user = await checkPassword(emailId, password);
          const token = generateToken(user, user.role);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: false,                //turn it to true on deployment
          });

          await userModel.findOneAndUpdate({ emailId },
               { $set: { isVerified: true } }
          );

          return res.status(200).json({ msg: "✅successfully login", token });
     } catch (error) {
          console.log("error: ", error.message);

          if (error.message === "Password not matched") return res.status(400).json({ err: "Invalid Credientials" });

          return null;
     }
};

export const handleUserSendOtp = async (req, res) => {
     if (!req.body.emailId)
          return res.staus(400).json({ err: "no emailId is provided!" });

     try {
          const user = await userModel.findOne({ emailId: req.body.emailId });

          if (!user) return res.status(400).json({ err: "no user exists" });

          const response = await sendOneTimePassword(user.phoneNumber);

          return res.status(200).json(response);
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

export const handleUserLoginCheckOtp = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.staus(400).json({ err: "no data is provided!" });

     try {
          if (!req.body.emailId || !req.body.otp) return res.status(404).json({ err: "emailId and otp are not provided!" });

          const response = await checkOneTimePassword(req.body.otp);
          console.log(response);
          if (!response) return res.status(401).json({ msg: "incorrect otp" });

          //create token: 
          const user = await userModel.findOne({ emailId: req.body.emailId });

          // update is verified

          const token = generateToken(user, user.role);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: false,                //turn it to true on deployment
          });

          await userModel.findOneAndUpdate({ emailId },
               { $set: { isVerified: true } }
          );


          return res.status(200).json({ token, msg: "successfullly login" });
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

export const handleLogout = async (req, res) => {
     try {
          getUserFromToken(req.cookies.authToken);

          res.clearCookie("authToken");

          return res.status(200).json({ msg: "✅ successfully logged out" });
     } catch (error) {
          console.log("error: ", error.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
}

//get User
export const handleGetUser = async (req, res) => {
     try {
          const user = await userModel.findById(Object(req.params.Id));

          if (!user) return res.status(404).json({ err: "No user found with this Id" });

          return res.status(200).json(user);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ error: "Error fetching user data" });
     }
};

export const handleGetUserFromToken = async (req, res) => {
     try {
          const user = getUserFromToken(req.cookies.authToken)

          console.log(user);

          return res.status(200).json(user);
     } catch (err) {
          console.log("error: ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
}

// update controller
export const handleUserUpdate = async (req, res) => {
     if (!req.body || Object.keys(req.body) === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const parsedData = userUpdationSchema.parse(req.body);

          const updatedUser = await userModel.findOneAndUpdate(
               { emailId: req.body.emailId },
               { $set: { ...parsedData } },
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

// reset password, but first check the authentication of the user for this route
export const handleUserPasswordReset = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.staus(400).json({ err: "no data is provided!" });

     try {
          // req.body => old and new password
          const { emailId, oldPass, newPass } = req.body;
          if (!emailId || !oldPass || !newPass) return res.status(400).json({ err: "emailId, oldPassword and newPassword are required fields" });

          if (oldPass !== newPass) return res.status(404).json({ msg: "new password matches old password" });

          const user = await checkPassword(emailId, oldPass);

          const hashedPassword = await bcrypt.hash(newPass, 13);

          await userModel.findOneAndUpdate({ emailId },
               { $set: { password: hashedPassword } },
               { returnDocument: "after" }
          );

          return res.status(200).json({ msg: "✅ successfully updated the password", Id: user._id });
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
