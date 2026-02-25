import { Schema, model } from "mongoose";

const patientSchema = new Schema({
     fullName: {
          type: String,
          required: true,
     },
     emailId: {
          type: String,
          required: true,
          unique: true,
     },
     password: {
          type: String,
          required: true,
     },
     gender: {
          type: String,
          enum: ['Male', 'Female', 'Others'],
          required: true
     },
     profilePic_url: {
          type: String,
          required: false,
          default: "/pfp/default-user"
     },
     dateOfBirth: {
          type: Date,
          required: false,
     },

     weight: {
          type: Number,
          required: false
     },
     height: {
          type: Number,
          required: false
     },

     bloodType: {
          type: String,
          enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
          trim: true,
          required: true,
          uppercase: true,
     },

     // currentMedicalCondition: {
     //      type: String,
     //      default: null,
     //      required: false,
     // },
     // currentMedications: [
     //      {
     //           medicineName: String,
     //           medicineDosage: String,
     //           frequency: String,
     //           startDate: Date,
     //           endDate: Date,
     //           prescribedBy: {
     //                type: mongoose.Schema.Types.ObjectId,
     //                ref: 'Doctor'
     //           },
     //           status: {
     //                type: String,
     //                enum: ['Active', 'Completed'],
     //                default: 'Active'
     //           }
     //      }
     // ],
     // nextCheckup: {
     //      type: Date,
     //      default: null,      //if the condition is good :) null end of the treatment
     //      required: false,
     // },
     // migrationHistory: [
     //      {
     //           fromDistrict: String,
     //           toDistrict: String,
     //           movedAt: Date
     //      }
     // ],

     birthPlace: {
          type: String,
          required: false
     },

     lifestyle: {
          smoking: { type: Boolean, default: false, required: true },
          alcohol: { type: Boolean, default: false, required: true },
          tobacco: { type: Boolean, default: false, required: true },
          occupation: { type: String, required: false },
     },

     allergies: {        //past condition like hypertension / diabetes      
          type: [String],
          default: [],
          required: false,
     },

     location: {
          type: {
               type: String,
               enum: ['Point'],
               default: 'Point'
          },
          coordinates: {
               type: [Number],
               required: false
          }
     },

}, { collection: 'patientModel', timestamps: true });

const patientModel = model("Patient", patientSchema);

export default patientModel;