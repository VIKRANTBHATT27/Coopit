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
               start: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)"),
               end: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:MM)")
          }),

          qualifications: z.array(z.string()).optional(),
     })
});

export const updateReceptionistSchema = z.object({
     body: createReceptionistSchema.shape.body.partial()
});


export const receptionistUpdateSchema = z.object({
     body: receptionistSignupSchema.shape.body.omit({ hospitalId: true }).partial(),
     pfp_url: z.string().default("/default-pfp/default-receptionist.png")
});


export const receptionistAvatarUploadSchema = z.object({
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