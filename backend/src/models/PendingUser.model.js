import { Schema, model } from "mongoose";
import { decryptPhoneFn, encryptPhoneFn, hashPhone } from "../utils/phoneNumber.utils.js";

const pendingUserSchema = new Schema({
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

     role: {
          type: String,
          enum: ["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"],
          required: true
     },

     createdAt: {
          type: Date,
          default: Date.now,
          expires: 600
     }
});

pendingUserSchema.pre('save', function (next) {
     if (!this.isModified('phoneNumberEnc')) return next();

     const phone = this.phoneNumberEnc;
     this.phoneNumberHash = hashPhone(phone);

     const { encryptedPhone, iv, authTag } = encryptPhoneFn(phone);
     this.phoneNumberEnc = encryptedPhone;
     this.phoneIV = iv;
     this.phoneAuthTag = authTag;
});

pendingUserSchema.pre('save', async function (next) {
     if (!this.isModified('passwordHash')) return next();

     this.passwordHash = await argon2.hash(this.passwordHash);
});

// pendingUserSchema.methods.getPhoneNumber = function () {
//      return decryptPhoneFn(this.phoneNumberEnc, this.phoneIV, this.phoneAuthTag);
// };

// pendingUserSchema.statics.matchPassword = async function (emailId, password) {
//      const pendingUser = await this.findOne({ emailId });

//      const isVerified = await argon2.verify(pendingUser.passwordHash, password);

//      return isVerified;
// };

const PendingUser = model('PendingUser', pendingUserSchema);
export default PendingUser;