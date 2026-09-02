import mongoose from "mongoose";
import { z } from "zod";

const studyInstanceUidRegex = /^(0|[1-9][0-9]*)(\.(0|[1-9][0-9]*)){0,63}$/;
const seriesInstanceUidRegex = /^(?:0|[1-9]\d*)(?:\.(?:0|[1-9]\d*))*$/;

const mongooseObjectIdValidator = (fieldName) => z.string()
    .refine(val => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ${fieldName}'s mongoose ObjectId`
    });



const dicomSliceSchema = z.object({
    fileName: z.string()
        .min(5, "File name is too short")
        .regex(
            /^[\w\-. ]+\.dcm$/i,
            "Invalid DICOM file name. Must end with .dcm and contain valid characters."
        ),
    fileUrl: z.string().url("Invalid file URL"),
    seriesInstanceId: z.string()
        .max(64, "DICOM UID must be 64 characters or less")
        .regex(seriesInstanceUidRegex, "Invalid DICOM UID format (digits and dots only, no leading zeros)"),
    sopInstanceUid: z.string()
        .max(64, { message: "SOP Instance UID must be 64 characters or less" })
        .regex(/^[0-9]+(\.[0-9]+)*$/, "SOP Instance UID must contain only numbers and periods, and cannot start/end with a period")
        .refine(
            (uid) => uid.split('.').every((part) => part === '0' || !part.startsWith('0')),
            { message: "SOP Instance UID components cannot have leading zeros" }
        ),
    bodyPart: z.string().optional()
});

export const createDicomStudySchema = z.object({
    checkupId: mongooseObjectIdValidator('Checkup'),
    studyInstanceId: z.string()
        .min(1, 'Study Instance UID is required')
        .max(64, 'UID cannot exceed 64 characters')
        .regex(studyInstanceUidRegex, 'Invalid DICOM UID format'),
    modality: z.enum(["MR", "CT", "DX", "CR", "Others"]),
    slices: dicomSliceSchema
});