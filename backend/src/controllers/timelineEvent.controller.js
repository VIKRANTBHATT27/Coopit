import { CheckUp, DicomFile, Doctor, FailedDicomFiles, LabReport, LabTechnician, MedicalCase, Nurse, Patient, Receptionist, Staff, TimelineEvent } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetPatientTimelines = async (req, res, next) => {
     try {
          const { patientId } = req.parsedParams;

          const patient = await Patient.exists({ _id: patientId }).lean();

          if (!patient) {
               return next(
                    new APIError(404, "No patient record found")
               );
          }

          const allTimelineEvents = await TimelineEvent.find({
               patientId,
               currentStatus: 'ACITVE'
          }).sort({ createdAt: -1 });

          if (allTimelineEvents.length === 0) {
               return res.status(200).json({
                    status: "ok",
                    data: [],
                    messsage: "No timeline events found"
               });
          }

          return res.status(200).json({
               status: "ok",
               data: allTimelineEvents
          });

     } catch (err) {
          return next(err);
     }
};


export const handleCreatePatientTimeline = async (req, res, next) => {
     try {
          const { patientId } = req.parsedParams;
          const { roleRefId } = req.user;
          
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