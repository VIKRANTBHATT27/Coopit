import Visit from "../models/visit.model.js";
import Patient from "../models/patient.model.js";
import Hospital from "../models/hospital.model.js";
import Nurse from "../models/nurse.model.js";
import { Promise } from "mongoose";

export const handleCreatePatientVisit = async (req, res) => {
     try {
          const { patientId } = req.parsedParams;
          const { nurseId, hospitalId } = req.parsedBody;

          const [patient, nurse, hospital] = await Promise.all([
               Patient.findById(patientId),
               Nurse.findById(nurseId),
               Hospital.findById(hospitalId)
          ]);

          if (!patient) return res.status(404).json({ err: "Patient not found" });
          if (!nurse) return res.status(404).json({ err: "Nurse not found" });
          if (!hospital) return res.status(404).json({ err: "Hospital not found" });

          const [nurse, visit] = await Promise.all([
               Nurse.findOneAndUpdate({ _id: nurseId }, { $push: { assignedPatients: patientId } }),
               Visit.create({ ...req.parsedBody, medicalCaseId: undefined })
          ]);          

          return res.status(201).json({ msg: "successfully created a visit", visitId: visit._id });
     } catch (err) {
          console.error("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetAllNurse = async (req, res) => {
     try {
          const allNurse = await Nurse.find({});
          if (!allNurse) return res.status(204).json({ msg: "no nurse exist" });

          return res.status(200).json({ status: "ok", data: allNurse });
     } catch (err) {
          console.error("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};
