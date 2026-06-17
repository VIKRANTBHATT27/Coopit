import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";
import doctorModel from "../models/Doctor.js";

import mongoose from "mongoose";
import diseaseCaseModel from "../models/diseaseCaseModel.js";
import checkupModel from "../models/checkupModel.js";
import { previewDicomInstance } from "../service/dicomFileService.js";
import { createPasswordHash } from "../service/auth.service.js";
import MedicalCase from "../models/MedicalCase.js";


export const handleAddDoctor = async (req, res) => {
     try {
          const isAlreadyDoctor = await doctorModel.findOne({ emailId: req.parsedBody.emailId });

          if (isAlreadyDoctor) return res.status(400).json({ msg: "Doctor already exist with this Email" });

          const hashedPassword = await createPasswordHash(req.parsedBody.password);

          const doctor = await doctorModel.create({
               ...req.parsedBody,
               password: hashedPassword
          });

          return res.status(201).json({
               msg: "successfully created a doctor",
               doctorId: doctor._id
          });

     } catch (err) {
          console.log("error: ", err);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

export const handleGetDoctor = async (req, res) => {
     try {
          const doctor = await doctorModel.findOne({ staffId: req.params.staffId });
          if (!doctor) return res.status(400).json({ msg: "no doctor found with this staffId" });

          return res.status(200).json(labTechi);
     } catch (err) {
          console.log("error: ", err);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

export const handleUpdateDoctor = async (req, res) => {
     try {
          const doctor = await doctorModel.findOneAndUpdate({ staffId: req.params.staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          return res.status(400).json({ msg: "successfully updated", doctorId: doctor._id });
     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};


export const handleUploadImg = async (req, res) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     try {
          const response = await doctorModel.findOneAndUpdate({ emailId: req.parsedBody.emailId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               }, { returnDocument: "after" });

          console.log(response);
          return res.status(200).json({ msg: "successfully uploaded image" });
     } catch (err) {
          console.log("Doctor image upload failed\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

export const handleDeletePfpImage = async (req, res) => {
     try {
          const doctor = await doctorModel.findOne({ emailId: req.parsedBody.emailId });

          if (!doctor) return res.status(404).json({ err: "no doctor available with this emailId" });

          const result = await cloudinary_Delete_pfp(doctor.pfp_publicId);

          console.log(result);

          if (result) {
               const response = await doctorModel.findOneAndUpdate({ emailId },
                    {
                         $set: {
                              pfp_publicId: undefined,
                              pfp_url: "/public/default-pfp/default-avatar-doctor.png",
                         }
                    }, { returnDocument: "after" })

               return res.status(202).json({ response });
          }

     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// show all the disease case
export const handleGetDiseaseCase = async (req, res) => {
     try {
          const allDiseaseCase = await diseaseCaseModel.find({ diagnosedBy: req.params.doctorId });

          return res.status(200).json(allDiseaseCase);
     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// approve and disapprove the disease 
export const handleApproveMedicalCase = async (req, res) => {
     try {
          const medicalCase = await MedicalCase.findByIdAndUpdate(req.params.diseaseId,
               { $set: { status: "Approved" } },
               { returnDocument: "after" }
          );

          return res.status(204).json({ msg: "successfully updated", Id: diseaseCase._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// pick those only checkups which have labResults
export const handleGetAllCheckUps = async (req, res) => {
     try {
          const allCheckUps = await checkupModel.find({ doctorId: req.params.doctorId });

          return res.status(200).json(allCheckUps);
     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// see the dicom files 
export const handlePreviewDicomFile = async (req, res) => {
     const { studyInstanceId: studyUid, seriesInstanceId: seriesUid, sopInstanceUid: instanceUid } = req.body;

     if (!studyUid)
          return res.status(400).json({ err: "study instance Id is not provided" });

     if (!seriesUid)
          return res.status(400).json({ err: "series instance Id is not provided" });

     if (!instanceUid)
          return res.status(400).json({ err: "sop Instance Uid is not provided" });

     try {
          await previewDicomInstance(res, studyUid, seriesUid, instanceUid);

     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// export const handleDoctorLogin = async (req, res) => {
//      const { emailId, password } = req.body;

//      if (!emailId && !password) return res.status(400).json({ err: "emailId and password are required!" });

//      try {
//           const token = await doctorModel.matchPassword_and_GenerateToken(emailId, password);

//           console.log(token);

//           res.cookie("authToken", token, {
//                httpOnly: true,
//                secure: false,      //turn it to true on deployment
//           });
//      } catch (error) {
//           console.log("error: ", error.message);

//           if (error.message === "Password not matched") return res.status(400).json({ err: "Invalid Credientials" });

//           return res.status(500).json({ err: "INTERNAL SERVER ERROR", error: err.message });
//      }
// };
