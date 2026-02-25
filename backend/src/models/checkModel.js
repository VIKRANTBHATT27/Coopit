import { Schema, model } from "mongoose";

const checkupSchema = new Schema({
     diseaseCaseId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "DiseaseCase"
     },
     patientId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Patient"
     },
     doctorId: {
          type: Schema.Types.ObjectId,
          required: true,  
          ref: "Doctor"
     },

     visitDate: {
          type: Date,
          required: true,
     },

     symptoms: {
          type: [String],     
          required: true
     },

     progressStatus: {
          type: String,
          enum: ["First Visit", "Improving", "Worsening", "Stable"],
          required: true
     },

     vitals: {
          temperature: Number,
          bp: {
               systolic: Number,
               diastolic: Number
          },
          pulse: Number
     },

     vaccinationsGiven: [
          {
               vaccineName: String,
               doseNumber: Number
          }
     ],
     treatments: [
          {
               treatmentType: {
                    type: String,
                    enum: ["Tablet", "Injection", "IV", "Surgery"]
               },
               name: String,
               dosage: String,          //no dosage but frequency only as dosage
               frequency: String,
               duration: String
          }
     ],

     labResults: [
          {
               testName: String,
               result: String,
               normalRange: String,
               fileUrl: String
          }
     ],

     notes: {
          type: String,
          required: false,
     },

     nextFollowUp: {
          type: Date,
          required: false
     }

}, { collection: 'checkupModel', timestamps: true });

const checkupModel = model('checkUp', checkupSchema);
export default checkupModel;