import nurseModel from "../models/nurseModel";
import * as z from "zod";
import userModel from "../models/userModel";

const nurseSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/pfp/default-nurse.png"),
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

     shift: z.enum([ "DAY", "NIGHT" ]),

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

     shift: z.enum([ "DAY", "NIGHT" ]).optional(),

     workingHours: z.object({
          start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!").optional(),
          end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!").optional()
     }).optional(),

     experienceYears: z.number().default(0).optional(),

     qualification: z.string().optional()
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

     if (!req.params.Id)
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

     if (!req.body.emailId || !req.body.staffId)
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

     if(!req.body.emailId || !req.body.staffId)
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
                    $set: { pfp_url: "/pfp/default-nurse.png" }
               }, { returnDocument: "after" });
               if (!nurse) return res.status(404).json({ err: "no nurse found with this staff ID" });

               return res.status(200).json({ msg: "successfully deleted image" });
          }
     } catch (error) {
          console.log("image deletion request Failed!");
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};
