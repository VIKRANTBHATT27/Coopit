import { previewDicomInstance, dicomWebDeleteStudy } from "../service/dicomFileService.js";
import failedDicomFilesModel from "../models/failedDicomFilesModel.js";
import labTechModel from "../models/labTechnician.js";
import checkupModel from "../models/checkupModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export const handleAddLabTech = async (req, res) => {
     if (!req.parsedBody || Object.keys(req.parsedBody).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const alreadyRegistered = await labTechModel.findOne({ staffId: req.parsedBody.staffId });
          if (alreadyRegistered) return res.status(400).json({ msg: "Lab Technician already registered with this staffId" });

          const response = await labTechModel.create(req.parsedBody);

          return res.status(201).json({ msg: "created successfully", Id: response._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetLabTech = async (req, res) => {
     const staffId = req.params.Id;
     if (!staffId) return res.status(400).json({ msg: "no staff Id is provided!" });

     try {
          const labTechi = await labTechModel.findOne(staffId);
          if (!labTechi) return res.status(400).json({ msg: "no lab technician found with this staffId" });

          return res.status(200).json(labTechi);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateLabTech = async (req, res) => {
     if (!req.parsedBody || Object.keys(req.parsedBody).length === 0)
          return res.status(400).json({ err: "no data is provided!" });

     const staffId = req.params.Id;
     if (!staffId || !mongoose.Types.ObjectId.isValid(staffId))
          return res.status(400).json({ err: "no staff Id is provided" });

     try {
          const labTechi = await labTechModel.findOneAndUpdate({ staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" });

          return res.status(200).json({ msg: "successfull updated", Id: labTechi._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUploadPfpImg = async (req, res) => {
     if (!req.file)
          return res.status(400).json({ err: "no Img file is provided!" });

     const { emailId, staffId } = req.parsedBody;

     try {
          const user = await userModel.findOneAndUpdate({ emailId }, {
               $set: { pfp_publicId: req.pfpImagePublicId }
          });
          if (!user) return res.status(404).json({ err: "no user found with this email ID" });

          const labTechi = await labTechModel.findOneAndUpdate({ staffId }, {
               $set: { pfp_url: req.pfpImageURL }
          }, { returnDocument: "after" });

          if (!labTechi) return res.status(404).json({ err: "no lab techinician found with this user ID" });

          return res.status(200).json({ msg: "successfully uploaded image", url: labTechi.pfp_url });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleDeletePfpImage = async (req, res) => {
     const { emailId, staffId } = req.parsedBody;

     try {
          const user = await userModel.findOne({ emailId });
          if (!user) 
               return res.status(404).json({ err: "no user available with this emailId" });

          const labTechi = await labTechModel.findOne({ staffId });
          if (!labTechi) 
               return res.status(404).json({ err: "no lab-techinician found with that staffId" });

          const result = await cloudinary_Delete_pfp(user.pfp_publicId);
          console.log(result);

          if (!result) 
               return res.status(500).json({ err: "Failed to delete image from cloudinary" });

          await Promise.all([
               userModel.findOneAndUpdate(
                    { emailId },
                    { $set: { pfp_publicId: undefined, } }
               ),
               
               labTechModel.findOneAndUpdate(
                    { staffId },
                    { $set: { pfp_url: "/default-pfp/default-lab-technician.png" } },
                    { returnDocument: "after" }
               )
          ]);

          return res.status(200).json({ msg: "successfully deleted image" });
     } catch (error) {
          console.log("pfp deletion request Failed! ", error.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetDicomFiles = async (req, res) => {
     const { patientId } = req.parsedBody;
     if (!patientId || !mongoose.Types.ObjectId.isValid(patientId))
          return res.status(400).json({ err: "either patientId not provided or patientId is incorrect" });

     try {
          const checkUpArr = await checkupModel.find({ patientId });

          const dicomFiles = checkUpArr.map(obj => obj.dicomFiles);

          return res.status(200).json({ dicomFiles });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleAddDicomReport = async (req, res) => {
     if (!req.parsedBody || Object.keys(req.parsedBody).length === 0)
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

export const handleDeleteDicomFile = async (req, res) => {
     if (!req.params.studyUid)
          return res.status(400).json({ err: "no study instance Id is provided!" });

     try {
          const result = await dicomWebDeleteStudy(req.params.studyUid);

          console.log(result);

          return res.status(400).json({ err: "successfully deleted the dicom file" });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "wrong studyInstanceId is provided!" });
     }
};

export const handlePreviewDicomFile = async (req, res) => {
     const { studyInstanceId, seriesInstanceId, sopInstanceUid } = req.parsedBody;

     if (!studyInstanceId)
          return res.status(400).json({ err: "no study instance Id is provided!" });

     if (!seriesInstanceId)
          return res.status(400).json({ err: "no series instance Id is provided!" });

     if (!sopInstanceUid)
          return res.status(400).json({ err: "no sop instance Id is provided!" });

     try {
          const buffer = await previewDicomInstance(studyInstanceId, seriesInstanceId, sopInstanceUid);

          res.set('Content-Type', 'application/dicom');
          return res.send(buffer);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};
