import { model, Schema } from "mongoose";

const medicalCaseSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Patient"
     },

     assistedBy: {
          type: Schema.Types.ObjectId,
          ref: "Nurse",
          required: true
     },

     diagnosedBy: {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
          default: null,
     },

     timelineEventId: {
          type: Schema.Types.ObjectId,
          ref: "TimelineEvent",
          default: null,
     },

     severity: {
          type: String,
          enum: ['MILD', 'MODERATE', 'SEVERE'],
          required: true,
     },

     category: { 
          type: String,
          enum: [
               'GENETIC',
               'DEFICIENCY',
               'INFECTIOUS',
               'NON_INFECTIOUS',
               'NON_COMMUNICABLE',
          ],
          required: false
     },

     possibleCause: {
          type: String,
          required: false
     },

     isApproved: {
          type: Boolean,
          default: false
     }

}, { timestamps: true });

medicalCaseSchema.index({ patientId: 1 });
medicalCaseSchema.index({ diagnosisDistrict: 1 });
medicalCaseSchema.index({ diseaseName: 1, status: 1 });

const MedicalCase = model("medicalCase", medicalCaseSchema);
export default MedicalCase;