import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId(val), {
          message: `Invalid ${fieldName}'s mongoose-Id`
     });

export const createPatientTimelineSchema = z.object({
     medicalConditionName: z.string(),

     enededAt: z.date().default(Date.now),

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

          performedByRole: z.enum([
               'DOCTOR',
               'NURSE',
               'LAB_TECHNICIAN'
          ]),

          performedBy: mongooseObjectIdValidator(performedByRole),

          // performedByReference: z.enum(["Doctor", "LabTechnician", "Nurse"]).nonoptional(),

          eventReferenceType: z.enum([
               'CheckUp',
               'MedicalCase',
               'DicomFile',
               'LabReport', 'FailedDicomFiles'
          ]),

          eventReferenceId: mongooseObjectIdValidator(eventReferenceType),

          note: z.string().optional(),

     }).default([]),
});

export const addEventDataSchema = createPatientTimelineSchema.pick({
     patientId: true,
     eventData: true,
})

export const checkTimelineEventIdSchema = mongooseObjectIdValidator('timelineEvent');
