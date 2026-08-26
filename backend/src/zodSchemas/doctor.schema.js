import * as z from "zod";
import mongoose from "mongoose";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine((val) => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid ObjectId for field ${fieldName}`
     });

const timeSchema = z.string()
     .regex(/^([01]\d|2[0-3]):[0-5]\d$/,
          "Time must be in 24-hour format with leading zeros (HH:MM)"
     );


const AVATAR_FILE_TYPES = [
     "image/jpeg",
     "image/png",
     "image/webp"
];

export const createDoctorSchema = z.object({
     body: z.object({
          specialization: z.array(
               z.enum([
                    "ANESTHESIOLOGY",
                    "CARDIOLOGY",
                    "DERMATOLOGY",
                    "EMERGENCY_MEDICINE",
                    "ENDOCRINOLOGY",
                    "GASTROENTEROLOGY",
                    "GENERAL_CHECKUP",
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
          ).default(["GENERAL_CHECKUP"]),

          experienceYears: z.number().min(0).max(50),

          doctorDescription: z.string(),
          licenseNumber: z.string(),

          availability: z.object({
               morningTime: z.object({
                    startTime: timeSchema,
                    endTime: timeSchema
               }),

               eveningTime: z.object({
                    startTime: timeSchema,
                    endTime: timeSchema
               }),

               closedOn: z.array(
                    z.enum([
                         "MONDAY",
                         "TUESDAY",
                         "WEDNESDAY",
                         "THRUSDAY",
                         "FRIDAY",
                         "SATURDAY",
                         "SUNDAY"
                    ])
               ).default([]),
          })
     }),

     params: mongooseObjectIdValidator("Staff"),
});

export const updateDoctorSchema = z.object({
     params: mongooseObjectIdValidator("Staff"),

     boody: createDoctorSchema.shape.body.shape.partial()
});

export const avatarUploadSchema = z.object({
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
     })
});

export const emailIdSchema = z.object({
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
});

export const doctorIdSchema = z.object({
     doctorId: zObjectId("doctorId")
});

export const diseaseIdSchema = z.object({
     diseaseId: zObjectId("diseaseId")
});

export const staffIdSchema = z.object({
     staffId: zObjectId("staffId")
});