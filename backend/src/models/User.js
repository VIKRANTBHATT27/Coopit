import { hashPhone, encryptPhoneFn, decryptPhoneFn } from "../utils/crypto.utils.js";
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
          trim: true,
     },
     password: {
          type: String,
          required: true,
     },
     phoneNumberHash: {
          type: String,
          required: true,
          unique: true
     },
     phoneNumberEnc: {
          type: String,
          required: true,
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

     dateOfBirth: {
          type: Date,
          required: true,
     },

     role: {
          type: String,
          enum: ["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"],
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

     isVerified: {            //using phoneNo and otp procedure
          type: Boolean,
          default: false
     }

}, { timestamps: true });

userSchema.pre('save', function (next) {
     if (this.isModified('phoneNumberEnc')) {
          const phone = this.phoneNumberEnc;
          this.phoneNumberHash = hashPhone(phone);
          
          const { encryptedPhone, iv, authTag } = encryptPhoneFn(phone);
          this.phoneNumberEnc = encryptedPhone;
          this.phoneIV = iv;
          this.phoneAuthTag = authTag;
     }
     next();
});

userSchema.methods.getPhoneNumber = function () {
     return decryptPhoneFn(this.phoneNumberEnc, this.phoneIV, this.phoneAuthTag);
}

const User = model('User', userSchema);
export default User;