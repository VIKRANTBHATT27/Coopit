import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },   
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    profilePic_url: {
        type: String,
        required: false,
        default: "/pfp/default-avatar.png"
    },
    dateOfBirth: {
        type: Date,
        required: true,
    },
    districtName: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },

    clinicName: {
        type: String,
        required: true,
    },
    specialization: {
        type: [String],
        default: ['General Checkup'],
        required: true,
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
        required: true
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

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },

    isActive: { 
        type: Boolean, 
        default: true 
    },

}, { collection: 'doctorModel', timestamps: true });

doctorSchema.index({ location: '2dsphere' });

const doctorModel = model("Doctor", doctorSchema);
export default doctorModel;