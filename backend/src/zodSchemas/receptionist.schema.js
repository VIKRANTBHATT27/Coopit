import { z } from "zod";
import mongoose from "mongoose";

const mongooseObjectId = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

export const receptionistSignupSchema = z.object({
     hospitalId: mongooseObjectId("hospitalId"),
     staffId: mongooseObjectId("staffId"),

     pfp_url: z.string().default("/default-pfp/default-receptionist.png"),
     department: z.enum(["Front Desk", "Billing Desk", "Emergency Desk"]),
     shift: z.enum(["Morning", "Evening", "Night"]),

     workingHours: z.object({ start: z.string(), end: z.string() }),

     skills: z.array(z.string()),
});

export const receptionistUpdateSchema = receptionistSignupSchema.partial().omit({ hospitalId: true, staffId: true });