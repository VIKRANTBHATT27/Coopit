import { model, Schema } from "mongoose";

const labReportSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true,
     },

     checkUpId: {
          type: Schema.Types.ObjectId,
          ref: "CheckUp",
          required: true,
     },

     medicalCaseId: {
          type: Schema.Types.ObjectId,
          ref: "medicalCase",
          required: true,
     },

     testName: {
          type: String,
          required: true
     },
     result: {
          type: String,
          required: true
     },
     normalRange: {
          type: String,
          required: false
     },

     s3Key: {
          type: String,
          required: false
     },

     // status: {
     //      type: String,
     //      enum: ['PENDING', 'COMPLETED', 'ABNORMAL'],
     //      default: 'PENDING'
     // },

     uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "labTechnician",
          required: true
     },

     uploadedAt: {
          type: Date,
          default: Date.now
     },
});

labReportSchema.index({ checkUpId: 1 });
labReportSchema.index({ medicalCaseId: 1 });
labReportSchema.index({ patientId: 1, uploadedAt: -1 });


const LabReport = model("LabReport", labReportSchema);
export default LabReport;