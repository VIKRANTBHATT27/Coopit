import { model, Schema } from "mongoose";

const doctorSchema = new Schema({

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    staffId: {
        type: Schema.Types.ObjectId,
        ref: "Staff"
    },

    pfp_url: {
        type: String,
        required: true,
        default: "/pfp/default-doctor.png"
    },

    specialization: {
        type: [String],
        default: ['General Checkup'],
        required: true,
        trim: true,
    },
    experienceYears: {
        type: Number,
        required: true,
    },

    doctorDescription: {
        type: String,
        required: true,
    },

    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },

    availability: {
        morningTime: {
            startTime: String,
            endTime: String
        },
        eveningTime: {
            startTime: String,
            endTime: String
        },
        closedOn: String,       //sundays or wednesday
    },

}, { timestamps: true });

export default model('Doctor', doctorSchema);