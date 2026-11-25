import { z } from "zod";
import mongoose from "mongoose";

const AVATAR_FILE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp"
];

const mongooseObjectIdValidator = (fieldName) => z.string().trim()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ObjectId for field ${fieldName}`
    });

const timeSchema = z.string().trim()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/,
        "Time must be in 24-hour format with leading zeros (HH:MM)"
    );

export const createReceptionistSchema = z.object({
    body: z.object({
        department: z.enum([
            "FRONT_DESK",
            "BILLING_DESK",
            "EMERGENCY_DESK"
        ]).default("FRONT_DESK"),

        shift: z.enum(["Morning", "Evening", "Night"]),

        workingHours: z.object({
            start: timeSchema,
            end: timeSchema
        }),

        qualifications: z.array(z.string().trim()).optional(),
    }),

    params: z.object({
        staffId: mongooseObjectIdValidator('Staff')
    })
});

export const updateReceptionistSchema = z.object({
    body: createReceptionistSchema.shape.body.partial(),

    params: z.object({
        receptionistId: mongooseObjectIdValidator('Receptionist')
    })
});


export const avatarUploadSchema = z.object({
    file: z.object({
        originalName: z.string().trim()
            .min(3, "Original filename is required"),
        mimeType: z.string().trim()
            .refine(mime => AVATAR_FILE_TYPES.includes(mime), {
                message: "invalid image file type"
            }),
        path: z.string().trim()
            .min(1, "Temporary storage file path is missing"),
    }, {
        message: "file is required for avatar uplaod"
    })
});