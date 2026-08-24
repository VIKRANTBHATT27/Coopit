import { z } from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

const staffSchema = z.object({
     userId: mongooseObjectIdValidator("userId"),

     employeeId: z.string()
          .regex(/^(NUR|REC|LAB|DOC|ADM)-\d{4}-\d{4}$/, {
               message: "Invalid employee ID format",
          }),

     department: z.enum([
          "ANESTHESIOLOGY",
          "CARDIOLOGY",
          "DERMATOLOGY",
          "EMERGENCY_MEDICINE",
          "ENDOCRINOLOGY",
          "GASTROENTEROLOGY",
          "GENERAL_MEDICINE",
          "GENERAL_SURGERY",
          "GYNECOLOGY_OBSTETRICS",
          "NEUROLOGY",
          "ONCOLOGY",
          "ORTHOPEDICS",
          "PEDIATRICS",
          "PSYCHIATRY",
          "PULMONOLOGY",
          "RADIOLOGY",
          "UROLOGY",
          "FRONT_DESK",
          "MANAGEMENT"
     ]),

     role: z.enum([
          "NURSE",
          "DOCTOR",
          "RECEPTIONIST",
          "LAB_TECHNICIAN",
     ]),

     shift: z.enum(["Morning", "Night"]),

     designation: z.string().optional()
});

export const registrationSchema = z.object({
     body: staffSchema
});

export const getAllSchema = z.object({
     query: z.object({
          page: z.coerce.number().int().positive().default(1),
          limit: z.coerce.number().int().positive().default(12),
          role: z.enum([
               "NURSE",
               "DOCTOR",
               "RECEPTIONIST",
               "LAB_TECHNICIAN",
          ]).optional(),
     })
});

export const roleChangeSchema = z.object({
     body: staffSchema.pick({ role: true }),

     params: mongooseObjectIdValidator("staffId")
});

export const detailChangeSchema = z.object({
     body: staffSchema.omit({ userId: true, role: true }),

     params: mongooseObjectIdValidator("staffId")
});

export const idSchema = z.object({
     params: mongooseObjectIdValidator("staffId")
});

export const toggleStaffStatusSchema = z.object({
     body: z.object({
          status: z.enum(["ACTIVE", "INACTIVE"])
     }),

     params: mongooseObjectIdValidator("staffId")
});

export const checkEmployeeId = z.object({
     params: staffSchema.pick({ employeeId: true })
});