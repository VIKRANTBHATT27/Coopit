import { model, Schema } from "mongoose";

const labReportSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true,
          index: true,
          unique: true
     },

     checkUpId: {
          type: Schema.Types.ObjectId,
          ref: "CheckUp",
          required: true,
          index: true,
          unique: true
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

const LabReport = model("LabReport", labReportSchema);
export default LabReport;