import { previewDicomInstance, deleteDicomInstance } from "../services/dicom.service.js";
import { Checkup, User, LabTechnician, Patient, LabReport, DicomStudy, Staff } from "../models/index.js";
import { Promise } from "mongoose";
import { getSignedUrlFromS3, uploadFileToS3 } from "../infrastructure/aws.js";
import { logTimelineEvent } from "../services/timelineEvent.service.js";
import crypto from 'node:crypto';
import APIError from "../utils/APIError.utils.js";
import { createDicomStudy } from "../services/dicomStudy.service.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";

import dotenv from "dotenv";
dotenv.config();


// export const handleAddLabTechnician = async (req, res, next) => {
//      try {
//           const { staffId } = req.parsedBody;

//           const alreadyRegistered = await LabTechnician.findOne({ staffId: req.parsedBody.staffId });

//           if (alreadyRegistered)
//                return res.status(400).json({

//                     err: "Lab Technician already registered with this staffId"
//                });

//           const labTechnician = await LabTechnician.create(req.parsedBody);

//           return res.status(201).json({ msg: "created successfully", labTechId: labTechnician._id });
//      } catch (err) {
//           console.error("failed during creation of lab technician\n", err.message);
//           next(err);
//      }
// };

export const handleGetLabTechDetails = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staff = await Staff.exists({ _id: staffId }).lean();

          if (!staff) {
               return next(
                    new APIError(404, "No staff record found")
               );
          }

          const labTechDetails = await LabTechnician.findOne({ staffId })
               .populate({
                    path: "staffId",
                    populate: {
                         path: "userId"
                    }
               });

          if (!labTechDetails) {
               return next(
                    new APIError(404, "No lab technician record found")
               );
          }

          return res.status(200).json({
               message: "details of lab technician",
               data: labTechDetails
          });

     } catch (err) {
          return next(err);
     }
};

export const handleGetLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId });
          if (!staffRecord)
               return next(
                    new APIError(
                         400,
                         "No staff record present with this staffId."
                    )
               );

          const labTechnician = await LabTechnician.findOne({ staffId });
          if (!labTechnician)
               return res.status(400).json({
                    sucess: false,
                    msg: "no lab technician found with this staffId"
               });

          return res.status(200).json({ data: labTechnician });
     } catch (err) {
          console.error("failed to get lab technician\n", err.message);

          return next(err);
     }
};

export const handleCreateLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staff = await Staff.exists({ _id: staffId }).lean();

          if (!staff) {
               return next(
                    new APIError(404, "No staff record found")
               );
          }

          const labTech = await LabTechnician.create({
               ...req.parsedBody,
               staffId
          });

          return res.status(201).json({
               message: "lab technician record created",
               data: labTech
          });

     } catch (err) {
          return next(err);
     }
};

export const handleUpdateLabTechnician = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId }).lean();

          if (!staffRecord)
               return next(
                    new APIError(
                         404,
                         "No staff record exist with this Id"
                    )
               );


          const updatedLabTechnician = await LabTechnician.findOneAndUpdate(
               { staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after", runValidators: true }
          );

          return res.status(200).json({
               message: "lab technician updated successfully",
               data: updatedLabTechnician
          });
     } catch (err) {
          console.error("failed during updating a lab-technician profile\n", err.message);
          next(err);
     }
};

export const handleUploadAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId }).lean();

          if (!staffRecord)
               return next(
                    new APIError(404, "No staff record found")
               );

          const updatedLabTech = await LabTechnician.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         pfp_url: req.pfpAvatarURL,
                         pfp_publicId: req.pfpAvatarPublicId
                    }
               },
               { returnDocument: "after", runValidators: true }
          );

          if (!updatedLabTech) {
               return next(
                    new APIError(404, "Lab Technician record not found")
               );
          }

          return res.status(200).json({
               message: "Successfully uploaded profile image",
               url: updatedLabTech.pfp_url
          });

     } catch (err) {
          if (req.pfpAvatarPublicId) {
               const result = await deleteUserAvatar(req.pfpAvatarPublicId);

               if (!result)
                    throw new Error(500, "Cloudinary profile image deletion failed!");
          }

          return next(err);
     }
};

export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId }).lean();

          if (!staffRecord) {
               return next(
                    new APIError(404, "No staff record found")
               );
          }

          const labTech = await LabTechnician.findOne({ staffId });

          if (!labTech) {
               return next(
                    new APIError(404, "No lab technician record found")
               );
          }

          const result = await deleteUserAvatar(labTech.pfp_publicId);


          if (!result) {
               return res.status(500).json({
                    sucess: false,
                    err: "Failed to delete image from cloudinary"
               });
          }

          labTech.pfp_publicId = undefined;
          labTech.pfp_url = "/default-pfp/default-lab-technician.png";

          await labTech.save();

          return res.status(200).json({
               message: "successfully deleted profile image",
               data: labTech
          });

     } catch (err) {
          return next(err);
     }
};

export const handleGetLabTechByDept = async (req, res, next) => {
     try {
          const { hospitalId } = req.user;
          const { department } = req.parsedQuery;

          const allDoctors = await Staff.find({
               hospitalId,
               department,
               role: "LAB_TECHNICIAN",
               status: "ACTIVE",
          });

          if (!allDoctors) {
               return next(
                    new APIError(404, "No doctor records found")
               );
          }

          const allDoctorDetails = [];

          for (const doctor of allDoctors) {
               const userDetails = await User.findById(doctor.userId).select("fullName emailId gender dateOfBirth");

               allDoctorDetails.push(userDetails);
          }

          return res.status(200).json({
               message: "details of all the doctors",
               data: allDoctorDetails
          });

     } catch (err) {
          return next(err);
     }
};

