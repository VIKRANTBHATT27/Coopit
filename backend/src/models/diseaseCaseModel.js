import { Schema, model } from "mongoose";

const diseaseCase_Schema = new Schema({      //help in analyse of cases in particular area
     patientId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Patient"
     },
     diagonsedBy: {
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
          default: Date.now(),
          required: true,
     },
     endedAt: {
          type: Date,
          default: null,
          required: true
     },

     status: {
          type: String,
          enum: ['Active', 'Recovered', 'Chronic'],
          default: 'Active',
          required: true,
     },

     initialSeverity: {
          type: String,
          enum: ['Mild', 'Moderate', 'Severe'],
          required: true,
     },

     districtForDiagonsis: {
          type: String,
          required: true
     }
}, { timestamps: true });

const diseaseCaseModel = model("DiseaseCase", diseaseCase_Schema);
export default diseaseCaseModel;