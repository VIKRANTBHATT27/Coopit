import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Schema.ObjectId.isValid(val), {
        message: `invalid mongoose objectId for the field ${fieldName}`
    })

export const labReportIdSchema = mongooseObjectIdValidator("labReport");

export const labReportUploadSchema = z.object({
    file: z.object({
        originalname: z.string()
            .min(1, "Original filename is required"),
        mimetype: z.string()
            .refine((mime) => DICOM_FILE_TYPES.includes(mime), {
                message: "Invalid file type. Only valid medical DICOM (.dcm) files are permitted.",
            }),
        path: z.string()
            .min(1, "Temporary storage file path is missing"),
    }, {
        error: "Medical imaging file upload is mandatory"
    }),

    params: z.object({
        checkUpId: mongooseObjectIdValidator('Checkup')
    }),

    body: z.object({
        patientId: mongooseObjectIdValidator('patient'),
        medicalCaseId: mongooseObjectIdValidator('medicalCase'),
        testName: z.string(),
        result: z.string(),
        normalRange: z.string().optional(),
    })
});
