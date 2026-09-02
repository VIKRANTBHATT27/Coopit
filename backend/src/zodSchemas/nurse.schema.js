import mongoose from 'mongoose';
import { z } from 'zod';


const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId.isValid(val), {
          message: `Invalid Object Id for ${fieldName}`
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

export const createNurseSchema = z.object({
     body: z.object({
          wardAssigned: z.enum([
               "ICU_INTENSIVE_CARE_UNIT",
               "NICU_PICU_NEONATAL_PEDIATRIC_ICU",
               "CCU_CORONARY_CARE_UNIT",
               "GENERAL_WARD",
               "MATERNITY_OBSTETRICS",
               "PEDIATRIC_WARD",
               "SURGICAL_WARD",
               "ONCOLOGY_WARD",
               "PSYCHIATRIC_UNIT",
               "EMERGENCY_OBSERVATION",
               "ISOLATION_UNIT"
          ]),

          nurseDescription: z.string().optional(),

          shift: z.enum(["DAY", "NIGHT"]),

          workingHours: z.object({
               start: timeSchema,
               end: timeSchema
          }),

          experienceYears: z.number().default(0),

          qualification: z.string()
     }),

     params: z.object({
          staffId: mongooseObjectIdValidator('Staff')
     })
});

export const nurseUpdationSchema = z.object({
     body: createNurseSchema.shape.body.shape.partial(),

     params: z.object({
          staffId: mongooseObjectIdValidator('Staff')
     })
});

// pfp_url: z.string().default('/default-pfp/default-nurse.png'),
// assignedPatients: z.array(mongooseObjectIdValidator("patientId")).unique().default([]),
// patientId: mongooseObjectIdValidator("patientId"),


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

export const getNursesQuerySchema = z.object({
     query: z.object({
          department: z.enum([
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
               "UROLOGY",
               "FRONT_DESK",
               "MANAGEMENT"
          ], {
               required_error: "Department query parameter is required",
               invalid_type_error: "Invalid hospital department selected"
          })
     })
});