import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import diseaseCaseModel from "../models/diseaseCaseModel.js";
import checkupModel from "../models/checkupModel.js";
import { previewDicomInstance } from "../service/dicomFileService.js";


export const handleAddDoctor = async (req, res) => {
     try {
          const response = await doctorModel(req.parsedBody);
          return res.status(201).json({ msg: "successfully created doctor", Id: response._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetDoctor = async (req, res) => {
     const staffId = req.params.Id;
     if (!staffId || !mongoose.Types.ObjectId.isValid(staffId))
          return res.status(400).json({ msg: "invalid staff Id provided!" });

     try {
          const doctor = await doctorModel.findOne(staffId);
          if (!doctor) return res.status(400).json({ msg: "no doctor found with this staffId" });

          return res.status(200).json(labTechi);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(400).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateDoctor = async (req, res) => {
     if (!req.parsedBody || Object.keys(req.parsedBody).length === 0)
          return res.status(400).json({ msg: "no data is provided" });

     const staffId = req.params.Id;
     if (!staffId || !mongoose.Types.ObjectId.isValid(staffId))
          return res.status(400).json({ err: "no staff Id is provided" });

     try {
          const doctor = await doctorModel.findOneAndUpdate({ staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          return res.status(400).json({ msg: "successfully updated", Id: doctor._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ msg: "INTERNAL SERVER ERROR" });
     }
};


export const handleUploadImg = async (req, res) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     if (!req.body.emailId) return res.status(400).json({ err: "no emailId is provided" });

     try {
          const response = await doctorModel.findOneAndUpdate({ emailId: req.body.emailId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               }, { returnDocument: "after" });

          console.log(response);
          return res.status(200).json({ msg: "successfully uploaded image" });
     } catch (error) {
          console.log("Doctor image upload failed", error.message);
          return null;
     }
};

export const handleDeletePfpImage = async (req, res) => {
     if (!req.body.emailId) return res.status(400).json({ err: "no emailId is provided!" });

     try {
          const { emailId } = req.body;

          const doctor = await doctorModel.findOne({ emailId });

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
          console.log("error: ", err.message);
          return null;
     }
};

// show all the disease case
export const handleGetDiseaseCase = async (req, res) => {
     const doctorId = req.params.Id;
     if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId))
          return res.status(400).json({ err: "invalid doctorId" });

     try {
          const allDiseaseCase = await diseaseCaseModel.find({ diagnosedBy: doctorId });

          return res.status(200).json(allDiseaseCase);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }

};

// approve and disapprove the disease 
export const handleApproveDiseaseCase = async (req, res) => {
     const diseaseId = req.params.Id;
     if (!diseaseId || !mongoose.Types.ObjectId.isValid(diseaseId))
          return res.status(400).json({ err: "invalid diseaseId" });

     try {
          const diseaseCase = await diseaseCaseModel.findByIdAndUpdate(diseaseId,
               { $set: { status: "Approved" } },
               { returnDocument: "after" }
          );

          return res.status(204).json({ msg: "successfully updated", Id: diseaseCase._id });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

// pick those only checkups which have labResults
export const handleGetAllCheckUps = async (req, res) => {
     const doctorId = req.params.Id;
     if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId))
          return res.status(400).json({ err: "invalid doctorId" });

     try {
          const allCheckUps = await checkupModel.find({ doctorId });

          return res.status(200).json(allCheckUps);
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

// see the dicom files 
export const handlePreviewDicomFile = async (req, res) => {
     const { studyInstanceId: studyUid, seriesInstanceId: seriesUid, sopInstanceUid: instanceUid  } = req.body;
     
     if (!studyUid)
          return res.status(400).json({ err: "study instance Id is not provided" });

     if (!seriesUid)
          return res.status(400).json({ err: "series instance Id is not provided" });

     if (!instanceUid)
          return res.status(400).json({ err: "sop Instance Uid is not provided" });

     try {
          await previewDicomInstance(res, studyUid, seriesUid, instanceUid);

     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleDoctorSignup = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0) {
          return res.status(400).json({ err: "No data is provided !" });
     }

     try {
          const parsedData = await doctorSchema.parse(req.body);

          console.log(parsedData);

          const isAlreadyDoctor = await doctorModel.findOne({ emailId: parsedData.emailId });
          if (isAlreadyDoctor) {
               return res.status(400).json({ msg: "Doctor already exist with this Email" });
          }

          const hashedPassword = await bcrypt.hash(parsedData.password, 14);

          const doctor = await doctorModel.create({
               ...parsedData,
               password: hashedPassword
          });

          console.log(doctor);

          return res.status(201).json({
               msg: "✅ successfully created a doctor",
               doctorId: doctor._id
          });

     } catch (error) {
          console.log("error: ", error);
          return null;
     }

     return res.status(201).json({ msg: "successfully doctor details are feeded to DB" });
};

export const handleDoctorLogin = async (req, res) => {
     const { emailId, password } = req.body;

     if (!emailId && !password) return res.status(400).json({ err: "emailId and password are required!" });

     try {
          const token = await doctorModel.matchPassword_and_GenerateToken(emailId, password);

          console.log(token);

          res.cookie("authToken", token, {
               httpOnly: true,
               secure: false,      //turn it to true on deployment
          });
     } catch (error) {
          console.log("error: ", error.message);

          if (error.message === "Password not matched") return res.status(400).json({ err: "Invalid Credientials" });

          return null;
     }
};
