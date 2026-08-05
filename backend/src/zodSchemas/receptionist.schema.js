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

export const receptionistSignupSchema = z.object({
     body: z.object({
          hospitalId: mongooseObjectIdValidator("hospitalId"),
          staffId: mongooseObjectIdValidator("staffId"),

          pfp_url: z.string().default("/default-pfp/default-receptionist.png"),
          department: z.enum(["Front Desk", "Billing Desk", "Emergency Desk"]),
          shift: z.enum(["Morning", "Evening", "Night"]),

          workingHours: z.object({ start: z.string(), end: z.string() }),

          skills: z.array(z.string()),
     })
});

export const receptionistUpdateSchema = z.object({
     body: receptionistSignupSchema.shape.body.omit({ hospitalId: true }).partial(),
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
     }),

     params: z.object({
          staffId: mongooseObjectIdValidator('staffId')
     })
});