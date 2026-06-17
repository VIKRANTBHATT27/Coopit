import { model, Schema } from "mongoose";

const medicalCase_Schema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Patient"
     },

     createdBy: {
          type: Schema.Types.ObjectId,
          ref: "Nurse",
          required: true
     },

     diagnosedBy: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Doctor"
     },

     timelineEventId: {
          type: Schema.Types.ObjectId,
          required: false,
          ref: "TimelineEvent",
          default: null,
     },

     severity: {
          type: String,
          enum: ['Mild', 'Moderate', 'Severe'],
          required: true,
     },

     category: {         //need a look 
          type: String,
          enum: ['Infectious', 'NonCommunicable', 'Genetic', 'Deficiency', 'Non-Infectious'],
          required: false
     },

     possibleCause: {
          type: String,
          required: false
     },

     isApproved: {
          type: Boolean,
          default: false
     },

     timelineEventId: {
          type: Schema.Types.ObjectId,
          ref: "TimeLineEvent",
          required: false,
     }

}, { timestamps: true });

medicalCase_Schema.index({ patientId: 1 });
medicalCase_Schema.index({ diagnosisDistrict: 1 });
medicalCase_Schema.index({ diseaseName: 1, status: 1 });

const MedicalCase = model("medicalCase", medicalCase_Schema);
export default MedicalCase;