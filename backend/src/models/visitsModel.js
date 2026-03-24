import { model, Schema } from "mongoose";

const visitSchema = new Schema({
     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true
     },

     createdBy: {
          type: Schema.Types.ObjectId,
          ref: "Receptionist",
          required: true
     },

     hospitalId: {
          type: Schema.Types.ObjectId,
          ref: "Hospital",
          required: true
     },

     diseaseCaseId: {
          type: Schema.Types.ObjectId,
          ref: "DiseaseCase"
     },

     assignedDoctor: {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
          required: true
     },

     assignedNurse: {
          type: Schema.Types.ObjectId,
          ref: "Nurse",
     },

     reasonForVisit: {
          type: String,
          required: true
     },

     status: {
          type: String,
          enum: [
               "WAITING",
               "IN_CONSULTATION",
               "CHECKUP_DONE",
               "CLOSED"
          ],
          default: "WAITING"
     },

     visitDate: {
          type: String,
          required: true,
     }

}, { timestamps: true });

visitSchema.index({ hospitalId: 1, visitDate: -1 });
visitSchema.index({ assignedDoctor: 1 });
visitSchema.index({ patient: 1 });

export default model('Visit', visitSchema, "visitModel");