import *  as z from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

export const staffSchema = z.object({
     userId: mongooseObjectIdValidator("userId"),

     employeeId: z.string()
          .regex(/^(NUR|REC|LAB|DOC|ADM)-\d{4}-\d{4}$/, {
               message: "Invalid employee ID format",
          }),

     department: z.enum([
          "Anesthesiology",
          "Cardiology",
          "Dermatology",
          "Emergency Medicine",
          "Endocrinology",
          "Gastroenterology",
          "General Medicine",
          "General Surgery",
          "Gynecology & Obstetrics",
          "Neurology",
          "Oncology",
          "Orthopedics",
          "Pediatrics",
          "Psychiatry",
          "Pulmonology",
          "Radiology",
          "Urology",
          "Front Desk",
          "Management"
     ]),

     role: z.enum([
          "Admin",
          "Nurse",
          "Doctor",
          "Receptionist",
          "LabTechnician"
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
               "Doctor",
               "Nurse",
               "LabTechnician",
               "Receptionist"
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