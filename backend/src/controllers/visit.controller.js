import Visit from "../models/visit.model.js";
import Patient from "../models/patient.model.js";
import Hospital from "../models/hospital.model.js";
import Nurse from "../models/nurse.model.js";
import { Promise } from "mongoose";
import APIError from "../utils/APIError.utils.js";

export const handleCreatePatientVisit = async (req, res) => {
     try {
          const { patientId } = req.parsedParams;
          const { assignedNurse: nurseId, hospitalId } = req.parsedBody;

          const [patientRecord, nurseRecord, hospitalRecord] = await Promise.all([
               Patient.exists({ _id: patientId }),
               Nurse.exists({ _id: nurseId }),
               Hospital.exists({ _id: hospitalId })
          ]);

          if (!patientRecord)
               return res.status(404).json({ err: "No patient record found with this patientId" });
          if (!nurseRecord)
               return res.status(404).json({ err: "No nurse record found with this nurseId" });
          if (!hospitalRecord)
               return res.status(404).json({ err: "No hospital record found with this hospitalId" });

          const [visitRecord, updatedNurseRecord,] = await Promise.all([
               Visit.create({
                    ...req.parsedBody,
                    medicalCaseId: undefined
               }),
               Nurse.findOneAndUpdate(
                    { _id: nurseId },
                    {
                         $push: {
                              assignedPatients: patientId
                         }
                    }
               )
          ]);

          if (!visitRecord)
               return next(
                    new APIError(
                         500, "Failed to create a visit for the patient"
                    )
               );

          if (!updatedNurseRecord)
               return next(
                    new APIError(
                         500, "Failed to assign visit to nurse"
                    )
               );

          return res.status(201).json({
               visitId: visit._id,
               message: "successfully created and assigned the visit to the nurse"
          });

     } catch (err) {
          console.error("failed during creating a patient visit\nerrorMsg: ", err.message);

          return next(err);
     }
};

export const handleGetAllNurse = async (req, res) => {
     try {
          const allNurse = await Staff.find({
               hospitalId: req.user.hospitalId
          });
          if (!allNurse) return res.status(204).json({ msg: "no nurse exist" });

          return res.status(200).json({ data: allNurse });
     } catch (err) {
          console.error("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};
