import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Schema.ObjectId.isValid(val), {
        message: `invalid mongoose objectId for the field ${fieldName}`
    })

export const labReportUploadSchema = z.object({
    patientId: mongooseObjectIdValidator('patient'),
    medicalCaseId: mongooseObjectIdValidator('medicalCase'),
    testName: z.string(),
    result: z.string(),
    normalRange: z.string().optional(),
});

export const labReportIdSchema = mongooseObjectIdValidator("labReport");