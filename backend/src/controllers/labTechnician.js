import failedDicomFilesModel from "../models/failedDicomFilesModel.js";
import labTechModel from "../models/labTechnician.js";
import checkupModel from "../models/checkupModel.js";
import userModel from "../models/userModel.js";
import * as z from "zod";

const labTechSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/default-pfp/default-lab-technician.png"),
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

const labTechiUpdateSchema = z.object({
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
     ]).optional(),
     
     qualification: z.string().optional(),
     
     shift: z.enum(["Morning", "Evening", "Night"]).optional()
});

export const handleAddLabTech = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const alreadyRegistered = await labTechModel.findOne({ staffId: req.body.staffId });
          if (alreadyRegistered) return res.status(400).json({ msg: "Lab Technician already registered with this staffId" });

          const parsedData = labTechSchema.parse(req.body);

          const response = await labTechModel.create(parsedData);

          return res.status(201).json({ msg: "created successfully", Id: response._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};


export const handleGetLabTech = async (req, res) => {
     if (!req.params.Id) return res.status(400).json({ msg: "no id is provided!" });

     try {
          const staffId = req.params.Id;

          const labTechi = await labTechModel.findOne(staffId);

          if (!labTechi) return res.status(400).json({ msg: "no lab technician found with this staffId" });

          return res.status(200).json(labTechi);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

// export const handleUpdateLabTech = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ err: "no data is provided!" });

//      const staffId = req.params.Id;
//      if (!staffId || !mongoose.Types.ObjectId.isValid(staffId)) {
//           return res.status(400).send('Invalid or missing user ID');
//      }

//      try {
//           const parsedData = labTechSchema.parse(req.body);

//           const labTechi = await labTechModel.findOneAndUpdate({ staffId },
//                { $set: { ...parsedData } },
//                { returnDocument: "after" });

//           if (!labTechi) return res.status(404).json({ err: "No lab-technician found with this staffId" });

//           return res.status(200).json({ msg: "successfully updated" })
//      } catch (error) {
//           console.log("error: ", error.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      }
// };

export const handleUpdateLabTech  = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     if (!req.params.Id || !mongoose.Types.ObjectId.isValid(req.params.Id))
          return res.status(400).json({ err: "no staff Id is provided" });

     try {
          const staffId = req.params.Id;

          const parsedData = labTechiUpdateSchema.parse(req.body);

          const labTechi = await labTechModel.findOneAndUpdate({ staffId },
               { $set: { ...parsedData } },
               { returnDocument: "after" });

          return res.status(200).json({ msg: "✅ successfull updated", Id: labTechi._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
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
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
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
               await userModel.findOneAndUpdate({ emailId }, {
                    $set: { pfp_publicId: undefined, }
               });

               const labTechi = await labTechModel.findOneAndUpdate({ staffId }, {
                    $set: { pfp_url: "/default-pfp/default-lab-technician.png" }
               }, { returnDocument: "after" });
               if (!labTechi) return res.status(404).json({ err: "no receptionist found with this user ID" });

               return res.status(200).json({ msg: "successfully deleted image" });
          }
     } catch (error) {
          console.log("pfp deletion request Failed! ", error.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};


export const handleAddDicomReport = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     const { checkUpId } = req.params;
     if (!checkUpId || !mongoose.Types.ObjectId.isValid(checkUpId))
          return res.status(400).json({ err: "invalid patient Id" });

     const results = req.dicomResults;
     if (!results) return res.status(400).json({ msg: "no dicom files is provided!" });

     try {
          const successfullyUploads = results.reduce((acc, currentFile, index) => {
               if (currentFile.status === "fulfilled") {
                    acc.push({
                         fileUrl: currentFile.value.data["00081190"]?.Value?.[0],         //have a secondary look to this one => extract URL from DICOM tag
                         fileName: req.dicomFiles[index].entryName,
                         studyInstanceId: req.dicomFileMetaData.studyUid,
                         seriesInstanceId: req.dicomFileMetaData.seriesUid,
                         sopInstanceUid: req.dicomFileMetaData.instanceUid,
                         modality: req.dicomFileMetaData.modality,
                         bodyPart: req.dicomFileMetaData.bodyPartExamined,
                         uploadedBy: req.user._id,                               // from auth middleware
                    })
               }

               return acc;
          }, []);

          console.log(successfullyUploads);

          const checkUp = await checkupModel.findOneAndUpdate(
               { _id: checkUpId },
               { $push: { dicomFiles: { $each: successfullyUploads } } },
               { returnDocument: "after" }
          );
          if (!checkUp)
               return res.status(404).json({ err: "no data is exist with this patient Id" });

          return res.status(200).json({
               msg: "Upload complete",
               stats: {
                    total: req.dicomResults.length,
                    success: successfullyUploads.length,
                    failed: req.dicomResults.filter(r => r.status === 'rejected').length
               }
          });

     } catch (err) {
          console.log("error: ", err.message);

          await failedDicomFilesModel.create({
               orphanedUrls: successfullyUploads.map(f => f.fileUrl),
               checkUpId,
               reason: err.message,
               resolved: false
          })

          return res.status(500).json({
               err: "INTERNAL SERVER ERROR while saving your files. Please try again or contact support."
          });
     }
};