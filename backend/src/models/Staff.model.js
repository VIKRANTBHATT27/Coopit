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
               "ANESTHESIOLOGY",
               "CARDIOLOGY",
               "DERMATOLOGY",
               "EMERGENCY_MEDICINE",
               "ENDOCRINOLOGY",
               "GASTROENTEROLOGY",
               "GENERAL_MEDICINE",
               "GENERAL_SURGERY",
               "GYNECOLOGY_OBSTETRICS",
               "NEUROLOGY",
               "ONCOLOGY",
               "ORTHOPEDICS",
               "PEDIATRICS",
               "PSYCHIATRY",
               "PULMONOLOGY",
               "RADIOLOGY",
               "UROLOGY",
               "FRONT_DESK",
               "MANAGEMENT"
          ]
     },

     role: {
          type: String,
          enum: [
               "NURSE",
               "DOCTOR",
               "RECEPTIONIST",
               "LAB_TECHNICIAN",
               "HOSPITAL_ADMIN",
          ],
          required: true
     },

     status: {
          type: String,
          default: "ACTIVE",
          enum: ["ACTIVE", "INACTIVE"],
     },

     shift: {
          type: String,
          enum: ["Morning", "Night"],
          required: false
     },

     designation: {
          type: String,
          required: false,
     }
     
}, { timestamps: true });

staffSchema.index({ hospitalId: 1, employeeId: 1 }, { unique: true });
staffSchema.index({ hospitalId: 1, status: 1 });
staffSchema.index({ hospitalId: 1, role: 1 });

const Staff = model('Staff', staffSchema);
export default Staff;