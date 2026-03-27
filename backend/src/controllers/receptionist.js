import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";
import receptionistModel from "../models/receptionistModel.js";
import userModel from "../models/userModel.js";
import * as z from "zod";
import visitsModel from "../models/visitsModel.js";
import diseaseCaseModel from "../models/diseaseCaseModel.js";
import mongoose from "mongoose";

const receptionistSchema = z.object({
     userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     hospitalId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     pfp_url: z.string().default("/default-pfp/default-receptionist.png"),
     department: z.enum(["Front Desk", "Billing Desk", "Emergency Desk"]),
     shift: z.enum(["Morning", "Evening", "Night"]),

     workingHours: z.object({ start: z.string(), end: z.string() }),

     skills: z.array(z.string()).optional(),
});

const appointmentSchema = z.object({
     patientId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     createdBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     hospitalId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId").optional(),
     diseaseCaseId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId").optional(),
     assignedDoctor: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId").optional(),
     assignedNurse: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId").optional(),
     reasonForVisit: z.string(),
     status: z.string().default("WAITING"),
     visitDate: z.string().regex(/^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/, "Visit Date must be in MM/DD/YYYY format"),
});

export const handleAddReceptionist = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const alreadyExist = await receptionistModel.findOne({ userId: req.body.userId });
          if (alreadyExist) return res.status(400).json({ msg: "Receptionist already exist with this userId" });

          const parsedData = receptionistSchema.parse(req.body);

          const response = await receptionistModel.create(parsedData);

          return res.status(201).json({ msg: "created successfully" });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUploadImg = async (req, res) => {
     if (!req.file)
          return res.status(400).json({ err: "no file is provided!" });

     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "emailId and userId are not provided!" });

     try {
          const { emailId, userId } = req.body;

          const user = await userModel.findOneAndUpdate({ emailId }, {
               $set: { pfp_publicId: req.pfpImagePublicId }
          });
          if (!user) return res.status(404).json({ err: "no user found with this email ID" });

          const receptionist = await receptionistModel.findOneAndUpdate({ userId }, {
               $set: { pfp_url: req.pfpImageURL }
          }, { returnDocument: "after" });
          if (!receptionist) return res.status(404).json({ err: "no receptionist found with this user ID" });

          return res.status(200).json({ msg: "successfully uploaded image", url: patient.pfp_url });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleDeleteUploadedImg = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const { emailId, userId } = req.body;

          const user = await userModel.findOne({ emailId });

          if (!user) return res.status(404).json({ err: "no user available with this emailId" });

          const result = await cloudinary_Delete_pfp(user.pfp_publicId);

          console.log(result);

          if (result) {
               const user = await userModel.findOneAndUpdate({ emailId }, {
                    $set: { pfp_publicId: undefined, }
               });

               const receptionist = await receptionistModel.findOneAndUpdate({ userId }, {
                    $set: { pfp_url: "/default-pfp/default-receptionist.png" }
               }, { returnDocument: "after" });
               if (!receptionist) return res.status(404).json({ err: "no receptionist found with this user ID" });

               return res.status(200).json({ msg: "successfully deleted image" });
          }
     } catch (error) {
          console.log("patient deletion request Failed!");
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};


export const handleUpdateReceptionist = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const userId = req.params.Id;
          if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
               return res.status(400).send('Invalid or missing user ID');
          }

          const parsedData = labTechSchema.parse(req.body);

          const receptionist = await labTechModel.findOneAndUpdate({ userId },
               { $set: { ...parsedData } },
               { returnDocument: "after" });

          if (!receptionist) return res.status(404).json({ err: "No receptionist found with this userId" });

          return res.status(200).json({ msg: "successfully updated" })
     } catch (error) {
          console.log("error: ", error.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleAddPatientVisit = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     if (!req.body.patientId || !req.params.Id)
          return res.status(400).json({ msg: "emailId and receptionist id are required fields" });
     try {
          const createdBy = req.params.Id;
          const { patientId, assignedDoctor, assignedNurse } = req.body;

          const patient = await patientModel.findOne({ _id: patientId });
          if (!patient) return res.status(400).json({ err: "invalid patientId" });

          const receptionist = await receptionistModel.findOne({ createdBy });
          if (!receptionist) return res.status(400).json({ err: "invalid receptionist id" });
          
          const diseaseCase = await diseaseCaseModel.findOne({ patientId });

          // DOES THEY ALREADY EXIST TO VERIFY 
          // COZ GENERALIST KE PASS BHI BEJA JA SKTA H THEN ......
          // hospitalId from receptionist object me se
          // assignedDoctor => general wala by default or specific one
          // assignedNurse =>  general wala  

          const parsedData = appointmentSchema.parse({
               ...req.body,
               patientId,
               createdBy,
               hospitalId: receptionist.hospitalId,
               diseaseCaseId: diseaseCase ? diseaseCase._id : undefined,
               assignedDoctor,
               assignedNurse,
          });

          const response = await visitsModel.create(parsedData);

          return res.status(201).json({ msg: "Patient visit created successfully", responseId: response._id });

     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};