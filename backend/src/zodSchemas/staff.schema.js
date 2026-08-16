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
          "Front Desk"
     ]),

     role: z.enum([
          "Doctor",
          "Nurse",
          "LabTechnician",
          "Receptionist"
     ]),

     shift: z.enum(["Morning", "Night"]),

     designation: z.string().optional()
});

export const staffRegistrationSchema = z.object({
     body: staffSchema
});

export const staffLookUpSchema = z.object({
     body: staffSchema.pick({ role: true })
});

export const staffRoleChangeSchema = z.object({
     body: staffSchema.pick({ role: true }),

     params: mongooseObjectIdValidator("staffId")
});

export const staffDetailChangeSchema = z.object({
     body: staffSchema.omit({ userId: true, role: true }),

     params: mongooseObjectIdValidator("staffId")
});

export const employeeIdSchema = z.object({
     body: staffSchema.pick({ employeeId: true })
});

export const staffIdSchema = z.object({
     params: mongooseObjectIdValidator("staffId")
});