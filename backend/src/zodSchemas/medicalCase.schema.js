import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ${fieldName}'s mongoose-Id`
     });

export const medicalCaseSchema = z.object({
     patientId: mongooseObjectIdValidator("patientId"),
     createdBy: mongooseObjectIdValidator("nurseId"),
     diagnosedBy: mongooseObjectIdValidator("doctorId"),
     timelineEventId: mongooseObjectIdValidator("timelineEventId").nullable().optional().default(null),
     severity: z.enum(['Mild', 'Moderate', 'Severe']),
     category: z.enum(['Infectious', 'NonCommunicable', 'Genetic', 'Deficiency', 'Non-Infectious']).optional(),
     possibleCause: z.string().optional(),
});

export const medicalCaseUpdationSchema = medicalCaseSchema.omit({
     patientId: true,
     createdBy: true,
     diagnosedBy: true,
     timelineEventId: true
}).partial();