import { Promise } from "mongoose";
import { CheckUp, DicomFile, Doctor, FailedDicomFiles, LabReport, LabTechnician, MedicalCase, Nurse, Patient, Receptionist, Staff, TimelineEvent } from "../models/index.js";

export const handleGetPatientTimeline = async (req, res) => {
     try {
          const { staffId } = req.user;
          const { patientId } = req.parsedQuery;

          const [nurse, patient] = await Promise.all([
               Nurse.findOne({ staffId }),
               Patient.findById(patientId)
          ]);

          if (!nurse) return res.status(404).json({ err: "no nurse found with this staffId" });
          if (!patient) return res.status(404).json({ err: "no patient found with this mongoose object Id" });

          const allTimelineEvents = await TimelineEvent.findOne({ patientId });

          if (!allTimelineEvents) return res.status(404).json({ err: "no timeline event found with this patientId" });

          return res.status(200).json({ status: "ok", data: allTimelineEvents });
     } catch (err) {
          console.log("failed getting the timeline-event\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};


export const handleCreatePatientTimeline = async (req, res) => {
     try {
          const { patientId } = req.parsedQuery;
          const { staffId, role } = req.user;
          const { eventData: { eventReferenceId } = {} } = req.parsedBody;

          const [staff, patient, medicalCase] = await Promise.all([
               Staff.findById(staffId),
               Patient.findById(patientId),
               MedicalCase.findById(eventReferenceId)
          ]);

          if (!staff) return res.status(404).json({ err: "invalid staffId" });
          if (!patient) return res.status(404).json({ err: "invalid patientId" });
          if (!medicalCase) return res.status(404).json({ err: "invalid medicalCaseid" });

          const roleModel = {
               NURSE: Nurse,
               DOCTOR: Doctor,
               RECEPTIONIST: Receptionist,
               LAB_TECH: LabTechnician,
          }[role];

          //nurse._id, doctor._id, labTechnician._id => performedBy
          const roleDoc = await roleModel.findOne({ staffId });
          if (!roleDoc) return res.status(404).json({ err: `no ${staff.role} found!` });

          const isAlreadyExisting = await TimelineEvent.findOne({
               patientId,
               eventData: { $elemMatch: { eventReferenceId } }
          });

          if (isAlreadyExisting) return res.status(409).json({ err: "timeline already exist for this medical case" });

          const timelineEvent = await TimelineEvent.create({
               ...req.parsedBody,
               eventData: {
                    ...req.parsedBody.eventData,
                    performedByRole: role,
                    performedBy: roleDoc._id,
                    performedByReference: roleModel,
                    eventReferenceId,
                    eventReferenceType: "MedicalCase"
               }
          });

          if (!timelineEvent) return res.status(500).json({ err: "failed to create timeline event" });

          return res.status(201).json({ status: "ok", data: timelineEvent });
     } catch (err) {
          console.log("failed timeline creation for patient\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleAddNewEventData = async (req, res) => {
     try {
          const { staffId, role } = req.user;
          const { timelineEventId } = req.parsedParams;
          const { eventData: { eventReferenceId, eventReferenceType } } = req.parsedBody;

          const roleModel = {
               NURSE: Nurse,
               DOCTOR: Doctor,
               RECEPTIONIST: Receptionist,
               LAB_TECH: LabTechnician,
          }[role];

          const eventModel = {
               CheckUp,
               MedicalCase,
               DicomFile,
               LabReport,
               FailedDicomFiles
          }[eventReferenceType];

          const [staff, roleDoc, event] = await Promise.all([
               Staff.findById(staffId),
               roleModel.findOne({ staffId }),
               eventModel.findById(eventReferenceId)
          ]);


          if (!staff) return res.status(404).json({ err: "invalid staffId" });
          if (!event) return res.status(404).json({ err: "invalid event" });
          if (!roleDoc) return res.status(404).json({ err: `no ${staff.role} found!` });

          const timelineEvent = await TimelineEvent.findByIdAndUpdate(
               timelineEventId,
               {
                    eventData: {
                         $push: {
                              ...req.parsedBody.eventData,
                              performedByRole: role,
                              performedBy: roleDoc._id,
                              performedByReference: roleModel,
                              eventReferenceId,
                              eventReferenceType
                         }
                    }
               },
               { returnDocument: 'after', runValidators: true }
          );

          if (!timelineEvent) return res.status(500).json({ err: "failed to add a new event to timeline" });

          return res.status(200).json({ status: "ok", data: timelineEventId });

     } catch (err) {
          console.log("failed to create a new event in timeline\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};


export const handleDeleteTimelimeEvent = async (req, res) => {
     try {
          const { staffId, role } = req.user;
          const { timelineEventId } = req.parsedParams;

          const response = await TimelineEvent.findByIdAndDelete(timelineEventId);
          if (!response) return res.status(500).json({ err: "no timeline event exist with this Id" });

          return res.status(200).json({ status: "ok", msg: "deleted successfully" });
     } catch (err) {
          console.log("failed during deletion of timeline-event\n", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};