import labTechModel from "../models/labTechnician.js";
import userModel from "../models/userModel.js";
import * as z from "zod";

const labTechSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/pfp/default-lab-technician.png"),
     labType: z.enum([
          "Anatomic Pathology",
          "Biochemistry",
          "Cytology",
          "Genetics/Genomics",
          "Hematology",
          "Histology",
          "Imaging (MRI/CT/X-Ray)",
          "Immunology/Serology",
          "Microbiology",
          "Molecular Diagnostics",
          "Nuclear Medicine",
          "Phlebotomy",
          "Radiology",
          "Toxicology",
          "Urinalysis",
          "Virology"
     ]),
     qualification: z.string(),
     shift: z.enum(["Morning", "Evening", "Night"])
});

export const handleAddLabTech = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const alreadyRegistered = await labTechModel.findOne({ staffId: req.body.staffId });
          if (alreadyRegistered) return res.status(400).json({ msg: "Lab Technician already registered with this staffId" });

          const parsedData = labTechSchema.parse(req.body);

          const response = await labTechModel.create(parsedData);

          return res.status(201).json({ msg: "created successfully" });
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

export const handleUploadPfpImg = async (req, res) => {
     if (!req.file)
          return res.status(400).json({ err: "no file is provided!" });

     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "emailId and staffId are not provided!" });

     try {
          const { emailId, staffId } = req.body;

          const user = await userModel.findOneAndUpdate({ emailId }, {
               $set: { pfp_publicId: req.pfpImagePublicId }
          });
          if (!user) return res.status(404).json({ err: "no user found with this email ID" });

          const labTechi = await labTechModel.findOneAndUpdate({ staffId }, {
               $set: { pfp_url: req.pfpImageURL }
          }, { returnDocument: "after" });

          if (!labTechi) return res.status(404).json({ err: "no lab techinician found with this user ID" });

          return res.status(200).json({ msg: "successfully uploaded image", url: patient.pfp_url });
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

export const handleDeletePfpImage = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

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

               const labTechi = await labTechModel.findOneAndUpdate({ staffId }, {
                    $set: { pfp_url: "/pfp/default-lab-technician.png" }
               }, { returnDocument: "after" });
               if (!labTechi) return res.status(404).json({ err: "no receptionist found with this user ID" });

               return res.status(200).json({ msg: "successfully deleted image" });
          }
     } catch (error) {
          console.log("pfp deletion request Failed! ", error.message);
          return null;
     }
};

export const handleUpdateLabTech = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const staffId = req.params.Id;
          if (!staffId || isNaN(staffId)) {
               return res.status(400).send('Invalid or missing user ID');
          }

          const parsedData = labTechSchema.parse(req.body);

          const labTechi = await labTechModel.findOneAndUpdate({ staffId },
               { $set: { ...parsedData } },
               { returnDocument: "after" });

          if (!labTechi) return res.status(404).json({ err: "No lab-technician found with this staffId" });

          return res.status(200).json({ msg: "successfully updated" })
     } catch (error) {
          console.log("error: ", error.message);
          return null;
     }
};

export const handleAddReport = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
};