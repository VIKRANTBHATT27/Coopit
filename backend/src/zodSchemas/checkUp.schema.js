import { z } from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid mongoose ObjectId for field ${fieldName}`
    });

export const checkupIdSchema = mongooseObjectIdValidator("Checkup");


export const createCheckupSchema = z.object({
    body: z.object({
        symptoms: z.array(z.string()).default([]),

        progressStatus: z.enum([
            "STABLE",
            "IMPROVING",
            "WORSENING",
            "FIRST_VISIT"
        ]),

        vitals: z.object({
            oxygenSaturation: z.number().optional(),
            respirationRate: z.number().optional(),
            temperature: z.number().optional(),
            pulse: z.number().optional(),

            bloodPressure: z.object({
                systolic: z.number.optional(),
                diastolic: z.number().optional()
            })
        }),

        vaccinationGiven: z.array(
            z.object({
                vaccineName: z.string({
                    required_error: "Vaccine name is required",
                }).min(2, "Vaccine name must be descriptive"),

                doseNumber: z.number({
                    required_error: "Dose number is required",
                }).int().positive("Dose number must be a positive integer"),

                administeredAt: z.string().date()
                    .transform((val) => new Date(val)),

            })
        ).default([]),

        treatments: z.array(
            z.object({
                tretmentType: z.enum([
                    "IV",
                    "TABLET",
                    "SURGERY",
                    "THERAPY",
                    "PROCEDURE",
                ]),

                name: z.string(),

                dosage: z.string().optional(),

                frequency: z.number({
                    required_error: "Frequency number is required",
                }).int().positive("Dose number must be a positive integer").optional(),

                duration: z.string().optional()
            })
        ),

        clinicalNotes: z.string(),

        labInstructions: z.array(
            z.object({
                testType: z.enum([
                    "MRI",
                    "X_RAY",
                    "CT_SCAN",
                    "URINE_TEST",
                    "BLOOD_SAMPLE",
                    "OTHERS",
                ]),

                customNotes: z.string().optional(),

                status: z.enum([
                    "REQUESTED",
                    "SAMPLE_COLLECTED",
                    "PROCESSING",
                    "COMPLETED",
                    "CANCELLED"
                ]).default("REQUESTED"),

                requestedAt: z.string().date()
                    .transform((val) => new Date(val))

            })
        ).default([]),

        nextFollowUp: z.string().date()
            .transform((val) => new Date(val)).optional(),
            
    }),

    params: mongooseObjectIdValidator("Medical Case")
});

export const updateCheckupSchema = z.object({
    body: createCheckupSchema.shape.body.shape.partial(),

    params: mongooseObjectIdValidator("Checkup")
});