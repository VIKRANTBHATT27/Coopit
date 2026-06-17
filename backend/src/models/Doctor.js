import { model, Schema } from "mongoose";

const doctorSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        ref: "Staff",
        unqiue: true,
        required: true
    },

    pfp_url: {
        type: String,
        required: true,
        default: "/default-pfp/default-doctor.png"
    },

    pfp_publicId: {
        type: String,
        required: false,
    },

    specialization: {
        type: [{
            type: String,
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
        }],
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

const Doctor = model('Doctor', doctorSchema);
export default Doctor;