import mongoose, { model, Schema } from "mongoose";

const nurseSchema = new Schema({
     staffId: {
          type: Schema.Types.ObjectId,
          required: true,
          ref: "Staff",
          unique: true
     },

     pfp_url: {
          type: String,
          required: false,
          default: "/default-pfp/default-nurse.png"
     },
     
     pfp_publicId: {
          type: String,
          required: false,
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

     assignedPatients: {
          type: [{
               type: mongoose.Types.ObjectId,
               ref: "Patient",
               required: true,
               unique: true
          }],
          default: []
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

const Nurse = model("Nurse", nurseSchema);
export default Nurse;
