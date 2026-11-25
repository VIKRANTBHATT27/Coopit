import { z } from "zod";

export const getAdminSchema = z.object({
    query: z.object({
        emailId: z.email({ message: "Invalid email address" }).trim()
    })
});