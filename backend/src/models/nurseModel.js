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
          default: "/pfp/default-nurse.png"
     },

     wardAssigned: {
          type: String,
          trim: true,
          enum: [
               // Critical Care
               "ICU (Intensive Care Unit)",
               "NICU (Neonatal ICU)",
               "PICU (Pediatric ICU)",
               "CCU (Coronary Care Unit)",
               "HDU (High Dependency Unit)",

               // General & Specialty Wards
               "General Ward - Male",
               "General Ward - Female",
               "Pediatric Ward",
               "Maternity/Obstetrics Ward",
               "Post-Surgical Ward",
               "Orthopedic Ward",
               "Oncology Ward",
               "Psychiatric Ward",

               // Short Stay & Observation
               "Emergency/ER Observation",
               "Day Surgery Unit",
               "Isolation Ward",
               "Private/VIP Suite"
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
               validate: {
                    validator: v => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
                    message: props => `${props.value} is not a valid time (HH:MM)!`
               }
          },
          end: {
               type: String,
               required: true,
               validate: {
                    validator: v => /^([01]\d|2[0-3]):([0-5]\d)$/.test(v),
                    message: props => `${props.value} is not a valid time (HH:MM)!`
               }
          }
     },

     experinceYears: {
          type: Number,
          default: 0
     },
     qualification: {
          type: String
     },
});

export default model("Nurse", nurseSchema, "nurseModel");
