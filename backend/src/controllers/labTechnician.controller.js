import { previewDicomInstance, dicomWebDeleteStudy, deleteDicomInstance } from "../services/dicom.service.js";
import { CheckUp, User, LabTechnician, Patient, LabReport, DicomStudy } from "../models/index.js";
import { Promise } from "mongoose";
import { getSignedUrlFromS3, uploadFileToS3 } from "../infrastructure/aws.js";
import { logTimelineEvent } from "../services/timelineEvent.service.js";
import crypto from 'node:crypto';
import APIError from "../utils/APIError.utils.js";

import dotenv from "dotenv";
import { createDicomStudy } from "../services/dicomStudy.service.js";
dotenv.config();

export const handleAddLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedBody;

          const alreadyRegistered = await LabTechnician.findOne({ staffId: req.parsedBody.staffId });

          if (alreadyRegistered)
               return res.status(400).json({

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

                    err: "no lab techinician found with this staff ID"
               });

          return res.status(200).json({

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

               msg: "successfully deleted profile image"
          });
     } catch (err) {
          console.error("profile image deletion request Failed\n", err.message);
          next(err);
     }
};

export const handleGetAllDicomStudys = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedBody;

          const checkUp = await CheckUp.findById(checkUpId);

          if (!checkUp)
               return res.status(400).json({

                    err: "invalid checkUp Id"
               });


          const DicomStudy = await DicomStudy.findOne({ checkUpId });

          if (!DicomStudy)
               return res.status(204).json({
                    err: "no dicom file founded with this checkUpId"
               });

          return res.status(200).json({
               data: DicomStudy,
               msg: "successfully fetched dicom files",
          });
     } catch (err) {
          console.error("Failed during fetching dicom file\n", err.message);
          next(err);
     }
};

export const handleAddDicomStudy = async (req, res, next) => {
     try {
          const { BASE_API_URL } = process.env;
          const { checkup } = req.parsedParams;
          const { patientId, medicalCaseId } = req.parsedBody;

          const { studyUid, seriesUid, instanceUid, modality, bodyPartExamined } = req.dicomPayload;

          const generatedFileUrl = `${BASE_API_URL}/dicom/study/${studyUid}/series/${seriesUid}/instance/${instanceUid}`;

          const sliceArray = [{
               fileName,
               fileUrl,
               sopInstanceUid: instanceUid,
               seriesInstanceId: seriesUid,
               bodyPart: bodyPartExamined || "Unknown"
          }];

          const newDicomStudy = await createDicomStudy({
               patientId,
               checkUpId,
               medicalCaseId,
               uploadedBy: req.user.userId,
               studyInstanceId: req.dicomPayload.studyUid,
               modality: req.dicomPayload.modality || "Others",
               slices: sliceArray
          });

          const timelineEvent = await logTimelineEvent({
               patientId,
               eventData: {
                    eventType: 'DICOM_UPLOADED',
                    performedByRole: req.user.role,
                    performedBy: req.user.roleRefId,
                    eventReferenceId: newDicomStudy._id,
                    referenceModel: 'DicomStudy',
                    note: `${sliceArray.length} DICOM files uploaded`
               }
          });

          return res.status(201).json({
               msg: "successfully uploaded dicom file",
               recordId: newDicomRecord._id
          });
     } catch (err) {
          console.error("failed during dicom file upload\n", err.message);

          if (newDicomStudy) {
               await DicomStudy.findByIdAndDelete(newDicomStudy._id);
          }

          if (req.dicomPayload.studyUid) {
               await deleteDicomInstance(req.dicomPayload.studyUid);
          }

          return next(err);
     }
};

export const handleDicomZip = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedParams;
          const { patientId, medicalCaseId } = req.parsedBody;

          const { BASE_API_URL } = process.env;
          const { dicomResults } = req.dicomPayload;

          const sliceArray = [];
          const failedUploads = [];

          for (const result of dicomResults) {
               if (result.status === "rejected") {
                    failedUploads.push({
                         fileName: result.fileName,
                         reason: result.reason?.message ||
                              "failed to upload to Google Cloud"
                    });

                    continue;
               }

               const { metaData, fileName } = result;
               const { studyUid, seriesUid, instanceUid, bodyPartExamined } = metaData;

               const fileUrl = `${BASE_API_URL}/dicom/study/${studyUid}/series/${seriesUid}/instance/${instanceUid}`;

               sliceArray.push({
                    fileName,
                    fileUrl,
                    sopInstanceUid: instanceUid,
                    seriesInstanceId: seriesUid,
                    bodyPart: bodyPartExamined || "Unknown"
               });
          }

          const newDicomStudy = await createDicomStudy({
               patientId,
               checkUpId,
               medicalCaseId,
               uploadedBy: req.user.userId,
               studyInstanceId: req.dicomPayload.studyUid,
               modality: req.dicomPayload.modality || "Others",
               slices: sliceArray
          });

          const timelineEvent = await logTimelineEvent({
               patientId,
               eventData: {
                    eventType: 'DICOM_UPLOADED',
                    performedByRole: req.user.role,
                    performedBy: req.user.roleRefId,
                    eventReferenceId: newDicomStudy._id,
                    referenceModel: 'DicomStudy',
                    note: `${sliceArray.length} DICOM files uploaded`
               }
          });

          return res.status(201).json({
               totalProcessed: dicomResults.length,
               successCount: sliceArray.length,
               failedCount: failedUploads.length,
               failedFiles: failedUploads,
               msg: `Successfully processed and stored ${sliceArray.length} DICOM instances.`,
               timelineEventId: timelineEvent._id,
               recordId: newDicomStudy._id
          });

     } catch (err) {
          console.error("Error during extraction of zip and uploading Dicoms\n", err.message);

          if (newDicomStudy) {
               await DicomStudy.findByIdAndDelete(newDicomStudy._id);
          }

          if (req.dicomPayload.studyUid) {
               await deleteDicomInstance(req.dicomPayload.studyUid);
          }

          return next(err);
     }
};

