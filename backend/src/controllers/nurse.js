import nurseModel from "../models/nurseModel.js";
import * as z from "zod";
import userModel from "../models/userModel.js";
import patientModel from "../models/patientModel.js";
import doctorModel from "../models/doctorModel.js";
import diseaseCaseModel from "../models/diseaseCaseModel.js";
import mongoose from "mongoose";
import checkupModel from "../models/checkupModel.js";

const nurseSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/default-pfp/default-nurse.png"),
     wardAssigned: z.enum([
          "ICU (Intensive Care Unit)",
          "NICU/PICU (Neonatal/Pediatric ICU)",
          "CCU (Coronary Care Unit)",
          "General Ward",
          "Maternity & Obstetrics",
          "Pediatric Ward",
          "Surgical Ward",
          "Oncology Ward",
          "Psychiatric Unit",
          "Emergency/Observation",
          "Isolation Unit"
     ]),

     nurseDescription: z.string().optional(),

     shift: z.enum(["DAY", "NIGHT"]),

     workingHours: z.object({
          start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!"),
          end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!")
     }),

     experienceYears: z.number().default(0),

     qualification: z.string()
});

const nurseUpdateSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     wardAssigned: z.enum([
          "ICU (Intensive Care Unit)",
          "NICU/PICU (Neonatal/Pediatric ICU)",
          "CCU (Coronary Care Unit)",
          "General Ward",
          "Maternity & Obstetrics",
          "Pediatric Ward",
          "Surgical Ward",
          "Oncology Ward",
          "Psychiatric Unit",
          "Emergency/Observation",
          "Isolation Unit"
     ]).optional(),

     nurseDescription: z.string().optional(),

     shift: z.enum(["DAY", "NIGHT"]).optional(),

     workingHours: z.object({
          start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!").optional(),
          end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!").optional()
     }).optional(),

     experienceYears: z.number().default(0).optional(),

     qualification: z.string().optional()
});

const diseaseCase_Schema = z.object({
     patientId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     createdBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     diagnosedBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     diseaseName: z.string(),
     startedAt: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform((val) => new Date(val)),
     endedAt: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform((val) => new Date(val)),

     status: z.enum(['Active', 'Recovered', 'Chronic', 'Deceased']).default('Active'),
     initialSeverity: z.enum(['Mild', 'Moderate', 'Severe']),

     diagnosisLocation: z.string(),
     diseaseCategory: z.enum(['Infectious', 'NonCommunicable', 'Genetic', 'Deficiency']).optional(),
     possibleCause: z.string().optional(),
});

const diseaseUpdation_Schema = z.object({
     diseaseName: z.string().optional(),
     startedAt: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform((val) => new Date(val)).optional(),
     endedAt: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform((val) => new Date(val)).optional(),

     status: z.enum(['Active', 'Recovered', 'Chronic', 'Deceased']).default('Active').optional(),
     initialSeverity: z.enum(['Mild', 'Moderate', 'Severe']).optional(),

     diagnosisLocation: z.string().optional(),
     diseaseCategory: z.enum(['Infectious', 'NonCommunicable', 'Genetic', 'Deficiency']).optional(),
     possibleCause: z.string().optional(),
});

const checkupSchema = z.object({
     diseaseCaseId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     patientId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     doctorId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     visitDate: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform(val => new Date(val)),

     symptoms: z.array(z.string()).default([]),

     progressStatus: z.enum(["First Visit", "Improving", "Worsening", "Stable"]),

     vitals: z.object({
          oxygenSaturation: z.number().optional(),
          respirationRate: z.number().optional(),

          temperature: z.number(),
          pulse: z.number(),

          bp: z.object({ systolic: z.number(), diastolic: z.number() })
     }),

     vaccinationsGiven: z.array(
          z.object({
               vaccineName: z.string(),
               doseNumber: z.number().optional(),
               administeredAt: z.string()
                    .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
                    .transform(val => new Date(val)),

               administeredBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
          })
     ).default([]),

     treatments: z.array(z.object({
          treatmentType: z.enum(["Tablet", "Injection", "IV", "Surgery", "Procedure", "Therapy"]),
          name: z.string()
     })),

     notes: z.string().optional(),
     nextFollowUp: z.string()
          .regex(/^(0?[1-9]|1[0-2])\/(0?[1-9]|[12]\d|3[01])\/(19|20)\d{2}$/)
          .transform(val => new Date(val)).optional()
});


