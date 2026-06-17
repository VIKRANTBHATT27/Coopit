import { model, Schema } from "mongoose";

const visitSchema = new Schema({         // i don't know why i putted this model 
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

     assignedNurse: {
          type: Schema.Types.ObjectId,
          ref: "Nurse",
          required: true
     },

     medicalCaseId: {
          type: Schema.Types.ObjectId,
          ref: "medicalCase",
          required: false
     },     

     reason: {
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
          type: Date,
          default: Date.now
     },

     timelineEventId: {
          type: Schema.Types.ObjectId,
          ref: "TimeLineEvent",
          required: false,
     }
});

visitSchema.index({ hospitalId: 1, visitDate: -1 });
visitSchema.index({ assignedDoctor: 1 });
visitSchema.index({ patient: 1 });

const Visit = model("Visit", visitSchema);
export default Visit;
