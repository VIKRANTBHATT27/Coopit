import * as z from "zod";

export const validateReportBody = (req, res, next) => {
     const dicomBodySchema = z.array(z.object({
          fileName: z.string(),
          uploadedBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     }));

     try {
          req.parsedBody = dicomBodySchema.parse(req.body); 
          return next();
     } catch (err) {
          if (err instanceof ZodError) {
               return res.status(400).json({
                    err: "Validation failed",
                    details: err.errors.map(e => ({
                         field: e.path.join("."),
                         message: e.message
                    }))
               });
          }
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};