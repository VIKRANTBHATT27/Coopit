import { previewDicomInstance, dicomWebDeleteStudy } from "../service/dicomFileService.js";
import { CheckUp, User, LabTechnician, Patient, LabReport, DicomFile } from "../models/index.js";
import mongoose, { Promise } from "mongoose";
import { uploadFileToS3 } from "../infrastructure/aws.js";
import { logTimelineEvent } from "../services/timeline.service.js";
import crypto from 'node:crypto';

export const handleAddLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedBody;

          const alreadyRegistered = await LabTechnician.findOne({ staffId: req.parsedBody.staffId });

          if (alreadyRegistered)
               return res.status(400).json({
                    success: false,
                    err: "Lab Technician already registered with this staffId"
               });

          const labTechnician = await LabTechnician.create(req.parsedBody);

          return res.status(201).json({ msg: "created successfully", labTechId: labTechnician._id });
     } catch (err) {
          console.error("failed during creation of lab technician\n", err.message);
          next(err);
     }
};

export const handleGetLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const labTehnician = await LabTechnician.findOne({ staffId });
          if (!labTehnician)
               return res.status(400).json({
                    sucess: false,
                    msg: "no lab technician found with this staffId"
               });

          return res.status(200).json({
               success: true,
               data: labTehnician
          });
     } catch (err) {
          console.error("failed to get lab technician\n", err.message);
          next(err);
     }
};

export const handleUpdateLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const updatedLabTechnician = await LabTechnician.findOneAndUpdate(
               { staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after", runValidators: true }
          );

          return res.status(200).json({
               success: true,
               msg: "lab technician updated successfully",
               labTechId: updatedLabTechnician._id
          });
     } catch (err) {
          console.error("failed during updating a lab-technician profile\n", err.message);
          next(err);
     }
};

export const handleUploadAvatar = async (req, res, next) => {
     if (!req.file)
          return res.status(400).json({
               sucess: false,
               err: "no Img file is provided!"
          });

     try {
          const { staffId } = req.parsedParams;

          const updatedLabTech = await LabTechnician.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               },
               { returnDocument: "after", runValidators: true }
          );

          if (!updatedLabTech)
               return res.status(404).json({
                    success: false,
                    err: "no lab techinician found with this staff ID"
               });

          return res.status(200).json({
               success: true,
               msg: "successfully uploaded profile image",
               url: updatedLabTech.pfp_url
          });
     } catch (err) {
          console.error("failed during uploading profile pic\n", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const labTech = await LabTechnician.findOne({ staffId });
          if (!labTech)
               return res.status(404).json({
                    success: false,
                    err: "no lab-techinician found with that staffId"
               });

          const result = await cloudinary_Delete_pfp(labTech.pfp_publicId);
          console.log(result);

          if (!result)
               return res.status(500).json({
                    sucess: false,
                    err: "Failed to delete image from cloudinary"
               });

          await LabTechnician.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         pfp_publicId: undefined,
                         pfp_url: "/default-pfp/default-lab-technician.png"
                    }
               },
               { returnDocument: "after" }
          );

          return res.status(200).json({
               success: true,
               msg: "successfully deleted profile image"
          });
     } catch (err) {
          console.error("profile image deletion request Failed\n", err.message);
          next(err);
     }
};

export const handleGetAllDicomFiles = async (req, res, next) => {
     try {
          const { medicalCaseId, checkUpId } = req.parsedBody;

          const checkUp = await CheckUp.findById(checkUpId);

          if (!checkUp)
               return res.status(400).json({
                    success: false,
                    err: "invalid checkUp Id"
               });

          if (checkUp.medicalCaseId.toString() !== medicalCaseId)
               return res.status(400).json({
                    success: false,
                    err: "Medical case ID mismatch with check-up record"
               });

          const dicomFile = await DicomFile.findOne({ medicalCaseId, checkUpId });

          return res.status(200).json({
               succes: true,
               data: dicomFile,
               msg: "successfully fetched dicom files",
          });
     } catch (err) {
          console.error("Failed during fetching dicom file\n", err.message);
          next(err);
     }
};

export const handleAddDicomFile = async (req, res, next) => {
     try {
          const { patientId, checkUpId, medicalCaseId } = req.parsedBody;

          const { dicomFileMetaData, file } = req;

          if (!dicomMetaData) {
               return res.status(400).json({ err: "DICOM metadata extraction failed" });
          }

          const generatedFileUrl = `${process.env.BASE_API_URL}/dicom/study/${dicomMetaData.studyUid}/series/${dicomMetaData.seriesUid}/instance/${dicomMetaData.instanceUid}`;

          await DicomFile.create({
               patientId,
               checkUpId,
               medicalCaseId,
               uploadedBy: req.user.userId,
               fileName: file.originalname,
               fileUrl: generatedFileUrl,
               studyInstanceId: dicomMetaData.studyUid,
               seriesInstanceId: dicomMetaData.seriesUid,
               sopInstanceUid: dicomMetaData.instanceUid,
               modality: dicomMetaData.modality || "Others",
               bodyPart: dicomMetaData.bodyPartExamined || "Unknown"
          });


          if (file && file.path) {
               fs.unlink(file.path, (err) => {
                    if (err) console.error("Temporary local file cleanup failed:", err);
               });
          }

          return res.status(201).json({
               success: true,
               msg: "successfully uploaded dicom file",
               recordId: newDicomRecord._id
          });
     } catch (err) {
          console.error("failed during dicom file upload\n", err.message);
          next(err);
     }
};

