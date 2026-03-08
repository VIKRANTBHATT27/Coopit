import { generateToken } from "../service/auth.js";
import { Schema, model } from "mongoose";
import { configDotenv } from 'dotenv';
import bcrypt from "bcrypt";

const { randomBytes, createCipheriv } = await import("node:crypto");

configDotenv();

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
    phoneNumber: {
        type: String,
        required: true,
        validate: {
            validator: function (v) {
                return /^\+?[0-9]{10,15}$/.test(v);
            },
            message: props => `${props.value} is not a valid 10-digit phone number!`
        }
    },
    phoneIV: {
        type: String,
        required: false,
    },
    phoneAuthTag: {
        type: String,
        required: false
    },

    gender: {
        type: String,
        enum: ['Male', 'Female', 'Others'],
        required: true
    },
    pfp_url: {
        type: String,
        required: false,
        default: "/public/pfp/default-avatar-doctor.png"
    },
    pfp_publicId: {
        type: String,
        required: false,
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
    clinicLocation: {
        type: String,
        required: true
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

// save the phoneNo
doctorSchema.pre('save', function () {
    const doctor = this;

    if (!doctor.isModified("phoneNumber")) return next();

    const algo = "aes-256-gcm"
    const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
    const IV = randomBytes(16);

    const cipher = createCipheriv(algo, key, IV);

    let encryptedPhoneNo = cipher.update(doctor.phoneNumber, 'utf-8', 'hex');
    encryptedPhoneNo += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    this.phoneIV = IV.toString("hex");
    this.phoneNumber = encryptedPhoneNo;
    this.phoneAuthTag = authTag.toString("hex");
});

doctorSchema.static("matchPassword_and_GenerateToken", async (emailId, password) => {
    const doctor = await doctorModel.findOne({ emailId });

    console.log(doctor);

    if (!doctor) return res.status(400).json({ err: "NO DOCTOR FOUND WITH THIS EMAIL" })

    const isPassMatched = await bcrypt.compare(password, doctor.password);
    if (!isPassMatched) throw new Error("Password not matched");

    const token = generateToken(doctor, "doctor");
    // console.log(token);
    return token;
});


const doctorModel = model("Doctor", doctorSchema);
export default doctorModel;