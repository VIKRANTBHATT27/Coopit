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
                "ANESTHESIOLOGY",
                "CARDIOLOGY",
                "DERMATOLOGY",
                "EMERGENCY_MEDICINE",
                "ENDOCRINOLOGY",
                "GASTROENTEROLOGY",
                "GENERAL_CHECKUP",
                "GENERAL_SURGERY",
                "GYNECOLOGY_OBSTETRICS",
                "NEUROLOGY",
                "ONCOLOGY",
                "ORTHOPEDICS",
                "PEDIATRICS",
                "PSYCHIATRY",
                "PULMONOLOGY",
                "RADIOLOGY",
                "UROLOGY"
            ]
        }],
        default: ["GENERAL_CHECKUP"],
        required: true
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
        closedOn: {
            type: [{
                type: String,
                enum: [
                    "MONDAY",
                    "TUESDAY",
                    "WEDNESDAY",
                    "THRUSDAY",
                    "FRIDAY",
                    "SATURDAY",
                    "SUNDAY"
                ]
            }],
            default: []
        },
    },
}, { timestamps: true });

const Doctor = model('Doctor', doctorSchema);
export default Doctor;