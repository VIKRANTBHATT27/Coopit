import { model, Schema } from "mongoose";

const timelineSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true,
     },

     medicalCaseId: {
          type: Schema.Types.ObjectId,
          ref: "medicalCase",
          required: true,
     },

     medicalConditionName: {
          type: String,
          required: true,
     },

     currentStatus: {
          type: String,
          enum: [
               "ACTIVE",
               "RECOVERED",
               "CHRONIC",
               "DECEASED"
          ],
          default: "ACTIVE",
     },

     eventData: {
          type: [
               {
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
                         enum: [
                              'DOCTOR',
                              'NURSE',
                              'LAB_TECHNICIAN'
                         ],
                         required: true
                    },

                    performedBy: {
                         type: Schema.Types.ObjectId,
                         required: true,
                         refPath: "performedByReference"
                    },

                    performedByReference: {
                         type: String,
                         enum: [
                              "Nurse",
                              "Doctor",
                              "LabTechnician",
                         ],
                         required: true
                    },

                    eventReferenceId: {
                         type: Schema.Types.ObjectId,
                         required: true,
                         refPath: "eventReferenceType"
                    },

                    eventReferenceModel: {
                         type: String,
                         enum: [
                              "CheckUp",
                              "DicomFile",
                              "LabReport",
                         ],
                         required: true
                    },

                    note: {
                         type: String,
                         required: false
                    },
               }
          ],
          required: true
     },

     startedAt: {
          type: Date,
          default: Date.now
     },

     endedAt: {
          type: Date,
          default: null
     },
});

const Timeline = model("Timeline", timelineSchema);
export default Timeline;