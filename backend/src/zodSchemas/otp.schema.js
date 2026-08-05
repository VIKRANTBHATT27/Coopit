import { z } from "zod";
import { userIdSchema } from "./patient.schema.js";

const OTPGenerationSchema = z.object({
    otpType: z.enum(['EMAIL', 'PHONE'], {
        errorMap: () => ({ message: "Invalid OTP type. Must be EMAIL or PHONE" })
    }),

    userId: userIdSchema
});

export default OTPGenerationSchema;