import { model, Schema } from "mongoose";

const dicomFileSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true,
          index: true,
     },

     checkUpId: {
          type: Schema.Types.ObjectId,
          ref: "CheckUp",
          required: true,
          index: true
     },

     medicalCaseId: {
          type: Schema.Types.ObjectId,
          ref: "medicalCase",
          required: true,
     },

     fileName: {
          type: String,
          required: true
     },

     fileUrl: {
          type: String,
          required: true
     },

     studyInstanceId: {       // unique ID for the study (GCP returns this)
          type: String,
          required: true
     },

     seriesInstanceId: {
          type: String,
          required: true
     },

     sopInstanceUid: {             //or instanceUid
          type: String,
          required: true
     },

     modality: {
          type: String,
          enum: ["XRay", "MRI", "UltraSound", "CT-Scan", "PT-scan", "Diagnostic Imaging", "Others"],
          required: true
     },

     bodyPart: {
          type: String,
          required: false
     },
     uploadedBy: {
          type: Schema.Types.ObjectId,
          ref: "labTechnician",
          required: true
     },

     uploadedAt: {
          type: Date,
          default: Date.now
     }
});

dicomFileSchema.index({ patientId: 1 });
dicomFileSchema.index({ checkUpId: 1 });
dicomFileSchema.index({ medicalCaseId: 1, checkUpId: 1 });

const DicomFile = model("dicomFile", dicomFileSchema);
export default DicomFile;