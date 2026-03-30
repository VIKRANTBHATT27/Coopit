import { ZodError } from "zod";

const validateBody = (schema) => (req, res, next) => {
     try {
          req.parsedBody = schema.parse(req.body);
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

export default validateBody;