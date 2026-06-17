import mongoose from 'mongoose';
import { z } from 'zod';

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ${fieldName} ObjectId`
     });

export const staffIdSchema = mongooseObjectIdValidator("staffId");


export const nurseSchema = z.object({
     pfp_url: z.string().default('/default-pfp/default-nurse.png'),

     wardAssigned: z.enum([
          "ICU (Intensive Care Unit)",
          "NICU/PICU (Neonatal/Pediatric ICU)",
          "CCU (Coronary Care Unit)",
          "General Ward",
          "Maternity & Obstetrics",
          "Pediatric Ward",
          "Surgical Ward",
          "Oncology Ward",
          "Psychiatric Unit",
          "Emergency/Observation",
          "Isolation Unit"
     ]),

     assignedPatients: z.array(mongooseObjectIdValidator("patientId")).unique().default([]),

     nurseDescription: z.string(),

     shift: z.enum(["DAY", "NIGHT"]),

     workingHours: z.object({
          start: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!"),
          end: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "given time is not a valid time (HH:MM)!")
     }),

     experienceYears: z.number().default(0),

     qualification: z.string()
});
