import { ZodError } from "zod";

export const validateBody = (schema) => (req, res, next) => {
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
          };

          console.error("request body validation failed\nerrorMessage => ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const validateParams = (schema) => (req, res, next) => {
     try {
          req.parsedParams = schema.parse(req.params); 
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
          };

          console.error("request params validation failed\nerrorMessage => ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const validateQuery = (schema) => (req, res, next) => {
     try {
          req.parsedQuery = schema.parse(req.query);
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
          };

          console.error("request query validation failed\nerrorMessage => ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};