import { model, Schema } from "mongoose";

const patientSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },

    pfp_url: {
        type: String,
        required: false,
        default: "/default-pfp/default-patient.png"
    },

    pfp_publicId: {
        type: String,
        default: undefined,
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
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "UNKNOWN"],
        default: "UNKNOWN",
        required: true,
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
    },
    chronicConditions: {
        type: [String],
        default: []
    }

}, { timestamps: true });

patientSchema.index({ userId: 1 });

const Patient = model("Patient", patientSchema);
export default Patient;