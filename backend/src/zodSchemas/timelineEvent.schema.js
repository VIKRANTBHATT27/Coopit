import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string()
     .refine(val => mongoose.Types.ObjectId(val), {
          message: `Invalid ${fieldName}'s mongoose-Id`
     });

export const createPatientTimelineSchema = z.object({
     medicalConditionName: z.string(),
     startedAt: z.date().default(Date.now),
     enededAt: z.date().optional(),
     currentStatus: z.enum(['Active', 'Recovered', 'Chronic', 'Deceased']).default("Active"),
     patientId: mongooseObjectIdValidator('patient'),
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
          performedByRole: z.enum(['DOCTOR', 'NURSE', 'LAB_TECHNICIAN']).nonoptional(),
          performedBy: mongooseObjectIdValidator(performedByRole),
          performedByReference: z.enum(["Doctor", "LabTechnician", "Nurse"]).nonoptional(),
          eventReferenceType: z.enum(['CheckUp', 'MedicalCase', 'DicomFile', 'LabReport', 'FailedDicomFiles']),
          eventReferenceId: mongooseObjectIdValidator(eventReferenceType),
          note: z.string().optional(),
     }).default([]).nonoptional(),
});

export const addEventDataSchema = createPatientTimelineSchema.pick({
     patientId: true,
     eventData: true,
})

export const checkTimelineEventIdSchema = mongooseObjectIdValidator('timelineEvent');
