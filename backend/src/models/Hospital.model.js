import { model, Schema } from "mongoose";

const hospitalSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },

    address: {
        street: { type: String, required: true },
        locality: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: {
            type: String,
            required: true,
        },
    },

    hospitalType: {
        type: String,
        enum: [
            "GOVERNMENT",
            "PRIVATE",
            "CLINIC",
            "SPECIALITY"
        ]
    },

    phones: {
        type: [String],
        required: true,
        validator: {
            validator: function (phones) {
                const regexValid = phones.every(v => /^\+?[1-9]\d{9,14}$/.test(v));

                const uniqueValid = new Set(phones).size() === phones.length;

                return regexValid && uniqueValid;
            },
            message: props => `${props.value} contains invalid or duplicate number`
        }
    },

    departments: {
        type: [String],
        required: true,
        enum: [
            "ANESTHESIOLOGY",
            "CARDIOLOGY",
            "DERMATOLOGY",
            "EMERGENCY_MEDICINE",
            "ENDOCRINOLOGY",
            "GASTROENTEROLOGY",
            "GENERAL_MEDICINE",
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
    },

    licenseNumber: {
        type: String,
        required: true,
        unique: true
    },

    adminIds: [{
        type: Schema.Types.ObjectId,
        ref: "Staff",
        required: true
    }],

    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: v => v.length === 2,
                message: "Coordinates must be [longitude, latitude]"
            }
        }
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    isActive: {
        type: Boolean,
        default: true
    },
});

hospitalSchema.index({ city: 1 });
hospitalSchema.index({ location: '2dsphere' });

const Hospital = model('Hospital', hospitalSchema);
export default Hospital;