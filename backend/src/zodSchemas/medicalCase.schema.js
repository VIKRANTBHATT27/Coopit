import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid Object Id for ${fieldName}`
    });

export const getMedicalCaseSchema = z.object({
    params: z.object({
        patientId: mongooseObjectIdValidator("Patient")
    })
})

export const createMedicalCaseSchema = z.object({
    body: z.object({
        doctorId: mongooseObjectIdValidator("Doctor").optional(),

        severity: z.enum(['MILD', 'MODERATE', 'SEVERE']),

        category: z.enum([
            'GENETIC',
            'DEFICIENCY',
            'INFECTIOUS',
            'NON_INFECTIOUS',
            'NON_COMMUNICABLE',
        ]).optional(),

        possibleCause: z.string().optional(),
    }),

    params: z.object({
        patientId: mongooseObjectIdValidator("Patient")
    })
});

export const medicalCaseUpdationSchema = z.object({
    body: medicalCaseUpdationSchema.shape.body.shape.omit({ doctorId: true }).partial(),

    params: z.object({
        medicalCaseId: mongooseObjectIdValidator("Medical Case"),
    })
});

export const changeNurseSchema = z.object({
    params: z.object({
        medicalCaseId: mongooseObjectIdValidator("Medical Case"),
        nurseId: mongooseObjectIdValidator("Nurse")
    })
});

const medicalCaseDoctorSchema = z.object({
    params: z.object({
        medicalCaseId: mongooseObjectIdValidator("Medical Case"),
        doctorId: mongooseObjectIdValidator("Doctor")
    })
});

export const assignMedicalCase = medicalCaseDoctorSchema;
export const changeDoctorSchema = medicalCaseDoctorSchema;

export const medicalCaseIdSchema = z.object({
    params: z.object({
        medicalCaseId: mongooseObjectIdValidator("Medical Case")
    })
});