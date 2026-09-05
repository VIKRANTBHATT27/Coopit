import { model, Schema } from "mongoose";

const receptionistSchema = new Schema({
    hospitalId: {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
        required: true
    },

    staffId: {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true
    },

    pfp_url: {
        type: String,
        required: false,
        default: "/default-pfp/default-receptionist.png"
    },

    pfp_publicId: {
        type: String,
        required: false
    },

    department: {
        type: String,
        enum: [
            "Front Desk",
            "Billing Desk",
            "Emergency Desk"
        ],
        default: "Front Desk"
    },

    shift: {
        type: String,
        enum: ["Morning", "Evening", "Night"],
        required: true
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

    qualifications: {
        type: [String],
        required: false
    }

}, { timestamps: true });

receptionistSchema.index({ hospitalId: 1 });
receptionistSchema.index({ staffId: 1 });

export const Receptionist = model("Receptionist", receptionistSchema);
export default Receptionist;