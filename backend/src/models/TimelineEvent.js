import { model, Schema } from "mongoose";
import { Doctor, LabTechnician, Nurse } from "../models/index.js";

const timelineEventSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true,
     },

     eventData: {
          type: [{
               eventType: {
                    type: String,
                    enum: [
                         'CHECKUP_CREATED',
                         'DICOM_UPLOADED',
                         'REPORT_UPLOADED',
                         'MEDICATION_CHANGED',
                         'MEDICAL_CASE_CREATED',
                         'MEDICAL_CASE_UPDATED',
                         'FOLLOW_UP_COMPLETED',
                         'PRESCRIPTION_ADDED',
                    ],
                    required: true
               },

               performedByRole: {
                    type: String,
                    enum: ['DOCTOR', 'NURSE', 'LAB_TECHNICIAN'],
                    required: true
               },

               performedBy: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    refPath: "performedByReference"
               },

               performedByReference: {
                    type: String,
                    enum: ["Doctor", "LabTechnician", "Nurse"],
                    required: true
               },

               eventReferenceId: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    refPath: "eventReferenceType"
               },

               eventReferenceType: {
                    type: String,
                    enum: ['CheckUp', 'MedicalCase', 'DicomFile', 'LabReport', 'FailedDicomFiles'],
                    required: true
               }
          }],
          default: [],
          required: true
     },

     medicalConditionName: {
          type: String,
          required: true,
     },

     startedAt: {
          type: Date,
          default: Date.now
     },
     endedAt: {
          type: Date,
          default: null
     },

     currentStatus: {
          type: String,
          enum: ['Active', 'Recovered', 'Chronic', 'Deceased'],
          default: 'Active',
     },

     note: {
          type: String,
          required: false
     },

});

const TimelineEvent = model("TimelineEvent", timelineEventSchema);
export default TimelineEvent;