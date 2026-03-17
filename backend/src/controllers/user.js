import { sendOneTimePassword } from "../service/checkPhoneNumber.js";
import checkPassword from "../service/checkPassword.js";
import { generateToken } from "../service/auth.js";
import userModel from "../models/userModel.js";
import * as z from "zod";

const userSchema = z.object({
     fullName: z.string().min(1).max(60),
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
     password: z.string().min(8).regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/, "Invalid Password"),
     phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     dateofBirth: z.string().regex(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/, "Date of Birth must be in MM/DD/YYYY format").optional(),
     state: z.string(),
     districtName: z.string(),
     landmark: z.string(),
     birthPlace: z.string(),
     isVerified: z.boolean(),
});

const loginSchema = userSchema.pick({
     emailId: true,
     password: true,
});

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

          return res.status(200).json({ ...token, msg: "✅successfully login" });
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
          const user = await userModel.find({ emailId: req.body.emailId });

          const response = sendOneTimePassword(user.phoneNumber);

          return response;
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

export const handleUserLoginCheckOtp = async (req, res) => {
     if (!req.body || object.keys(req.body).length === 0)
          return res.staus(400).json({ err: "no data is provided!" });

     try {
          if (!req.body.emailId || !req.body.otp) return res.status(404).json({ err: "emailId and otp are not provided!" });

          const response = checkOneTimePassword(req.body.otp);

          if (!response) return res.status(401).json({ msg: "incorrect otp" });

          //create token: 
          const user = await userModel.find({ emailId: req.body.emailId });

          const token = generateToken(user, user.role);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: false,                //turn it to true on deployment
          });

          return res.status(200).json({ ...token, msg: "successfullly login" });
     } catch (err) {
          console.log("error: ", error.message);
          return null;
     }
};

export const handleLogout = (req, res) => {
     res.clearCookie("token");
     return res.status(200).json({ msg: "✅ successfully logged out" });
}

//get User
export const handleGetUser = async (req, res) => {
     try {
          const user = await userModel.findById(req.params.Id);

          if (!user) return res.status(404).json({ err: "No user found with this Id" });

          return res.status(200).json(user);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ error: "Error fetching user data" });
     }
};

// update controller
export const handleUserUpdate = async (req, res) => {
     if (!req.body || Object.keys(req.body) === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const parsedData = userSchema.parse(req.body);

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

          return null;
     }
};

// reset password, but first check the authentication of the user for this route
export const handleUserPasswordReset = async (req, res) => {
     if (!req.body || object.keys(req.body).length === 0)
          return res.staus(400).json({ err: "no data is provided!" });

     try {
          const parsedData = loginSchema.parse(req.body);

          // req.body => old and new password
          const { emailId, oldPass, newPass } = req.body;

          const user = checkPassword(emailId, oldPass);

          const hashedPassword = await bcrypt.hash(newPass, 13);

          await userModel.findOneAndUpdate({ emailId },
               { $set: { password: hashedPassword } },
               { returnDocument: "after" }
          );

          return res.status(200).json({ msg: "✅ successfully updated the password" });
     } catch (err) {
          console.log("error: ", err.message);

          if (
               err.message === "Password not matched" ||
               err.message === "User not found" ||
               err.message === "ValidationError"
          ) {
               return res.status(401).json({ err: err.message });
          }

          return null;
     }
};
