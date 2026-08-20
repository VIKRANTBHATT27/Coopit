import mongoose from "mongoose";
import { z } from "zod";

export const phoneNumberSchema = z.array(z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")).nonempty().refine(
     phones => new Set(phones).size === phones.length,
     { message: "Phone numbers must be unique" }
);

const mongooseObjectIdValidator = (fieldName, message) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: message || `Invalid ObjectId for field ${fieldName}`
     });

export const hospitalRegistrationSchema = z.object({
     body: z.object({
          hospital: z.object({
               hospitalName: z.string().min(3).max(100),

               hospitalAddress: z.object({
                    street: z.string(),
                    locality: z.string(),
                    city: z.string(),
                    state: z.string(),
                    pincode: z.string().regex(/^[1-9][0-9]{5}$/, "invalid pincode"),
               }),

               hospitalType: z.enum([
                    "Government",
                    "Private",
                    "Clinic",
                    "Speciality"
               ]),

               hospitalPhones: phoneNumberSchema,

               hospitalDepts: z.array(
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

               licenseNumber: z.string(),

               location: z.object({
                    type: z.literal("Point").default("Point"),
                    coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]").optional()
               })
          }),

          admin: z.object({
               adminName: z.string().min(1).max(60),
               adminEmailId: z.string().email({ message: "Invalid email address" }),
               adminPhone: z.string()
                    .regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits"),
               adminPassword: z.string()
                    .min(8, "Password must be at least 8 characters long")
                    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
               adminGender: z.enum(['Male', 'Female', 'Others']),
               adminDOB: z.date()
                    .max(new Date(),
                         { message: "Birth date cannot be in the future" }
                    ),
               adminState: z.string(),
               adminDistrict: z.string(),
               adminEmployeeId: z.string()
                    .regex(/^(NUR|REC|LAB|DOC|ADM)-\d{4}-\d{4}$/,
                         { message: "Invalid employee ID format" }
                    ),
          })
     })
});

export const hospitalIdSchema = z.object({
     params: mongooseObjectIdValidator("hospitalId")
});

export const updateHospitalSchema = z.object({
     body: hospitalRegistrationSchema.shape.body.shape.hospital.partial(),

     params: mongooseObjectIdValidator("hospitalId")
});

export const toggleHospitalStatusSchema = z.object({
     body: z.object({
          status: z.enum(["ACTIVE", "INACTIVE"])
     }),

     params: mongooseObjectIdValidator("hospitalId")
});

// adminIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ObjectId format"))
//     .min(1, "At least one admin is required")


// are they will be here or admin.schema.js
export const createAdminSchema = z.object({
     body: hospitalRegistrationSchema.shape.body.shape.admin.partial(),

     params: mongooseObjectIdValidator("hospitalId")
});

export const promoteStaffSchema = z.object({
     params: z.object({
          hospitalId: mongooseObjectIdValidator("hospitalId"),
          adminId: mongooseObjectIdValidator("adminId", "Invalid staff Id")
     })
});

export const degradeStaffSchema = z.object({
     params: z.object({
          hospitalId: mongooseObjectIdValidator("hospitalId"),
          adminId: mongooseObjectIdValidator("adminId", "Invalid staff Id")
     }),
     
     body: z.object({
          role: z.enum([
               "Nurse",
               "Doctor",
               "Receptionist",
               "LabTechnician"
          ])
     })
});