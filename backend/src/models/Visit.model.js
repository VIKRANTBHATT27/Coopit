import { model, Schema } from "mongoose";

const visitSchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true
    },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "Receptionist",
        required: true
    },

    hospitalId: {
        type: Schema.Types.ObjectId,
        ref: "Hospital",
        required: true
    },

    assignedNurseId: {
        type: Schema.Types.ObjectId,
        ref: "Nurse",
        required: true
    },

    reason: {
        type: String,
        required: true
    },

    status: {
        type: String,
        enum: [
            "WAITING",
            "CHECKUP_DONE"
        ],
        default: "WAITING"
    },

    visitDate: {
        type: Date,
        default: Date.now
    },
});

visitSchema.index({ hospitalId: 1, visitDate: -1 });
visitSchema.index({ assignedDoctor: 1 });
visitSchema.index({ patientId: 1 });

const Visit = model("Visit", visitSchema);
export default Visit;
