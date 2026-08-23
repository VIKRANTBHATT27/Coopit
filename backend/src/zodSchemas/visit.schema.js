import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

export const patientVisitSchema = z.object({
     params: z.object({
          patientId: mongooseObjectIdValidator('Patient')
     }),

     body: z.object({
          createdBy: mongooseObjectIdValidator('Receptionist'),
          hospitalId: mongooseObjectIdValidator('Hospital'),
          assignedNurseId: mongooseObjectIdValidator('Nurse'),
          reason: z.string().optional(),
          status: z.enum([
               "WAITING",
               "CONSULTING",
               "CHECKUP_DONE",
               "CLOSED"
          ]).default("WAITING"),
     })
});