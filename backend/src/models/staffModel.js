import { model, Schema } from "mongoose";

const staffSchema = new Schema({
     userId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "User",
     },

     hospitalId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Hospital",
     },

     employeeId: {
          type: String,
          required: true,
     },

     department: {
          type: String,
          required: true,
          enum: [
               "Anesthesiology",
               "Cardiology",
               "Dermatology",
               "Emergency Medicine",
               "Endocrinology",
               "Gastroenterology",
               "General Medicine",
               "General Surgery",
               "Gynecology & Obstetrics",
               "Neurology",
               "Oncology",
               "Orthopedics",
               "Pediatrics",
               "Psychiatry",
               "Pulmonology",
               "Radiology",
               "Urology"
          ]
     },

     role: {
          type: String,
          enum: ["Doctor", "Nurse", "LabTechnician", "Receptionist"],
          required: true
     },

     status: {
          type: String,
          default: "ACTIVE",
          enum: ["ACTIVE", "INACTIVE"],
     },

     shift: {
          type: String,
          enum: ["Morning", "Evening", "Night"]
     },

     designation: {
          type: String,
          required: false,
     }
}, { timestamps: true });

staffSchema.index({ hospitalId: 1, employeeId: 1 }, { unique: true });
staffSchema.index({ hospitalId: 1 });
staffSchema.index({ role: 1 });

export default model('Staff', staffSchema);