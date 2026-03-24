import { model, Schema } from "mongoose";

const diseaseCase_Schema = new Schema({      //help in analyse of cases in particular area
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

     diseaseName: {
          type: String,
          required: true,
     },

     startedAt: {
          type: Date,
          default: Date.now,
          required: true,
     },
     endedAt: {
          type: Date,
          default: null,
     },

     status: {
          type: String,
          enum: ['Active', 'Recovered', 'Chronic', 'Deceased'],
          default: 'Active',
          required: true,
     },

     initialSeverity: {
          type: String,
          enum: ['Mild', 'Moderate', 'Severe'],
          required: true,
     },

     diagnosisLocation: {
          type: String,
          required: true
     },
     diseaseCategory: {
          type: String,
          enum: ['Infectious', 'NonCommunicable', 'Genetic', 'Deficiency'],
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

diseaseCase_Schema.index({ patientId: 1 });
diseaseCase_Schema.index({ diagnosisDistrict: 1 });
diseaseCase_Schema.index({ diseaseName: 1, status: 1 });

export default model("DiseaseCase", diseaseCase_Schema);;