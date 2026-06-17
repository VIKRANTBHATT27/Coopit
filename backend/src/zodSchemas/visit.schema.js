import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectId = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

export const visitSchema = z.object({
     patientId: mongooseObjectId("patientId"),
     hospitalId: mongooseObjectId("hospitalId"),
     assignedNurse: mongooseObjectId("nurseId"),
     medicalCaseId: mongooseObjectId("medicalCaseId").optional(),
     reason: z.string(),
     status: z.enum(["WAITING", "IN_CONSULTATION" , "CHECKUP_DONE", "CLOSED" ]).default("WAITING"),
     visitDate: z.date(),
});