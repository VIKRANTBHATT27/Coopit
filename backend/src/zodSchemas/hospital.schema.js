import mongoose from "mongoose";
import { z } from "zod";

export const phoneNumberSchema = z.array(z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number")).nonempty().refine(
    phones => new Set(phones).size === phones.length,
    { message: "Phone numbers must be unique" }
);

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ObjectId for field ${fieldName}`
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
                "GOVERNMENT",
                "PRIVATE",
                "CLINIC",
                "SPECIALITY"
            ]),

            hospitalPhones: phoneNumberSchema,

            hospitalDepts: z.array(
                z.enum([
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
                    "UROLOGY"
                ])
            ).nonempty(),

            licenseNumber: z.string(),

            location: z.object({
                type: z.literal("Point").default("Point"),
                coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]").optional()
            })
        }),

        admin: z.object({
            adminEmailId: z.string().email({ message: "Invalid email address" }),

            adminEmployeeId: z.string()
                .regex(/^(NUR|REC|LAB|DOC|ADM)-\d{4}-\d{4}$/, {
                    message: "Invalid employee ID format",
                }),
        })
    })
});

export const hospitalIdSchema = z.object({
    params: mongooseObjectIdValidator("Hospital")
});

export const updateHospitalSchema = z.object({
    body: z.object(hospitalRegistrationSchema.shape.body.shape.hospital).partial(),

    params: mongooseObjectIdValidator("Hospital")
});

export const toggleHospitalStatusSchema = z.object({
    body: z.object({
        status: z.enum(["ACTIVE", "INACTIVE"])
    }),

    params: mongooseObjectIdValidator("Hospital")
});

export const promoteStaffSchema = z.object({
    params: z.object({
        hospitalId: mongooseObjectIdValidator("Hospital"),
        adminId: mongooseObjectIdValidator("adminId", "Invalid staff Id")
    })
});

export const degradeStaffSchema = z.object({
    params: z.object({
        hospitalId: mongooseObjectIdValidator("Hospital"),
        adminId: mongooseObjectIdValidator("adminId", "Invalid staff Id")
    }),

    body: z.object({
        role: z.enum([
            "NURSE",
            "DOCTOR",
            "RECEPTIONIST",
            "LAB_TECHNICIAN"
        ])
    })
});