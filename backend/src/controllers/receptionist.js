import cloudinary_Delete_pfp from "../services/cloudinary_Delete_pfp.js";
import receptionistModel from "../models/receptionistModel.js";
import userModel from "../models/userModel.js";
import * as z from "zod";

const receptionistSchema = z.object({
     userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     hospitalId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     pfp_url: z.string().optional(),
     department: z.enum(["Front Desk", "Billing Desk", "Emergency Desk"]),
     shift: z.enum(["Morning", "Evening", "Night"]),

     workingHours: z.object({ start: z.string(), end: z.string() }),

     skills: z.array(z.string()).optional(),
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
          return null;
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
          return null;
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
                    $set: { pfp_url: "/pfp/default-receptionist.png" }
               }, { returnDocument: "after" });
               if (!receptionist) return res.status(404).json({ err: "no receptionist found with this user ID" });

               return res.status(200).json({ msg: "successfully deleted image" });
          }
     } catch (error) {
          console.log("patient deletion request Failed!");
          return null;
     }
};

// update route

export const handleUpdateLabTech = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const userId = req.params.Id;
          if (!userId || isNaN(userId)) {
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
          return null;
     }
};