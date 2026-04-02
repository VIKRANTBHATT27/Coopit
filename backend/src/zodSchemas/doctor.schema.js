import * as z from "zod";

export const doctorSchema = z.object({
     userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/default-pfp/default-nurse.png"),

     specialization: z.array(z.string()),
     experienceYears: z.number().min(0).max(50),
     doctorDescription: z.string(),
     licenseNumber: z.string(),

     availability: z.object({
          morningTime: z.object({ startTime: z.string(), endTime: z.string() }),
          eveningTime: z.object({ startTime: z.string(), endTime: z.string() }),
          closedOn: z.string(),
     }),
});

export const doctorUpdateSchema = doctorSchema.partial();