import { model, Schema } from "mongoose";

const checkupSchema = new Schema({
     diseaseCaseId: {
          type: Schema.Types.ObjectId,
          ref: "DiseaseCase",
          required: false,
     },

     patientId: {
          type: Schema.Types.ObjectId,
          ref: "Patient",
          required: true
     },

     doctorId: {
          type: Schema.Types.ObjectId,
          ref: "Doctor",
          required: true
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

     labResults: {
          type: [
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
          default: undefined,
          required: false,
          isApproved: {
               type: Boolean,
               default: false
          }
     },

     dicomFiles: {
          type: [
               {
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
                         enum: ["XRay", "MRI", "UltraSound", "CT-Scan",  "PT-scan", "Diagnostic Imaging", "Others"],
                         required: true
                    },

                    bodyPart: {
                         type: String,
                         required: false
                    },

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
          default: undefined,
          required: false,
     },

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