import mongoose from "mongoose";
import * as z from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          error: `Invalid ObjectId for the field ${fieldName}`
     });


export const labTechSchema = z.object({
     staffId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().default("/default-pfp/default-lab-technician.png"),
     labType: z.enum([
          "Anatomic Pathology",
          "Biochemistry",
          "Cytology",
          "Genetics/Genomics",
          "Hematology",
          "Histology",
          "Imaging (MRI/CT/X-Ray)",
          "Immunology/Serology",
          "Microbiology",
          "Molecular Diagnostics",
          "Nuclear Medicine",
          "Phlebotomy",
          "Radiology",
          "Toxicology",
          "Urinalysis",
          "Virology"
     ]),
     qualification: z.string(),
     shift: z.enum(["Morning", "Evening", "Night"])
});

export const labTechinicianUpdateSchema = z.object({
     params: z.object({
          staffId: mongooseObjectIdValidator('staffId'),
     }),
     body: labTechSchema.partial()
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