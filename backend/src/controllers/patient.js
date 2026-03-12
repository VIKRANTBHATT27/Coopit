import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";
import decryptPhoneNumber from "../service/phoneNumberDecryption.js";
import patientModel from "../models/patientModel.js";
import bcrypt from "bcrypt";
import * as z from "zod";

const patientSchema = z.object({
     fullName: z.string().min(3),
     emailId: z.string().email(),
     password: z.string().min(6),
     phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     dateofBirth: z.date().optional(),
     weight: z.number().optional(),
     height: z.number().optional(),
     bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
     birthPlace: z.string().optional(),

     lifestyle: z.object({
          smoking: z.boolean().default(false),
          alcohol: z.boolean().default(false),
          tobacco: z.boolean().default(false),
          occupation: z.string().optional(),
     }).optional(),

     allergies: z.array(z.string()).optional(),

     location: z.object({
          type: z.literal('Point').default('Point'),
          coordinates: z.array(z.number()).length(2).optional(),
     }).optional(),
});

export const handlePatientSignup = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const isAlreadyPatient = await patientModel.findOne({ emailId: req.body.emailId });
          if (isAlreadyPatient) return res.status(400).json({ msg: "Patient already exist with this Email" });

          const parsedData = patientSchema.parse(req.body);

          const hashedPassword = await bcrypt.hash(parsedData.password, 13);

          const patient = await patientModel.create({
               ...parsedData,
               password: hashedPassword,
          });

          return res.status(201).json({
               msg: "✅ successfully created a patient",
               patientId: patient._id
          });
     } catch (error) {
          console.log("❌ Patient signup Failed", error.message);

          if (error.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

// send otp function is still left
export const handlePatientLogin = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     // make a cookie and a otp during login in user email or phoneNo if password matched
     const { emailId, password } = req.body;

     if (!emailId || !password) return res.status(400).json({ err: "emailId and password are required!" });

     try {
          const token = await patientModel.matchPassword_and_GenerateToken(emailId, password);

          console.log(token);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: false,                //turn it to true on deployment
          });
     } catch (error) {
          console.log("error: ", error.message);

          if (error.message === "Password not matched") return res.status(400).json({ err: "Invalid Credientials" });

          return null;
     }
     
     return res.status(200).json({ msg: "✅successfully login" });
};


export const handleGetPatient = async (req, res) => {
     if (!req.params.id) res.status(400).json({ msg: "no patient Id provided!" });

     try {
          const patient = await patientModel.findById(req.params.id);

          if (!patient) {
               return res.status(404).json({ msg: "Patient not found" });
          }

          
          return res.status(200).json(patient);
     } catch (error) {
          console.log("error: ", error.message);

          return null;
     }
};


export const handlePatientUploadImg = async (req, res) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     try {
          const response = await patientModel.findOneAndUpdate({ emailId: req.body.emailId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               }, { returnDocument: "after" });

          console.log(response);
          return res.status(200).json({ msg: "successfully uploaded image" });
     } catch (error) {
          console.log("Patient image upload failed", error.message);
          return null;
     }
};

// fix the null issue here 
export const handleDeletePfpImage = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const { emailId } = req.body;

          const patient = await patientModel.findOne({ emailId });

          if (!patient) return res.status(404).json({ err: "no patient available with this emailId" });

          console.log(patient);

          const result = await cloudinary_Delete_pfp(patient.pfp_publicId);

          console.log(result);

          if (result) {
               const response = await patientModel.findOneAndUpdate({ emailId }, {
                    $set: {
                         pfp_publicId: undefined,
                         pfp_url: "/public/pfp/default-patient.png",
                    }
               }, { returnDocument: "after" });

               return res.status(202).json({ response });
          }
     } catch (error) {
          console.log("patient deletion request Failed!");
          return null;
     }

     return res.status(200).json({ msg: "successfully deleted image" });
};


// update current patient requires login first authentication etc.

// // delete the user function or temp delete
// export const handleDeletePatient = async (req, res) => {
//      // logout function too

//      try {

//      } catch (error) {

//      }
// };

// export const handleDeletePatient