// export const handleDeleteDicomStudy = async (req, res, next) => {
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

export const handleGetAllDicomStudys = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedParams;

          const checkUp = await CheckUp.findById(checkUpId);
          if (!checkUp) {
               return next(
                    new APIError(404, "invalid check-up Id")
               );
          }

          const dicoms = await DicomStudy.find({ checkUpId, isDeleted: false });

          return res.status(200).json({
               data: dicoms,
               msg: dicoms.length === 0 ? "No dicom files found" : "Dicom files fetched"
          });

     } catch (err) {
          console.error("Error during getting all dicom files\n", err.message);

          return next(err);
     }
}

export const handlePreviewDicomStudy = async (req, res, next) => {
     try {
          const { DicomStudyId } = req.parsedParams;

          const DicomStudy = await DicomStudy.findOne({
               _id: DicomStudyId,
               isDeleted: false
          });

          if (!DicomStudy) {
               return next(
                    new APIError(404, "invalid dicom file Id")
               );
          }

          const {
               studyInstanceId,
               seriesInstanceId,
               sopInstanceUid
          } = DicomStudy;

          const buffer = await previewDicomInstance(studyInstanceId, seriesInstanceId, sopInstanceUid);

          return res.type('application/dicom').send(buffer);
     } catch (err) {
          console.error('failed during dicom file preview\n', err.message);
          next(err);
     }
};

export const handleGetAllLabReports = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedParams;

          const checkUp = await CheckUp.findById(checkUpId);

          if (!checkUp)
               return res.status(400).json({
                    err: "invalid check-up Id"
               });

          const labReports = await LabReport.find({ checkUpId });

          return res.status(200).json({
               data: labReports,
               msg: labReports.length === 0 ? "No reports found" : "Reports fetched"
          })
     } catch (err) {
          console.error("failed to show lab reports\n", err.message);
          return next(err);
     }
};

export const handleGetPDF = async (req, res, next) => {
     try {
          const { labReportId } = req.parsedParams;

          const labReport = await LabReport.findById(labReportId);
          if (!labReport)
               return res.status(400).json({
                    msg: "no lab reports found"
               });

          const redirectingURL = await getSignedUrlFromS3(labReport);

          return res.status(200).json({
               msg: "successfully getting the signed URL from aws s3",
               data: redirectingURL
          });
     } catch (err) {
          console.error("Error during showing report PDF\n", err.message);
          return next(err);
     }
};

export const handleUploadPDF = async (req, res, next) => {
     const { path: filePath } = req.file;

     try {
          const { checkUpId } = req.parsedParams;
          const { patientId } = req.parsedBody;

          const checkUp = await CheckUp.findOne({
               _id: checkUpId,
               patientId
          });

          if (!checkUp) {
               return next(
                    new APIError(
                         404,
                         "CheckUp not found or doesn't belong to this patient"
                    )
               );
          }

          const s3Key = `patient/${patientId}/report/${crypto.randomUUID()}.pdf`;

          await uploadFileToS3(s3Key, filePath);

          req.s3Key = s3Key;

          const { _id: labReportId } = await LabReport.create({
               ...req.parsedBody,
               s3Key,
               uploadedBy: req.user.roleRefId
          });

          req.LabReportId = labReportId;

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

          return res.status(201).json({ msg: "report file uploaded successfully" });
     } catch (err) {
          console.error("failed during pdf upload\n", err.message);

          if (req.LabReportId)
               await LabReport.findByIdAndDelete(req.LabReportId);

          if (req.s3Key)
               await deleteFileFromS3(req.s3Key);

          return next(err);
     } finally {
          if (filePath && fs.existsSync(filePath))
               fs.unlinkSync(filePath);
     }
};