import { model, Schema } from "mongoose";

const nurseSchema = new Schema({
     staffId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Staff",
     },

     pfp_url: {
          type: String,
          required: false,
          default: "/default-pfp/default-nurse.png"
     },

     wardAssigned: {
          type: String,
          trim: true,
          enum: [
               "ICU (Intensive Care Unit)",
               "NICU/PICU (Neonatal/Pediatric ICU)",
               "CCU (Coronary Care Unit)",
               "General Ward",
               "Maternity & Obstetrics",
               "Pediatric Ward",
               "Surgical Ward",
               "Oncology Ward",
               "Psychiatric Unit",
               "Emergency/Observation",
               "Isolation Unit"
          ],
     },

     nurseDescription: {
          type: String,
          required: false,
     },

     shift: {
          type: String,
          enum: ["DAY", "NIGHT"],
     },

     workingHours: {
          start: {
               type: String,
               required: true,
          },
          end: {
               type: String,
               required: true,
          }
     },

     experinceYears: {
          type: Number,
          default: 0
     },
     qualification: {
          type: String,
          required: true
     },
});

export default model("Nurse", nurseSchema, "nurseModel");
