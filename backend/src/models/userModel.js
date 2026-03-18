import { model, Schema } from "mongoose";

const userSchema = new Schema({
     fullName: {
          type: String,
          required: true,
          trim: true,
     },
     emailId: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,     
     },
     password: {
          type: String,
          required: true,
     },
     phoneNumber: {
          type: String,
          required: true,
          unique: true,
     },
     phoneIV: {
          type: String,
          required: false,
     },
     phoneAuthTag: {
          type: String,
          required: false
     },

     gender: {
          type: String,
          enum: ['Male', 'Female', 'Others'],
          required: true
     },

     pfp_publicId: {
          type: String,
          required: false,
     },

     dateOfBirth: {
          type: String,
          required: false,
     },

     role: {
          type: String,
          enum: ["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB-TECHNICIAN"],
          required: true
     },

     state: {
          type: String,
          required: true
     },
     districtName: {          //current city
          type: String,
          required: true
     },
     landmark: {              //landmark => area wise calculation => only for patients
          type: String,
          required: true
     },

     birthPlace: {
          type: String,
          required: false
     },
     
     isVerified: {            //using phoneNo and otp procedure
          type: Boolean,
          default: false
     }

}, { timestamps: true });


export default model('User', userSchema);