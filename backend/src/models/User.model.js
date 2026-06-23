import { hashPhone, encryptPhoneFn, decryptPhoneFn } from "../utils/phoneNumber.utils.js";
import { model, Schema } from "mongoose";
import argon2 from "argon2";

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
     if (!this.isModified('phoneNumberEnc')) return next();

     const phone = this.phoneNumberEnc;
     this.phoneNumberHash = hashPhone(phone);

     const { encryptedPhone, iv, authTag } = encryptPhoneFn(phone);
     this.phoneNumberEnc = encryptedPhone;
     this.phoneIV = iv;
     this.phoneAuthTag = authTag;
});

userSchema.pre('save', async function (next) {
     if (!this.isModified('passwordHash')) return next();

     this.passwordHash = await argon2.hash(this.passwordHash);
});

userSchema.methods.getPhoneNumber = function () {
     return decryptPhoneFn(this.phoneNumberEnc, this.phoneIV, this.phoneAuthTag);
};

userSchema.statics.matchPassword = async function (emailId, password) {
     const user = await this.findOne({ emailId });

     const isVerified = await argon2.verify(user.passwordHash, password);
     
     return isVerified;
};

userSchema.index({ emailId: 1 });

const User = model('User', userSchema);
export default User;