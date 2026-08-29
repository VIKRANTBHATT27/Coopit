import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId(val), {
          message: `Invalid ${fieldName}'s mongoose-Id`
     });

export const getTimelineSchema = z.object({
     params: z.object({
          patientId: mongooseObjectIdValidator("Patient"),
          medicalCaseId: mongooseObjectIdValidator("Medical Case"),
     })
});

export const createPatientTimelineSchema = z.object({
     body: z.object({
          medicalConditionName: z.string(),

          currentStatus: z.enum([
               "ACTIVE",
               "RECOVERED",
               "CHRONIC",
               "DECEASED"
          ]).default("ACTIVE"),

          eventData: z.array({
               eventType: z.enum([
                    'CHECKUP_CREATED',
                    'DICOM_UPLOADED',
                    'REPORT_UPLOADED',
                    'MEDICATION_CHANGED',
                    'MEDICAL_CASE_CREATED',
                    'MEDICAL_CASE_UPDATED',
                    'FOLLOW_UP_COMPLETED',
                    'PRESCRIPTION_ADDED',
               ]),

               note: z.string().optional(),
          }),
     }),

     params: z.object({
          patientId: mongooseObjectIdValidator("Patient"),
          medicalCaseId: mongooseObjectIdValidator("Medical Case"),
     })
});

export const updateTimelineSchema = z.object({
     body: createPatientTimelineSchema.shape.body.partial().extend({
          eventReferenceType: z.enum([
               "Checkup",
               "DicomStudy",
               "LabReport",
          ]),

          eventReferenceId: mongooseObjectIdValidator(eventReferenceType),
     }),

     params: z.object({
          patientId: mongooseObjectIdValidator("Patient"),
          medicalCaseId: mongooseObjectIdValidator("Medical Case"),
     })
});
