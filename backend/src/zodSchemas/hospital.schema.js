import * as z from "zod";

export const phoneNumberSchema = z.array(z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")).nonempty().refine(
          phones => new Set(phones).size === phones.length,
          { message: "Phone numbers must be unique" }
     )

export const hospitalSchema = z.object({
     name: z.string().min(1).max(100),
     city: z.string(),
     landmark: z.string().optional(),

     address: z.object({
          street: z.string(),
          locality: z.string(),
          city: z.string(),
          state: z.string(),
          pincode: z.string().regex(/^[1-9][0-9]{5}$/, "invalid pincode"),
     }),

     hospitalType: z.enum(["Government", "Private", "Clinic", "Speciality"]),

     phones: phoneNumberSchema,

     departments: z.array(
          z.enum([
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
               "Urology"
          ])
     ).nonempty(),

     createdBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     location: z.object({
          type: z.literal("Point").default("Point"),
          coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]").optional()
     })
});

export const hospitalUpdateSchema = hospitalSchema.partial();