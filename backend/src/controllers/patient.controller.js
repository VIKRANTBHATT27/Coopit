import { Nurse, Patient } from "../models/index.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";
import APIError from "../utils/APIError.utils.js";

export const handleCreatePatient = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const alreadyExists = await Patient.exists({ userId }).lean();

          if (alreadyExists) {
               return next(
                    new APIError(409, "Patient already exist with this emailId")
               );
          }

          const patient = await Patient.create({
               ...req.parsedBody,
               userId
          });

          return res.status(201).json({
               msg: "successfully created a patient",
               patientId: patient._id
          });
     } catch (err) {
          return next(err);
     }
};

export const handleGetPatients = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const nurse = await Nurse.findOne({ staffId });

          const result = [];

          for (const patientId of nurse.assignedPatients) {
               const patientDetails = await Patient.findById(patientId)
                    .populate({
                         path: "userId",
                         select: "fullName dateOfBirth gender"
                    });

               result.push(patientDetails);
          }

          if (result.length === 0) {
               return res.status(200).json({
                    success: true,
                    message: "No patients are assigned",
                    data: []
               });
          }

          return res.status(200).json({
               success: true,
               data: result
          });

     } catch (err) {
          return next(err);
     }
};

export const handleGetPatient = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOne({ userId });

          if (!patient) {
               return next(
                    new APIError(404, "Patient record not found")
               );
          }

          return res.status(200).json({
               success: true,
               data: patient
          });

     } catch (err) {
          return next(err);
     }
};

export const handleUpdatePatient = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOneAndUpdate(
               { userId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after", runValidators: true }
          );

          if (!patient) {
               return next(
                    new APIError(404, "Patient record not found")
               );
          }

          return res.status(200).json({
               success: true,
               message: "successfully updated patient data",
               data: patient
          });

     } catch (err) {
          return next(err);
     }
};

export const handleUploadPatientAvatar = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOneAndUpdate(
               { userId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               },
               { returnDocument: "after" }
          );

          if (!patient) {
               return next(
                    new APIError(404, "Patient record not found")
               );
          }

          return res.status(200).json({
               success: true,
               msg: "successfully uploaded image",
               url: patient.pfp_url
          });
     } catch (err) {
          return next(err);
     }
};

export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOne({ userId });

          if (!patient) return res.status(404).json({ err: "no patient available with this userId" });

          const result = await deleteUserAvatar(patient.pfp_publicId);

          if (!result) {
               return next(
                    new APIError(500, "Failed to delete avatar from storage system.")
               );
          }

          patient.pfp_publicId = null;
          patient.pfp_url = "/public/default-pfp/default-patient.png";
          await patient.save();

          return res.status(200).json({ message: "successfully deleted image" });
     } catch (err) {
          return next(err);
     }

};