export const handleDicomZip = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedParams;
          const { patientId, checkUpId, medicalCaseId } = req.parsedBody;

          const { dicomResults, file } = req;

          if (!dicomResults || dicomResults.length === 0) {
               return res.status(400).json({ err: "No DICOM processing results found" });
          }

          const documentsToSave = [];
          const failedUploads = [];

          for (let i = 0; i < dicomResults.length; i++) {
               const result = dicomResults[i];

               const originalFileName = dicomFiles[i]?.entryName || `File-${i}`;

               if (result.status === "rejected") {
                    failedUploads.push({
                         fileName: originalFileName,
                         reason: result.reason?.message || "failed to upload to Google Cloud"
                    });

                    continue;
               }

               const { metaData } = result.value;

               const generatedFileUrl = `${process.env.BASE_API_URL}/dicom/study/${metaData.studyUid}/series/${metaData.seriesUid}/instance/${metaData.instanceUid}`;

               documentsToSave.push({
                    patientId,
                    checkUpId,
                    medicalCaseId,
                    uploadedBy: req.user.userId,
                    fileName: originalFileName,
                    fileUrl: generatedFileUrl,
                    studyInstanceId: metaData.studyUid,
                    seriesInstanceId: metaData.seriesUid,
                    sopInstanceUid: metaData.instanceUid,
                    modality: metaData.modality || "Others",
                    bodyPart: metaData.bodyPartExamined || "Unknown"
               });
          }

          if (documentsToSave.length > 0) {
               await DicomFile.insertMany(documentsToSave);
          }

          if (file?.path) fs.unlinkSync(req.file.path);

          return res.status(201).json({
               totalProcessed: dicomResults.length,
               successCount: documentsToSave.length,
               failedCount: failedUploads.length,
               failedFiles: failedUploads,   // The frontend can now loop through this and show a warning alert!
               msg: `Successfully processed and stored ${documentsToSave.length} DICOM instances.`,
          });

          return res.status(201).json({
               msg: "successfully uploaded dicom",
               stats: {
                    total: req.dicomResults.length,
                    success: successfullyUploads.length,
                    failed: req.dicomResults.filter(r => r.status === 'rejected').length
               }
          });

     } catch (err) {
          console.error("Error during extraction of zip and uploading Dicoms\n", err.message);
          next(err);
     }
};

// export const handleDeleteDicomFile = async (req, res, next) => {
//      if (!req.params.studyUid)
//           return res.status(400).json({ err: "no study instance Id is provided!" });

//      try {
//           const result = await dicomWebDeleteStudy(req.params.studyUid);

//           console.log(result);

//           return res.status(200).json({ msg: "successfully deleted the dicom file" });
//      } catch (err) {
//           console.error("failed during dicom file deletion\n", err.message);
//           if (err.message.includes("404")) {
//                return res.status(404).json({ err: "no dicom file found with this studyInstanceId" });
//           }
//           next(err);
//      }
// };

export const handlePreviewDicomFile = async (req, res, next) => {
     try {
          const {
               studyInstanceId,
               seriesInstanceId,
               sopInstanceUid
          } = req.parsedBody;

          const buffer = await previewDicomInstance(studyInstanceId, seriesInstanceId, sopInstanceUid);

          res.set('Content-Type', 'application/dicom');
          return res.send(buffer);
     } catch (err) {
          console.error('failed during dicom file preview\n', err.message);
          next(err);
     }
};

export const handleUploadPDF = async (req, res, next) => {
     try {
          const { patientId, checkUpId } = req.parsedBody;
          const { path: filePath } = req.file;

          const [checkUp, patient] = await Promise.all([
               CheckUp.findById(checkUpId),
               Patient.findById(patientId)
          ]);
          if (!checkUp) return res.status(404).json({ err: "invalid checkUp Id" });
          if (!patient) return res.status(404).json({ err: "invalid patient Id" });
          if (checkUp.patientId.toString() !== patientId)
               throw new APIError(403, "Patient ID mismatch");

          const s3Key = `patient/${patientId}/report/${crypto.randomUUID()}.pdf`;

          await uploadFileToS3(s3Key, filePath);

          const { _id: labReportId } = await LabReport.create({
               ...req.parsedBody,
               s3Key,
               uploadedBy: req.user.roleRefId
          });

          req.LabReportId = labReportId;

          fs.unlinkSync(filePath);

          await logTimelineEvent({
               patientId,
               eventData: {
                    eventType: 'REPORT_UPLOADED',
                    performedBy: req.user.roleRefId,
                    performedByRole: req.user.role,
                    eventReferenceId: labReportId,
                    referenceModel: 'labReport',
                    note: 'Lab report uploaded'
               }
          });

          return res.status(201).json({ success: true, msg: "PDF file uploaded successfully" });
     } catch (err) {
          console.error("failed during pdf upload\n", err.message);

          if (req.LabReportId)
               await LabReport.findByIdAndDelete(req.LabReportId);

          if (req.file?.path && fs.existsSync(req.file.path))
               fs.unlinkSync(req.file.path);

          next(err);
     }
};