export const handleGetAllDicomStudies = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedParams;

          const checkupRecord = await Checkup.exists({ _id: checkUpId });

          if (!checkupRecord) {
               return next(
                    new APIError(404, "invalid checkup Id")
               );
          }

          const dicoms = await DicomStudy.find({
               checkUpId,
               isDeleted: false
          });

          return res.status(200).json({
               data: dicoms,
               message: dicoms.length === 0 ? "No dicom files found" : "Dicom files fetched"
          });

     } catch (err) {
          console.error("Error during getting all dicom files\n", err.message);

          return next(err);
     }
};

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

export const handleUploadDicomStudy = async (req, res, next) => {
     try {
          const { BASE_API_URL } = process.env;
          const { checkUpId } = req.parsedParams;
          const { patientId, medicalCaseId } = req.parsedBody;

          const {
               studyUid,
               seriesUid,
               instanceUid,
               modality,
               bodyPartExamined
          } = req.dicomPayload;


          const generatedFileUrl = `${BASE_API_URL}/dicom/study/${studyUid}/series/${seriesUid}/instance/${instanceUid}`;

          const sliceArray = [{
               fileName,
               fileUrl,
               sopInstanceUid: instanceUid,
               seriesInstanceId: seriesUid,
               bodyPart: bodyPartExamined || "Unknown"
          }];

          const { _id: dicomStudyId } = await createDicomStudy({
               patientId,
               checkUpId,
               medicalCaseId,
               uploadedBy: req.user.userId,
               studyInstanceId: req.dicomPayload.studyUid,
               modality: req.dicomPayload.modality || "Others",
               slices: sliceArray
          });

          const { _id: timelineEventId } = await logTimelineEvent({
               patientId,
               eventData: {
                    eventType: 'DICOM_UPLOADED',
                    performedByRole: req.user.role,
                    performedBy: req.user.roleRefId,
                    eventReferenceId: dicomStudyId,
                    referenceModel: 'DicomStudy',
                    note: `${sliceArray.length} DICOM files uploaded`
               }
          });

          return res.status(201).json({
               message: "successfully uploaded dicom file",
               timelineEventId,
               recordId: dicomStudyId
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

          const { _id: dicomStudyId } = await createDicomStudy({
               patientId,
               checkUpId,
               medicalCaseId,
               uploadedBy: req.user.userId,
               studyInstanceId: req.dicomPayload.studyUid,
               modality: req.dicomPayload.modality || "Others",
               slices: sliceArray
          });

          const { _id: timelineEventId } = await logTimelineEvent({
               patientId,
               eventData: {
                    eventType: 'DICOM_UPLOADED',
                    performedByRole: req.user.role,
                    performedBy: req.user.roleRefId,
                    eventReferenceId: dicomStudyId,
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
               recordId: dicomStudyId,
               timelineEventId,
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


export const handleGetAllLabReports = async (req, res, next) => {
     try {
          const { checkUpId } = req.parsedParams;

          const checkupRecord = await Checkup.exists({ _id: checkUpId });

          if (!checkupRecord)
               return res.status(404).json({
                    message: "invalid checkup mongooseId. This mongooseId doesn't point to any record"
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

export const handleGetReport = async (req, res, next) => {
     try {
          const { labReportId } = req.parsedParams;

          const labReport = await LabReport.findById(labReportId);
          if (!labReport)
               return res.status(400).json({
                    msg: "no lab reports found"
               });

          const { s3Key } = labReport;
          const redirectingURL = await getSignedUrlFromS3(s3Key);

          return res.status(200).json({
               message: "successfully getting the signed URL from aws s3",
               data: redirectingURL
          });
     } catch (err) {
          console.error("Error during showing report PDF\n", err.message);

          return next(err);
     }
};

export const handleUploadReport = async (req, res, next) => {
     const { path: filePath } = req.file;

     try {
          const { checkUpId } = req.parsedParams;
          const { patientId } = req.parsedBody;

          const [patientRecord, checkupRecord] = await Promise.all([
               Patient.exists({ _id: patientId }),
               Checkup.exists({ _id: checkUpId })
          ]);

          if (!patientRecord)
               return res.status(404).json({
                    message: "invalid patient mongooseId. This mongooseId doesn't point to any record"
               });

          if (!checkupRecord)
               return res.status(404).json({
                    message: "invalid checkup mongooseId. This mongooseId doesn't point to any record"
               });


          const s3Key = `patient/${patientId}/report/${crypto.randomUUID()}.pdf`;

          await uploadFileToS3(s3Key, filePath);

          req.s3Key = s3Key;

          const { _id: labReportId } = await LabReport.create({
               ...req.parsedBody,
               s3Key,
               uploadedBy: req.user.roleRefId
          });

          req.LabReportId = labReportId;

          const { _id: timelineEventId } = await logTimelineEvent({
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

          return res.status(201).json({
               message: "report file uploaded successfully",
               labReportId,
               timelineEventId
          });
     } catch (err) {
          console.error("failed during pdf upload\n", err.message);

          if (req.LabReportId)
               await LabReport.findByIdAndDelete(req.LabReportId);

          if (req.s3Key)
               await deleteFileFromS3(req.s3Key);

          return next(err);
     }
};