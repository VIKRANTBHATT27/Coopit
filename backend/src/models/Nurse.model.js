import { model, Schema } from "mongoose";

const nurseSchema = new Schema({
    staffId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Staff"
    },

    pfp_url: {
        type: String,
        required: false,
        default: "/default-pfp/default-nurse.png"
    },

    pfp_publicId: {
        type: String,
        required: false,
    },

    wardAssigned: {
        type: String,
        trim: true,
        enum: [
            "ICU_INTENSIVE_CARE_UNIT",
            "NICU_PICU_NEONATAL_PEDIATRIC_ICU",
            "CCU_CORONARY_CARE_UNIT",
            "GENERAL_WARD",
            "MATERNITY_OBSTETRICS",
            "PEDIATRIC_WARD",
            "SURGICAL_WARD",
            "ONCOLOGY_WARD",
            "PSYCHIATRIC_UNIT",
            "EMERGENCY_OBSERVATION",
            "ISOLATION_UNIT"
        ],
    },

    assignedPatients: {
        type: [Schema.Types.ObjectId],
        ref: "Patient",
        default: [],
        validate: {
            validator(value) {
                return new Set(value.map(id => id.toString())).size === value.length;
            },
            message: "Duplicate Ids in assignedPatients"
        },
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
        },
        end: {
            type: String,
            required: true,
        }
    },

    experinceYears: {
        type: Number,
        default: 0
    },

    qualification: {
        type: [String],
        required: true
    },
});

nurseSchema.index({ staffId: 1 }, { unique: true });

const Nurse = model("Nurse", nurseSchema);
export default Nurse;
