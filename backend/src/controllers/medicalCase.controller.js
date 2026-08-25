import { Promise } from "mongoose";
import { Nurse, Doctor, MedicalCase, Patient } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetAllMedicalCases = async (req, res) => {
     try {
          const { roleRefId } = req.user;
          const { patientId } = req.parsedParams;

          const patient = await Patient.exists({ _id: patientId }).lean();
          if (!patient) {
               return next(
                    new APIError(404, "No patient record found")
               );
          }

          const allMedicalCases = await MedicalCase.find({
               patientId,
               assistedBy: roleRefId
          }).sort({ createdAt: -1 });

          if (allMedicalCases.length === 0) {
               return res.status(200).json({
                    status: "ok",
                    data: [],
                    messsage: "no medical cases exist yet"
               });
          }

          return res.status(200).json({
               status: "ok",
               data: allMedicalCases
          });

     } catch (err) {
          return next(err);
     }
};

export const handleCreateMedicalCase = async (req, res, next) => {
     try {
          const { roleRefId } = req.user;
          const { patientId } = req.parsedParams;
          const { doctorId } = req.parsedBody;

          const patient = await Patient.exists({ _id: patientId }).lean();
          if (!patient) {
               return next(
                    new APIError(404, "No patient record found")
               );
          }

          if (doctorId) {
               const doctor = await Doctor.exists({ _id: doctorId }).lean();

               if (!doctor) {
                    return next(
                         new APIError(404, "No doctor record found")
                    );
               }
          }

          const medicalCase = await MedicalCase.create({
               ...req.parsedBody,
               patientId,
               assistedBy: roleRefId,
               diagnosedBy: doctorId || null,
               timelineEventId: null
          });

          return res.status(201).json({
               success: true,
               message: "Medical case successfully created",
               data: medicalCase
          });

     } catch (err) {
          return next(err);
     }
};

export const handleUpdateMedicalCase = async (req, res) => {
     try {
          const { medicalCaseId } = req.parsedParams;

          const medicalCase = await MedicalCase.exists({ _id: medicalCaseId }).lean();

          if (!medicalCase) {
               return next(
                    new APIError(404, "No medical case record found")
               );
          }

          const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
               medicalCaseId,
               { ...req.parsedBody },
               { returnDocument: "after", runValidators: true }
          );

          return res.status(200).json({
               status: "ok",
               message: "Medical Case record updated successfully",
               data: updatedMedicalCase
          });

     } catch (err) {
          return next(err);
     }
};

export const handleChangeNurse = async (req, res, next) => {
     try {
          const { roleRefId } = req.user;
          const { nurseId, medicalCaseId } = req.parsedParams;

          if (roleRefId === nurseId) {
               return next(
                    new APIError(400, "Nurse ID matches the logged-in nurse")
               );
          }

          const [nurseExists, medicalCaseExists] = await Promise.all([
               Nurse.exists({ _id: nurseId }).lean(),
               MedicalCase.exists({
                    _id: medicalCaseId,
                    assistedBy: roleRefId
               }).lean()
          ]);

          if (!nurseExists) {
               return next(
                    new APIError(404, "Nurse record not found")
               );
          }

          if (!medicalCaseExists) {
               return next(
                    new APIError(404, "Either medical case not found or it is not assigned to you")
               );
          }

          const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
               medicalCaseId,
               { $set: { assistedBy: nurseId } },
               { returnDocument: true, runValidators: true }
          );

          return res.status(200).json({
               status: "ok",
               message: "New nurse is added to the medical case.",
               data: updatedMedicalCase
          });

     } catch (err) {
          return next(err);
     }
};

export const handleChangeDoctor = async (req, res, next) => {
     try {
          const { roleRefId } = req.user;
          const { doctorId, medicalCaseId } = req.parsedParams;

          const [doctorExists, medicalCaseExists] = await Promise.all([
               Doctor.exists({ _id: doctorId }).lean(),
               MedicalCase.exists({
                    _id: medicalCaseId,
                    assistedBy: roleRefId
               }).lean()
          ]);

          if (!doctorExists) {
               return next(
                    new APIError(404, "Doctor record not found")
               );
          }

          if (!medicalCaseExists) {
               return next(
                    new APIError(404, "Either medical case not found or it is not assigned to you")
               );
          }

          const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
               medicalCaseId,
               { $set: { diagnosedBy: doctorId } },
               { returnDocument: true, runValidators: true }
          );

          return res.status(200).json({
               status: "ok",
               message: "New doctor is added to the medical case.",
               data: updatedMedicalCase
          });

     } catch (err) {
          return next(err);
     }
};

export const handleChangeTimelineEvent = async (req, res, next) => {
     try {
          

     } catch (err) {
          return next(err);
     }
};