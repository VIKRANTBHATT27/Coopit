import * as z from "zod";
import mongooose from "mongoose";

const zObjectId = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

export const doctorSchema = z.object({
     userId: zObjectId("userId"),
     staffId: zObjectId("staffId"),
     pfp_url: z.string().default("/default-pfp/default-nurse.png"),

     specialization: z.array(z.string()),
     experienceYears: z.number().min(0).max(50),
     doctorDescription: z.string(),
     licenseNumber: z.string(),

     availability: z.object({
          morningTime: z.object({ startTime: z.string(), endTime: z.string() }),
          eveningTime: z.object({ startTime: z.string(), endTime: z.string() }),
          closedOn: z.string(),
     })
});

export const doctorUpdateSchema = doctorSchema.partial();

export const emailIdSchema = z.object({
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
});

export const doctorIdSchema = z.object({
     doctorId: zObjectId("doctorId")
});

export const diseaseIdSchema = z.object({
     diseaseId: zObjectId("diseaseId")
});

export const staffIdSchema = z.object({
     staffId: zObjectId("staffId")
});