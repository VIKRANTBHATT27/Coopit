import { formatError, ZodError } from "zod";
import APIError from "../utils/APIError.utils.js";

export const validateBody = (schema) => (req, res, next) => {
     try {
          req.parsedBody = schema.parse(req.body);
          return next();
     } catch (err) {
          if (err instanceof ZodError) {
               const formattedError = err.errors.map(e => ({
                    field: e.path.join("."),
                    message: e.message
               }));

               return next(new APIError(
                    400,
                    "Validation Constraints failed",
                    formattedError
               ));
          };

          console.error("critical error in validating body\nerrorMessage => ", err.message);

          return next(err);
     }
};

export const validateParams = (schema) => (req, res, next) => {
     try {
          req.parsedParams = schema.parse(req.params);
          return next();
     } catch (err) {
          if (err instanceof ZodError) {
               const formattedError = err.errors.map(e => ({
                    field: e.path.join("."),
                    message: e.message
               }));

               return next(new APIError(
                    400,
                    "Validation Constraints failed",
                    formattedError
               ));
          };

          console.error("critical error in validating params\nerrorMessage => ", err.message);

          return next(err);
     }
};

export const validateQuery = (schema) => (req, res, next) => {
     try {
          req.parsedQuery = schema.parse(req.query);
          return next();
     } catch (err) {
          if (err instanceof ZodError) {
               const formattedError = err.errors.map(e => ({
                    field: e.path.join("."),
                    message: e.message
               }));

               return next(new APIError(
                    400,
                    "Validation Constraints failed",
                    formattedError
               ));
          };

          console.error("critical error in validating query\nerrorMessage => ", err.message);

          return next(err);
     }
};