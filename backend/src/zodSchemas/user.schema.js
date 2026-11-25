import mongoose from "mongoose";
import { z } from "zod";

const mongooseObjectIdValidator = (fieldName) => z.string().trim()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: `Invalid ObjectId for field ${fieldName}`
    });

export const getUserSchema = z.object({
    body: z.object({
        emailId: z.email({ message: "Invalid email address" })
    })
});

export const getUserByUserId = z.object({
    params: z.object({
        userId: mongooseObjectIdValidator("User")
    })
});

export const userProfileSchema = z.object({
    firstName: z.string().trim().min(1).max(50),
    middleName: z.string().trim().min(1).max(50).optional(),
    lastName: z.string().trim().min(1).max(50),
    emailId: z.email({ message: "Invalid email address" }).trim(),
    password: z.string().trim()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
    phoneNumber: z.string().trim()
        .regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits"),
    gender: z.enum(['MALE', 'FEMALE', 'OTHERS']),
    dateOfBirth: z.coerce.date()
        .max(new Date(),
            { message: "Birth date cannot be in the future" }
        ),
    role: z.enum([
        "PATIENT",
        "STAFF",
        "SUPER_ADMIN",
    ]).default("PATIENT"),
    state: z.string().trim(),
    districtName: z.string().trim(),
    landmark: z.string().trim().optional(),
});

export const createUserSchema = z.object({
    body: userProfileSchema.pick({
        firstName: true,
        middleName: true,
        lastName: true,
        emailId: true,
        password: true,
        phoneNumber: true,
        role: true,
        state: true,
        gender: true,
        districtName: true,
    })
});

export const verificationSchema = z.object({
    body: userProfileSchema.pick({
        emailId: true
    }).extend({
        otpCode: z.string().trim()
            .regex(/^\d{6}$/,
                { message: "OTP must be exactly 6 digits" }
            )
    })
});

export const loginSchema = z.object({
    body: userProfileSchema.pick({
        emailId: true,
        password: true
    }).extend({
        otpCode: z.string().trim()
            .regex(/^\d{6}$/,
                { message: "OTP must be exactly 6 digits" }
            )
    })
});

export const updateProfileSchema = z.object({
    body: userProfileSchema.pick({
        firstName: true,
        middleName: true,
        lastName: true,
        gender: true,
        dateOfBirth: true,
        state: true,
        districtName: true,
        landmark: true
    }).partial(),
});

export const changePhoneSchema = z.object({
    body: userProfileSchema.pick({
        emailId: true,
        password: true,
        phoneNumber: true
    })
});

export const updatePhoneSchema = z.object({
    body: userProfileSchema.pick({
        phoneNumber: true
    })
});

export const passwordResetSchema = z.object({
    body: z.object({
        resetToken: z.string().trim()
            .length(64, "Invalid reset token")
            .regex(/^[a-f0-9]{64}$/i, "Invalid reset token format"),

        otpCode: z.string().trim()
            .regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),

        newPassword: z.string().trim()
            .min(8, "Password must be at least 8 characters long")
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
    })
});

export const updatePasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().trim()
            .min(8, "Password must be at least 8 characters long")
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
        newPassword: z.string().trim()
            .min(8, "Password must be at least 8 characters long")
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
    })
});

export const emailIdSchema = z.object({
    body: userProfileSchema.pick({ emailId: true })
});

export const userIdSchema = z.object({
    params: z.object({
        userId: mongooseObjectIdValidator("User")
    })
})