export const handleAddNurse = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ msg: "no data is provided!" });

     try {
          const { staffId } = req.body;
          if (!staffId) return res.status(404).json({ err: "no staff Id is provided!" });

          const alreadyRegistered = nurseModel.findOne(staffId);
          if (alreadyRegistered) return res.status(400).json({ msg: "nurse already exist with this staffId" });

          const parsedData = nurseSchema.parse(req.body);

          const nurse = await nurseModel.create(parsedData);

          return res.status(201).json({ msg: "✅ successfully created!", nurseId: nurse._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetNurse = async (req, res) => {
     if (!req.params.Id) return res.status(400).json({ msg: "no id is provided!" });

     try {
          const staffId = req.params.Id;

          const nurse = await nurseModel.findOne(staffId);

          if (!nurse) return res.status(400).json({ msg: "no nurse found with this staffId" });

          return res.status(200).json(nurse);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateNurse = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     if (!req.params.Id || !mongoose.Types.ObjectId.isValid(req.params.Id))
          return res.status(400).json({ err: "no staff Id is provided" });

     try {
          const staffId = req.params.Id;

          const parsedData = nurseUpdateSchema.parse(req.body);

          const nurse = await nurseModel.findOneAndUpdate({ staffId },
               { $set: { ...parsedData } },
               { returnDocument: "after" });

          return res.status(200).json({ msg: "✅ successfull updated", nurseId: nurse._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUploadImg = async (req, res) => {
     if (!req.file)
          return res.status(400).json({ err: "no file is provided!" });

     if (!req.body.emailId || !req.body.staffId || !mongoose.Types.ObjectId.isValid(req.body.staffId))
          return res.status(400).json({ err: "emailId and userId are not provided!" });

     try {
          const { emailId, staffId } = req.body;

          const user = await userModel.findOneAndUpdate({ emailId }, {
               $set: { pfp_publicId: req.pfpImagePublicId }
          });
          if (!user) return res.status(404).json({ err: "no user found with this email ID" });

          const nurse = await nurseModel.findOneAndUpdate({ staffId }, {
               $set: { pfp_url: req.pfpImageURL }
          }, { returnDocument: "after" });
          if (!nurse) return res.status(404).json({ err: "no nurse found with this staff ID" });

          return res.status(200).json({ msg: "successfully uploaded image", url: nurse.pfp_url });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleDeleteUploadedImg = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     if (!req.body.emailId || !req.body.staffId || !mongoose.Types.ObjectId.isValid(req.body.staffId))
          return res.status(400).json({ err: "emailId and staffId are required fields" });

     try {
          const { emailId, staffId } = req.body;

          const user = await userModel.findOne({ emailId });
          if (!user) return res.status(404).json({ err: "no user available with this emailId" });

          const result = await cloudinary_Delete_pfp(user.pfp_publicId);

          console.log(result);

          if (result) {
               const user = await userModel.findOneAndUpdate({ emailId }, {
                    $set: { pfp_publicId: undefined, }
               });

               const nurse = await nurseModel.findOneAndUpdate({ staffId }, {
                    $set: { pfp_url: "/default-pfp/default-nurse.png" }
               }, { returnDocument: "after" });
               if (!nurse) return res.status(404).json({ err: "no nurse found with this staff ID" });

               return res.status(200).json({ msg: "successfully deleted image" });
          }
     } catch (error) {
          console.log("image deletion request Failed!");
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleAddDiseaseCase = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     const { patientId, nurseId, doctorId } = req.body;

     if (!patientId || !mongoose.Types.ObjectId.isValid(patientId))
          return res.status(400).json({ err: "invalid Patient Id" });

     if (!nurseId || !mongoose.Types.ObjectId.isValid(nurseId))
          return res.status(400).json({ err: "invalid Nurse Id" });

     if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId))
          return res.status(400).json({ err: "invalid Doctor Id" });

     try {
          const parsedData = diseaseCase_Schema.parse(req.body);

          const [patient, nurse, doctor] = await Promise.all([
               patientModel.findById(patientId),
               nurseModel.findById(nurseId),
               doctorModel.findById(doctorId)
          ]);

          if (!patient) return res.status(404).json({ err: "Patient not found" });
          if (!nurse) return res.status(404).json({ err: "Nurse not found" });
          if (!doctor) return res.status(404).json({ err: "Doctor not found" });


          const response = await diseaseCaseModel.create(parsedData);

          return res.status(201).json({ msg: "Disease case created successfully", Id: response._id })
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateDiseaseCase = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     const { patientId } = req.body;
     if (!patientId) return res.status(400).json({ err: "no patient id provided!" });

     try {
          const parsedData = diseaseUpdation_Schema.parse(req.body);

          const diseaseCase = await diseaseCaseModel.findOneAndUpdate({ patientId }, {
               $set: { ...parsedData }
          }, { returnDocument: "after" });
          
          if(!diseaseCase) return res.status(400).json({ msg: "no disease found with this patient Id" });

          return res.status(200).json({ msg: "successfully updated disease case", Id: diseaseCase._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handlePatientCheckUp = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ msg: "no data is provided!" });

     const { diseaseCaseId, patientId, doctorId } = req.body;

     if (!diseaseCaseId || !mongoose.Types.ObjectId.isValid(diseaseCaseId))
          return res.status(400).json({ err: "invalid Disease Id" });

     if (!patientId || !mongoose.Types.ObjectId.isValid(patientId))
          return res.status(400).json({ err: "invalid patient Id" });

     if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId))
          return res.status(400).json({ err: "invalid Doctor Id" });

     try {
          const parsedData = checkupSchema.parse(req.body);

          const [diseaseCase, patient, doctor] = await Promise.all([
               diseaseCaseModel.findById(diseaseCaseId),
               patientModel.findById(patientId),
               doctorModel.findById(doctorId)
          ]);

          if (!diseaseCase) return res.status(404).json({ err: "disease case not found!" });
          if (!patient) return res.status(404).json({ err: "Patient not found" });
          if (!doctor) return res.status(404).json({ err: "Doctor not found" });

          const response = await checkupModel.create(parsedData);

          return res.status(201).json({ msg: "successfully created a check-up", Id: response._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};