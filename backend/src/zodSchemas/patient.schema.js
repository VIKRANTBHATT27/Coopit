import { z } from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });


export const userIdSchema = z.object({
     userId: mongooseObjectIdValidator("userId")
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

     params: userIdSchema
});

export const patientUpdationSchema = patientSchema.omit({
     userId: true,
     pfp_url: true,
     pfp_publicId: true,
}).partial();
