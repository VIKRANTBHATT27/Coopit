import *  as z from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });


export const staffSchema = z.object({
     userId: mongooseObjectIdValidator("userId"),

     hospitalId: mongooseObjectIdValidator("hospitalId"),

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

     role: z.enum(["Doctor", "Nurse", "LabTechnician", "Receptionist"]),

     status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),

     shift: z.enum(["Morning", "Evening", "Night"]),

     designation: z.string().optional()
});

export const checkEmployeeId = staffSchema.pick({ employeeId: true });

export const staffIdSchema = mongooseObjectIdValidator('staffId');