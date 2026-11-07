import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        error: `Invalid ObjectId for the field ${fieldName}`
    });

const ZIP_FILE_TYPES = [
    "application/zip",
    "application/x-zip-compressed",
    "application/octet-stream"
];

export const dicomUploadSchema = z.object({
    file: z.object({
        originalname: z.string()
            .min(1, "Original filename is required"),
        mimetype: z.string()
            .refine((mime) => mime === "application/dicom", {
                message: "Invalid file type. Only valid medical DICOM (.dcm) files are permitted.",
            }),
        path: z.string()
            .min(1, "Temporary storage file path is missing"),
    }, {
        error: "Medical imaging file upload is mandatory"
    }),

    params: z.object({
        checkupId: mongooseObjectIdValidator('Checkup')
    })
});

export const dicomZIPSchema = z.object({
    file: z.object({
        originalname: z.string()
            .min(1, "Original filename is required"),
        mimetype: z.string()
            .refine((mime) => ZIP_FILE_TYPES.includes(mime), {
                message: "Invalid zip file type",
            }),
        path: z.string()
            .min(1, "Temporary storage file path is missing"),
    }, {
        message: "Medical imaging zip-file upload is mandatory"
    }),

    params: z.object({
        checkupId: mongooseObjectIdValidator('Checkup')
    })
});

export const dicomStudyIdSchema = z.object({
    params: z.object({
        dicomStudyId: mongooseObjectIdValidator("Dicom Study")
    })
});