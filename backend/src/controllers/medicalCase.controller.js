import { Promise } from "mongoose";
import { Nurse, Doctor, MedicalCase } from "../models/index.js";

export const handleCreateMedicalCase = async (req, res) => {
     try {
          const { staffId } = req.user;
          const { diagnosedBy } = req.parsedBody;

          const [nurse, doctor] = await Promise.all([
               Nurse.findOne({ staffId }),
               Doctor.findById(diagnosedBy)
          ]);

          if (!nurse) return res.status(404).json({ err: "no nurse found with this staffId" });
          if (!doctor) return res.status(404).json({ err: "no doctor found with this mongoose Id" });

          const medicalCase = await MedicalCase.create(req.parsedBody);

          return res.status(201).json({ status: "created", data: medicalCase });
     } catch (err) {
          console.error("failed creationg of medical-case\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateMedicalCase = async (req, res) => {
     try {
          const { staffId } = req.user;
          const { medicalCaseId } = req.parsedParams;

          const [nurse, medicalCase] = await Promise.all([
               Nurse.findOne({ staffId }),
               MedicalCase.findById(medicalCaseId)
          ]);

          if (!nurse) return res.status(404).json({ err: "invalid staffId" });
          if (!medicalCase) return res.status(404).json({ err: "invalid medical-case Id" });

          const updatedMedicalCase = await MedicalCase.findByIdAndUpdate(
               medicalCaseId,
               { ...req.parsedBody },
               { returnDocument: "after", runValidators: true }
          );

          return res.status(200).json({ status: "ok", data: updatedMedicalCase });
     } catch (err) {
          console.log("failed updation of medicalCase\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetAllMedicalCase = async (req, res) => {
     try {
          const { staffId } = req.user;
          const { timelineEventId } = req.parsedParams;

          const nurse = await Nurse.findOne({ staffId });
          if (!nurse) return res.status(404).json({ err: "no nurse found with this staffId" });

          const allMedicalCases = await MedicalCase.find({ timelineEventId });

          if (allMedicalCases.length === 0) return res.status(204).json({ msg: "no medical cases exist yet" });

          return res.status(200).json({ status: "ok", data: allMedicalCases });
     } catch (err) {
          console.log("error in getting all medical case\n", err);
          return res.status(500).json({ err: 'INTERNAL SERVER ERROR' });
     }
};