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

export const createReceptionistSchema = z.object({
    body: z.object({
        department: z.enum([
            "Front Desk",
            "Billing Desk",
            "Emergency Desk"
        ]).default("Front Desk"),

        shift: z.enum(["Morning", "Evening", "Night"]),

        workingHours: z.object({
            start: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in 24-hour format with leading zeros (HH:MM)"),
            end: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in 24-hour format with leading zeros (HH:MM)")
        })
        ,

        qualifications: z.array(z.string()).optional(),
    }),

    params: z.object({
        staffId: mongooseObjectIdValidator('Staff')
    })
});

export const updateReceptionistSchema = z.object({
    body: z.object(createReceptionistSchema.shape.body).partial(),

    params: z.object({
        staffId: mongooseObjectIdValidator('Staff')
    })
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