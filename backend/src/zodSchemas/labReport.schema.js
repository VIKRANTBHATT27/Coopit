import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Schema.ObjectId.isValid(val), {
        message: `invalid mongoose objectId for the field ${fieldName}`
    })

export const labReportIdSchema = z.object({
    params: z.object({
        labReportId: mongooseObjectIdValidator("Lab Report")
    })
});

export const labReportUploadSchema = z.object({
    file: z.object({
        originalname: z.string()
            .min(1, "Original filename is required")
            .refine((name) => name.toLowerCase().endsWith(".pdf"), {
                message: "Only PDF files are allowed",
            }),
        mimetype: z.string()
            .refine((mime) => mime === "application/pdf", {
                message: "Invalid file type. Only PDF documents are permitted.",
            }),
        path: z.string()
            .min(1, "Temporary storage file path is missing"),
    }, {
        error: "PDF lab report upload is mandatory"
    }),

    params: z.object({
        checkupId: mongooseObjectIdValidator('Checkup')
    }),

    body: z.object({
        patientId: mongooseObjectIdValidator('patient'),
        testName: z.string(),
        result: z.string(),
        normalRange: z.string().optional(),
    })
});
