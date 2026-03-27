import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import * as z from "zod";

const doctorSchema = z.object({
     userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/default-pfp/default-nurse.png"),


     specialization: z.array(z.string()),
     experienceYears: z.number().min(0).max(50),
     doctorDescription: z.string(),
     licenseNumber: z.string(),

     availability: z.object({
          morningTime: z.object({ startTime: z.string(), endTime: z.string() }),
          eveningTime: z.object({ startTime: z.string(), endTime: z.string() }),
          closedOn: z.string(),
     }),
});


export const handleDoctorSignup = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ err: "No data is provided !" });
     }

     try {
          const parsedData = await doctorSchema.parse(req.body);

          console.log(parsedData);

          const isAlreadyDoctor = await doctorModel.findOne({ emailId: parsedData.emailId });
          if (isAlreadyDoctor) {
               return res.status(400).json({ msg: "Doctor already exist with this Email" });
          }

          const hashedPassword = await bcrypt.hash(parsedData.password, 14);

          const doctor = await doctorModel.create({
               ...parsedData,
               password: hashedPassword
          });

          console.log(doctor);

          return res.status(201).json({
               msg: "✅ successfully created a doctor",
               doctorId: doctor._id
          });

     } catch (error) {
          console.log("error: ", error);
          return null;
     }

     return res.status(201).json({ msg: "successfully doctor details are feeded to DB" });
};

export const handleDoctorLogin = async (req, res) => {
     const { emailId, password } = req.body;

     if (!emailId && !password) return res.status(400).json({ err: "emailId and password are required!" });

     try {
          const token = await doctorModel.matchPassword_and_GenerateToken(emailId, password);

          console.log(token);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: false,      //turn it to true on deployment
          });
     } catch (error) {
          console.log("error: ", error.message);

          if (error.message === "Password not matched") return res.status(400).json({ err: "Invalid Credientials" });

          return null;
     }
};

export const handleGetDoctor = async (req, res) => {
     if (!req.params.id) return res.status(400).json({ err: "Doctor Id is not provided!" });

     try {
          const doctor = await doctorModel.findById(req.params.id);

          if (!doctor) return res.json(404).json({ msg: "Patient not found" });

          return res.status(200).json(doctor);
     } catch (err) {
          console.log("error: ", error.message);

          return null;
     }
};

export const handleUploadImg = async (req, res) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     if (!req.body.emailId) return res.status(400).json({ err: "no emailId is provided" });

     try {
          const response = await doctorModel.findOneAndUpdate({ emailId: req.body.emailId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               }, { returnDocument: "after" });

          console.log(response);
          return res.status(200).json({ msg: "successfully uploaded image" });
     } catch (error) {
          console.log("Doctor image upload failed", error.message);
          return null;
     }
};

export const handleDeletePfpImage = async (req, res) => {
     if (!req.body.emailId) return res.status(400).json({ err: "no emailId is provided!" });

     try {
          const { emailId } = req.body;

          const doctor = await doctorModel.findOne({ emailId });

          if (!doctor) return res.status(404).json({ err: "no doctor available with this emailId" });

          const result = await cloudinary_Delete_pfp(doctor.pfp_publicId);

          console.log(result);

          if (result) {
               const response = await doctorModel.findOneAndUpdate({ emailId },
                    {
                         $set: {
                              pfp_publicId: undefined,
                              pfp_url: "/public/default-pfp/default-avatar-doctor.png",
                         }
                    }, { returnDocument: "after" })

               return res.status(202).json({ response });
          }

     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};
