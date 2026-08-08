import { hashPhone, encryptPhoneFn, decryptPhoneFn } from "../utils/phoneNumber.utils.js";
import { model, Schema } from "mongoose";
import { hashPassword } from "../utils/password.utils.js";

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
     passwordHash: {
          type: String,
          required: true,
          select: false,
     },

     phoneNumberHash: {
          type: String,
          required: true,
          unique: true,
          select: false,
     },
     phoneNumberEnc: {
          type: String,
          required: true,
          select: false,
     },
     phoneIV: {
          type: String,
          required: false,
          select: false,
     },
     phoneAuthTag: {
          type: String,
          required: false,
          select: false,
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
     if (!this.isModified('phoneNumberEnc')) return next();

     const phone = this.phoneNumberEnc;
     this.phoneNumberHash = hashPhone(phone);

     const { encryptedPhone, iv, authTag } = encryptPhoneFn(phone);
     this.phoneNumberEnc = encryptedPhone;
     this.phoneIV = iv;
     this.phoneAuthTag = authTag;
});

userSchema.pre('save', async function(next) {
     if (!this.isModified('passwordHash')) return next();
     
     this.password = await hashPassword(this.password);
     next();
});

userSchema.methods.getPhoneNumber = function () {
     return decryptPhoneFn(this.phoneNumberEnc, this.phoneIV, this.phoneAuthTag);
};


userSchema.index({ emailId: 1 });

const User = model('User', userSchema);
export default User;