import { z } from "zod";
import mongoose from "mongoose";

const AVATAR_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ObjectId for field ${fieldName}`
    });

export const patientIdSchema = z.object({
    params: mongooseObjectIdValidator("Patient")
});

export const createPatientSchema = z.object({
    body: z.object({
        weight: z.number().min(1).max(500).optional(),
        height: z.number().min(30).max(300).optional(),
        bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', "UNKNOWN"]),

        lifestyle: z.object({
            smoking: z.boolean().default(false),
            alcohol: z.boolean().default(false),
            tobacco: z.boolean().default(false),
            occupation: z.string().optional(),
        }),

        allergies: z.array(z.string()).default([]),
        chronicConditions: z.array(z.string()).default([]),
    }),

    params: z.object({
        userId: mongooseObjectIdValidator("User")
    })
});

export const updatePatientSchema = z.object({
    body: z.object(createPatientSchema.shape.body.shape).partial(),

    params: patientIdSchema
});

export const avatarUploadSchema = z.object({
    file: z.object({
        originalName: z.string()
            .min(1, "Original filename is required"),
        mimeType: z.string()
            .refine(mime => AVATAR_FILE_TYPES.includes(mime), {
                message: "invalid image file type"
            }),
        path: z.string()
            .min(1, "Temporary storage file path is missing"),
    }, {
        message: "file is required for avatar uplaod"
    })
});
