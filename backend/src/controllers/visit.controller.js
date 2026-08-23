import { Nurse, Visit, Patient, Hospital } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import mongoose from "mongoose";

export const handleCreatePatientVisit = async (req, res) => {
     const session = await mongoose.startSession();

     try {
          const { patientId } = req.parsedParams;
          const { assignedNurseId, hospitalId } = req.parsedBody;

          const [patient, hospital, nurse] = await Promise.all([
               Patient.exists({ _id: patientId }).lean(),
               Hospital.exists({ _id: hospitalId }).lean(),
               Nurse.exists({ _id: assignedNurseId }).lean(),
          ]);

          if (!patient) {
               return next(
                    new APIError(404, "No patient record found")
               );
          }
          if (!hospital) {
               return next(
                    new APIError(404, "No hospital record found")
               );
          }
          if (!nurse) {
               return next(
                    new APIError(404, "No nurse record found")
               );
          }

          session.startTransaction();

          const [visitRecord, updatedNurseRecord] = await Promise.all([
               Visit.create(
                    [{
                         ...req.parsedBody,
                         medicalCaseId: undefined,
                         timelineEventId: undefined
                    }],
                    { returnDocument: true, runValidators: true, session }
               ),
               Nurse.findOneAndUpdate(
                    { _id: assignedNurseId },
                    { $push: { assignedPatients: patientId } },
                    { returnDocument: true, runValidators: true, session }
               )
          ]);

          if (!Array.isArray(visitRecord) || visitRecord.length === 0) {
               return next(
                    new APIError(
                         500, "Failed to create a visit for the patient"
                    )
               );
          }

          if (!updatedNurseRecord) {
               return next(
                    new APIError(
                         500, "Failed to assign visit to nurse"
                    )
               );
          }

          await session.commitTransaction();

          return res.status(201).json({
               success: true,
               message: "successfully created and assigned the visit to the nurse",
               data: { visitRecord: visitRecord[0], updatedNurseRecord }
          });

     } catch (err) {
          await session.abortTransaction();

          return next(err);
     } finally {
          session.endSession();
     }
};
