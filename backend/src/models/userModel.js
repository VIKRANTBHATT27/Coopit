import { checkPhoneNumber } from "../service/checkPhoneNumber.js";
import { generateToken } from "../service/auth.js";
import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new Schema({
     fullName: {
          type: String,
          required: true,
          trim: true,
          minlength: 1,
          maxlength: 60
     },
     emailId: {
          type: String,
          required: true,
          unique: true,
          lowercase: true,
          trim: true,
          match: [/^\S+@\S+\.\S+$/, "Invalid email"]
     },
     password: {
          type: String,
          required: true,
          validate: {
               validator: function (v) {
                    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(v);
               },
               message: props => `Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.`
          }
     },
     phoneNumber: {
          type: String,
          required: true,
          unique: true,
          validate: {
               validator: function (v) {
                    return /^\+?[1-9]\d{9,14}$/.test(v);
               },
               message: props => `${props.value} is not a valid 10-digit phone number!`
          },
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

     //i need to remove this and implement this with zod
     dateOfBirth: {
          type: String,
          required: true,
          validate: {
               validator: function (v) {
                    return /^(0?[1-9]|1[0-2])[\/](0?[1-9]|[12]\d|3[01])[\/](19|20)\d{2}$/.test(v);
               },
               message: props => `${props.value} is an INVALID DATE`
          }
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

userSchema.index({ emailId: 1 });

userSchema.static("matchPassword_and_GenerateToken", async (emailId, password) => {
     const user = await userModel.findOne({ emailId });
     if (!user) throw new Error("User not found");

     console.log(user);

     const isPassMatched = await bcrypt.compare(password, user.password);
     if (!isPassMatched) throw new Error("Password not matched");

     return user.phoneNumber;
});


export default model('User', userSchema);