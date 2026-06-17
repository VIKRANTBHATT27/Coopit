import * as z from "zod";

export const signUpSchema = z.object({
     fullName: z.string().min(1).max(60),
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
     password: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
     phoneNumber: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Phone number must be 10 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     dateOfBirth: z.date().max(new Date(), { message: "Birth date cannot be in the future" }),
     role: z.enum(["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"]),
     state: z.string(),
     districtName: z.string(),
     landmark: z.string(),
});

export const loginSchema = signUpSchema.pick({
     emailId: true,
     password: true
});

export const emailIdSchema = signUpSchema.pick({
     emailId: true
});

export const checkOTPSchema = signUpSchema.pick({
     emailId: true,
     otp: z.string().regex(/^\d{6}$/, { message: "OTP must be exactly 6 digits" })
});

export const userUpdationSchema = signUpSchema.pick({
     emailId: true,
     fullName: true,
     phoneNumber: true,
     gender: true,
     dateOfBirth: true,
     role: true,
     state: true,
     districtName: true,
     landmark: true
}).partial().extend({
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email")
}).refine(data => data.emailId, {
     message: "emailId is required",
     path: ["emailId"]
});

export const  updatePasswordSchema = z.object({
     emailId: z.string().regex(/^\S+@\S+\.\S+$/, "Invalid email"),
     oldPass: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
     newPass: z.string().min(8, "Password must be at least 8 characters long").regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/, "Invalid Password"),
});