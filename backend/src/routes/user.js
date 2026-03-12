import { sendOneTimePassword } from "../service/checkPhoneNumber.js";
import { generateToken } from "../service/auth.js";
import userModel from "../models/userModel.js";

const userSchema = z.object({
     fullName: z.string().min(1),
     emailId: z.string().email(),
     password: z.string().min(8),
     phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     dateofBirth: z.date().optional(),
     state: z.string(),
     districtName: z.string(),
     landmark: z.string(),
     birthPlace: z.string(),
     isVerified: z.boolean(),
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
          await userModel.matchPassword_and_GenerateToken(emailId, password);
                    
          // res.cookie("authToken", token, {
          //      httpOnly: true,
          //      secure: false,                //turn it to true on deployment
          // });
     } catch (error) {
          console.log("error: ", error.message);

          if (error.message === "Password not matched") return res.status(400).json({ err: "Invalid Credientials" });

          return null;
     }

     return res.status(200).json({ msg: "✅successfully login" });
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

          if (error.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return null;
     }
};

// reset password
export const handleUserLoginSendOtp = async (req, res) => {
     if (!req.body.emailId)
          return res.staus(400).json({ err: "no emailId is provided!" });

     try {
          const user = await userModel.find({ emailId: req.body.emailId });

          const response = sendOneTimePassword(user.phoneNumber);

          return user;
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


          const user = await userModel.find({ emailId: req.body.emailId });
          
          //create token;
          const token = generateToken(user);

          return res.status(200).json({ ...token, msg: "successfullly login" });
     } catch (err) {
          console.log("error: ", error.message);
          return null;
     }
};