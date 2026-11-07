import { model, Schema } from "mongoose";

const dicomSliceSchema = new Schema({
    fileName: {
        type: String,
        required: true
    },

    fileUrl: {
        type: String,
        required: true
    },

    seriesInstanceId: {
        type: String,
        required: true
    },

    sopInstanceUid: {             //or instanceUid
        type: String,
        required: true
    },
    bodyPart: {
        type: String,
        required: false
    },
});

const dicomStudySchema = new Schema({
    patientId: {
        type: Schema.Types.ObjectId,
        ref: "Patient",
        required: true,
    },

    checkupId: {
        type: Schema.Types.ObjectId,
        ref: "CheckUp",
        required: true,
    },

    medicalCaseId: {
        type: Schema.Types.ObjectId,
        ref: "medicalCase",
        required: true,
    },

    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "labTechnician",
        required: true
    },

    studyInstanceId: {      // unique ID for the study (GCP returns this)
        type: String,
        required: true
    },

    modality: {
        type: String,
        enum: ["MR", "CT", "DX", "CR", "Others"],
        required: true
    },

    slices: {
        type: [dicomSliceSchema],
        default: []
    },

    uploadedAt: {
        type: Date,
        default: Date.now
    },

    isDeactivated: {
        type: Boolean,
        default: false,
    }
});

dicomStudySchema.index({ medicalCaseId: 1 });
dicomStudySchema.index({ checkUpId: 1, isDeleted: 1 });
dicomStudySchema.index({ _id: 1, isDeleted: 1 });
dicomStudySchema.index({ patientId: 1, uploadedAt: -1 });

const DicomStudy = model("dicomStudy", dicomStudySchema);
export default DicomStudy;