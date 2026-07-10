import { model, Schema } from "mongoose";

const checkupSchema = new Schema({
     medicalCaseId: {
          type: Schema.Types.ObjectId,
          ref: "medicalCase",
          required: true,
          index: true
     },

     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true,
          index: true
     },

     doctorName: {
          type: String,
          required: true
     },

     symptoms: {
          type: [String],
          default: []
     },

     progressStatus: {
          type: String,
          required: true,
          enum: ["First Visit", "Improving", "Worsening", "Stable"],
     },

     vitals: {
          oxygenSaturation: { type: Number, required: false },
          respirationRate: { type: Number, required: false },
          temperature: Number,     //*c or *fahrenheit
          pulse: Number,      //bpm => beats per minute

          bp: {
               systolic: Number,
               diastolic: Number
          }
     },

     vaccinationsGiven: {
          type: [
               {
                    vaccineName: { type: String, required: true },
                    doseNumber: Number,
                    administeredAt: { type: Date, default: Date.now },
                    administeredBy: {
                         type: Schema.Types.ObjectId,
                         ref: "Doctor"
                    }
               }
          ],
          default: [],
     },
     treatments: [{
          treatmentType: {
               type: String,
               enum: ["Tablet", "Injection", "IV", "Surgery", "Procedure", "Therapy"]     //Procedure => dressing, Therapy => physiotherapy
          },
          name: {
               type: String,
               required: true
          },
          dosage: String,
          frequency: String,
          duration: String
     }],

     notes: {
          type: String,
          required: false,
     },

     nextFollowUp: {
          type: Date,
          required: false
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

checkupSchema.index({ patientId: 1 });
checkupSchema.index({ medicalCaseId: 1 });

const CheckUp = model("Checkup", checkupSchema);
export default CheckUp;