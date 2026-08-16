import APIError from "../utils/APIError.utils.js";
import logger from "../../config/logger.js";

export const errorHandler = async (err, req, res, next) => {
    logger.error({
        err,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?._id
    });

    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
        });
    }

    return res.status(500).json({
        success: false,
        error: "INTERNAL SERVER ERROR"
    });
};