import { model, Schema } from "mongoose";

const receptionistSchema = new Schema({
     userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true
     },

     hospitalId: {
          type: Schema.Types.ObjectId,
          ref: "Hospital",
          required: true
     },

     staffId: {
          type: Schema.Types.ObjectId,
          ref: "Staff",
          required: true,
     },

     pfp_url: {
          type: String,
          required: false,
          default: "/pfp/default-receptionist.png"
     },

     department: {
          type: String,
          enum: ["Front Desk", "Billing Desk", "Emergency Desk"],
          default: "Front Desk"
     },

     shift: {
          type: String,
          enum: ["Morning", "Evening", "Night"]
     },
     workingHours: {
          start: String,
          end: String
     },
     skills: {
          type: [String],
          required: false
     },

}, { timestamps: true });

export default model("Receptionist", receptionistSchema);