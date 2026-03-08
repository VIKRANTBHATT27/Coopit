import { generateToken } from "../service/auth.js";
import { Schema, model } from "mongoose";
import { configDotenv } from 'dotenv';
import bcrypt from "bcrypt";

const { randomBytes, createCipheriv } = await import("node:crypto");

configDotenv();

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
     phoneNumber: {
          type: String,
          required: true,
          validate: {
               validator: function (v) {
                    return /^\+?[0-9]{10,15}$/.test(v);
               },
               message: props => `${props.value} is not a valid 10-digit phone number!`
          }
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
     pfp_url: {
          type: String,
          required: false,
          default: "/pfp/default-patient.png"
     },
     pfp_publicId: {
          type: String,
          required: false,
     },

     dateOfBirth: {
          type: Date,
          required: false,
     },
     weight: {
          type: Number,
          min: 1,
          max: 500,
          required: false
     },
     height: {
          type: Number,
          min: 30,
          max: 300,
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

     allergies: {                  //past condition like hypertension / diabetes      
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

patientSchema.index({ location: '2dsphere' });

patientSchema.pre('save', function () {
     const patient = this;

     if (!patient.isModified("phoneNumber")) return next();

     const algo = "aes-256-gcm"
     const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
     const IV = randomBytes(16);

     const cipher = createCipheriv(algo, key, IV);
     
     let encryptedPhoneNo = cipher.update(patient.phoneNumber, 'utf-8', 'hex');
     encryptedPhoneNo += cipher.final('hex');
     
     const authTag = cipher.getAuthTag();

     this.phoneIV = IV.toString("hex");
     this.phoneNumber = encryptedPhoneNo;
     this.phoneAuthTag = authTag.toString("hex");

     next();
});

// use bycrpt
patientSchema.static("matchPassword_and_GenerateToken", async (emailId, password) => {
     const patient = await patientModel.findOne({ emailId });

     console.log(patient);
     
     if (!patient) return res.status(404).json({ err: "NO PATIENT FOUND WITH THIS EMAIL" });

     const isPassMatched = await bcrypt.compare(password, patient.password);
     if (!isPassMatched) throw new Error("Password not matched");

     const token = generateToken(patient, "patient");
     // console.log(token);
     return token;
});

const patientModel = model("Patient", patientSchema);

export default patientModel;