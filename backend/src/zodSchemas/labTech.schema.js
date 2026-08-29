import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          error: `Invalid ObjectId for the field ${fieldName}`
     });

export const createLabTechnician = z.object({
     body: z.object({
          labType: z.enum([
               "ANATOMIC_PATHOLOGY",
               "BIOCHEMISTRY",
               "CYTOLOGY",
               "GENETICS_GENOMICS",
               "HEMATOLOGY",
               "HISTOLOGY",
               "IMAGING_MRI_CT_X_RAY",
               "IMMUNOLOGY_SEROLOGY",
               "MICROBIOLOGY",
               "MOLECULAR_DIAGNOSTICS",
               "NUCLEAR_MEDICINE",
               "PHLEBOTOMY",
               "RADIOLOGY",
               "TOXICOLOGY",
               "URINALYSIS",
               "VIROLOGY"
          ]),

          qualification: z.string(),

          shift: z.enum([
               "MORNING",
               "EVENING",
               "Night"
          ])
     }),

     params: z.object({
          staffId: mongooseObjectIdValidator('staffId'),
     }),
});

export const updateLabTechnician = z.object({
     body: labTechSchema.shape.body.shape.partial(),

     params: z.object({
          staffId: mongooseObjectIdValidator('staffId'),
     })
});

const AVATAR_FILE_TYPES = [
     "image/jpeg",
     "image/png",
     "image/webp"
];

export const labTechAvatarUploadSchema = z.object({
     file: z.object({
          originalName: z.string()
               .min(1, "Original filename is required"),
          mimeType: z.string()
               .refine(mime => AVATAR_FILE_TYPES.includes(mime), {
                    message: "invalid image file type"
               }),
          path: z.string()
               .min(1, "Temporary storage file path is missing"),
     }, {
          message: "file is required for avatar uplaod"
     }),

     params: z.object({
          staffId: mongooseObjectIdValidator('staffId')
     })
});