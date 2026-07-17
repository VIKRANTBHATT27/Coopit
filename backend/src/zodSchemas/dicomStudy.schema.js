import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ${fieldName}'s mongoose ObjectId`
    });

const createDicomSliceSchema = z.object({
    fileName: z.string().min(1, "file name not present"),
    fileUrl: z.string().url("Invalid file URL"),
    seriesInstanceId: z.string().min(1, "series instance ID not present"),
    sopInstanceUid: z.string().min(1, "SOP instance UID not present"),
    bodyPart: z.string().optional()
});

export const createDicomStudySchema = z.object({
    patientId: mongooseObjectIdValidator('patient'),
    checkupId: mongooseObjectIdValidator('checkup'),
    MedicalCase: mongooseObjectIdValidator('medicalCaseId'),
    uploadedBy: mongooseObjectIdValidator('lab Technician'),
    studyInstanceId: z.string(),
    modality: z.enum(["MR", "CT", "DX", "CR", "Others"]).nonoptional(),
    slices: createDicomSliceSchema
});