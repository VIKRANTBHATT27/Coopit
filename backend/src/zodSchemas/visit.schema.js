import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

// export const visitSchema = z.object({
//      patientId: mongooseObjectId("patientId"),
//      hospitalId: mongooseObjectId("hospitalId"),
//      assignedNurse: mongooseObjectId("nurseId"),
//      medicalCaseId: mongooseObjectId("medicalCaseId").optional(),
//      reason: z.string(),
//      status: z.enum(["WAITING", "IN_CONSULTATION" , "CHECKUP_DONE", "CLOSED" ]).default("WAITING"),
//      visitDate: z.date(),
// });

export const patientVisitSchema = z.object({
     params: z.object({
          patientId: mongooseObjectIdValidator('Patient')
     }),

     body: z.object({
          createdBy: mongooseObjectIdValidator('Receptionist'),
          assignedNurse: mongooseObjectIdValidator('Nurse'),
          hospitalId: mongooseObjectIdValidator('Hospital'),
          reason: z.string().optional(),
          status: z.enum([
               "WAITING",
               "CONSULTING",
               "CHECKUP_DONE",
               "CLOSED"
          ]).default("WAITING"),
     })
});