import * as z from "zod";
import mongoose from "mongoose";

const mongooseObjectId = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

export const patientSchema = z.object({
     userId: mongooseObjectId("userId"),
     pfp_url: z.string().default("/default-pfp/default-patient.png"),
     weight: z.number().min(1).max(500).optional(),
     height: z.number().min(30).max(300).optional(),
     bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),


     lifestyle: z.object({
          smoking: z.boolean().default(false),
          alcohol: z.boolean().default(false),
          tobacco: z.boolean().default(false),
          occupation: z.string().optional(),
     }),

     allergies: z.array(z.string()).default([]),
     chronicConditions: z.array(z.string()).default([]),

     // location: z.object({
     //      type: z.literal('Point').default('Point'),
     //      coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]").optional(),
     // }).optional(),
});

export const userIdSchema = patientSchema.pick({ userId: true });

export const downloadDicomSchema = z.object({
     checkUpId: mongooseObjectId("checkUpId"),
     studyInstanceId: z.string().min(1, "studyInstanceId is required")
})