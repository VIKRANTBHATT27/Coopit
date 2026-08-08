import * as z from "zod";

export const signUpSchema = z.object({
     fullName: z.string().min(1).max(60),
     emailId: z.string().email({ message: "Invalid email address" }),
     password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
     phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     dateOfBirth: z.date().max(new Date(), { message: "Birth date cannot be in the future" }),
     role: z.enum(["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"]),
     state: z.string(),
     districtName: z.string(),
     landmark: z.string(),
});

export const createUserSchema = signUpSchema.pick({
     fullName: true,
     emailId: true,
     password: true,
     phoneNumber: true
});

export const loginSchema = signUpSchema.pick({
     emailId: true,
     password: true
});

export const emailIdSchema = signUpSchema.pick({ emailId: true });

export const verificationSchema = signUpSchema.pick({
     emailId: true,
     otp: z.string().regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" })
});

export const updateProfileSchema = signUpSchema.pick({
     fullName: true,
     gender: true,
     dateOfBirth: true,
     state: true,
     districtName: true,
     landmark: true
}).partial();

export const changePhoneSchema = signUpSchema.pick({
     emailId: true,
     password: true,
     phoneNumber: true
});

export const updatePhoneSchema = signUpSchema.pick({
     phoneNumber: true
});

export const forgotPasswordSchema = signUpSchema.pick({ emailId: true });

export const passwordResetSchema = z.object({
     resetToken: z.string()
          .length(64, "Invalid reset token")
          .regex(/^[a-f0-9]{64}$/i, "Invalid reset token format"),

     otpCode: z.string().regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" }),

     newPassword: z.string()
          .min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
});

export const updatePasswordSchema = z.object({
     currentPassword: z.string()
          .min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
     newPassword: z.string()
          .min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
});