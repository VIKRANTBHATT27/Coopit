import { ZodError } from "zod";
import APIError from "../utils/APIError.utils.js";
import logger from "../../config/logger.js";

const parseIncomingReq = (schema) => (req, res, next) => {
    try {
        const parsedData = schema.parse({
            body: req.body,
            query: req.query,
            params: req.params,
            file: req.file,
        });

        req.parsedBody = parsedData.body;
        req.parsedParams = parsedData.params;
        req.parsedQuery = parsedData.query;
        req.parsedFile = parsedData.file;

        return next();
    } catch (err) {
        if (err instanceof ZodError) {
            const formattedError = err.errors.map(e => ({
                field: e.path.join("."),
                message: e.message
            }));

            return next(
                new APIError(
                    400,
                    "Validation Constraints failed",
                    formattedError
                )
            );
        };

        logger.error("Validation Error: ", { error: err.message });

        return next(err);
    }
};

export default parseIncomingReq;