import { model, Schema } from "mongoose";

const labInstructionSchema = new Schema({
    testType: {
        type: String,
        enum: [
            "MRI",
            "X_RAY",
            "CT_SCAN",
            "URINE_TEST",
            "BLOOD_SAMPLE",
            "OTHERS",
        ],
        required: true
    },

    customNotes: {
        type: String,
        required: false
    },

    status: {
        type: String,
        enum: [
            "REQUESTED",
            "SAMPLE_COLLECTED",
            "PROCESSING",
            "COMPLETED",
            "CANCELLED"
        ],
        default: "REQUESTED"
    },

    requestedAt: {
        type: Date,
        required: true
    }
}, { _id: false });

const checkupSchema = new Schema({
    medicalCaseId: {
        type: Schema.Types.ObjectId,
        ref: "medicalCase",
        required: true,
    },

    patientId: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },

    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "Doctor",
        required: true,
    },

    symptoms: {
        type: [String],
        default: []
    },

    progressStatus: {
        type: String,
        enum: [
            "STABLE",
            "IMPROVING",
            "WORSENING",
            "FIRST_VISIT"
        ],
    },

    vitals: {
        oxygenSaturation: Number,
        respirationRate: Number,
        temperature: Number,     //*c or *fahrenheit
        pulse: Number,      //bpm => beats per minute

        bloodPressure: {
            systolic: Number,
            diastolic: Number
        }
    },

    vaccinationsGiven: {
        type: [
            {
                vaccineName: {
                    type: String,
                    required: true
                },

                doseNumber: {
                    type: Number,
                    required: true
                },

                administeredAt: {
                    type: Date,
                    default: Date.now
                }
            }
        ],
        default: [],
    },

    treatments: [
        {
            treatmentType: {
                type: String,
                enum: [
                    "IV",
                    "TABLET",
                    "SURGERY",
                    "THERAPY",
                    "PROCEDURE",    //dressing
                ]
            },

            name: {
                type: String,
                required: true
            },

            dosage: String,

            frequency: Number,

            duration: String
        }
    ],

    clinicalNotes: {
        type: String,
        required: true,
    },

    labInstructions: {
        type: [labInstructionSchema],
        default: [],
    },

    nextFollowUp: {
        type: Date,
        required: false
    },

    visitDate: {
        type: Date,
        required: true
    },

    timelineId: {
        type: Schema.Types.ObjectId,
        ref: "TimeLine",
        required: false,
    }
});

checkupSchema.index({ patientId: 1 });
checkupSchema.index({ checkUpId: 1 });
checkupSchema.index({ medicalCaseId: 1 });

const Checkup = model("Checkup", checkupSchema);
export default Checkup;


/*
example
{
     "clinicalNotes": "Patient presents with persistent cough and fatigue for 4 days. Lungs sound clear, but ordering routine chest diagnostics to rule out acute issues.",
          "labInstructions": [
               { "testType": "BLOOD_SAMPLE", "customNotes": "Check complete blood count (CBC) and metabolic panels." },
               { "testType": "X_RAY", "customNotes": "Standard PA chest view." }
          ]
}

*/