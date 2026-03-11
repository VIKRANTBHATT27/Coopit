import { model, Schema } from "mongoose";

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
          default: Date.now
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
                    vaccineName: String,
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
     treatments: [
          {
               treatmentType: {
                    type: String,
                    enum: ["Tablet", "Injection", "IV", "Surgery", "Procedure", "Therapy"]     //Procedure => dressing, Therapy => physiotherapy
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

               fileUrl: String,

               uploadedAt: {
                    type: Date,
                    default: Date.now
               },

               uploadedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "labTechnician",
                    required: true
               }
          }
     ],
     attachments: [      
          {
               type: {
                    type: String,
                    enum: ["XRay", "MRI", "Prescription", "Scan", "Other"]
               },

               fileUrl: String,

               uploadedAt: {
                    type: Date,
                    default: Date.now
               },
               uploadedBy: {
                    type: Schema.Types.ObjectId,
                    ref: "labTechnician",
                    required: true
               }
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

}, { timestamps: true });

checkupSchema.index({ patientId: 1 });
checkupSchema.index({ diseaseCaseId: 1 });

const checkupModel = model('Checkup', checkupSchema);
export default checkupModel;