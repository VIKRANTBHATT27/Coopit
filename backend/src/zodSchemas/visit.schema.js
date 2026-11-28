import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ObjectId for field ${fieldName}`
    });

export const getAllVisitSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().positive().default(1),

        limit: z.coerce.number().int().positive().default(12),
    })
});

export const patientVisitSchema = z.object({
    params: z.object({
        patientId: mongooseObjectIdValidator('Patient')
    }),

    body: z.object({
        nurseStaffId: mongooseObjectIdValidator('Staff'),
        reason: z.string(),
    })
});

export const visitIdSchema = z.object({
    params: z.object({
        visitId: mongooseObjectIdValidator("Visit")
    })
});

export const changeVisitNurseSchema = z.object({
    params: z.object({
        visitId: mongooseObjectIdValidator("Visit"),
        nurseStaffId: mongooseObjectIdValidator('Staff')
    })
});