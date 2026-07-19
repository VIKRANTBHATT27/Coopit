import { z } from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid mongoose ObjectId for field ${fieldName}`
    });

export const checkupIdSchema = mongooseObjectIdValidator("Checkup");