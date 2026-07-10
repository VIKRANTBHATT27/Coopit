import APIError from "../utils/APIError.utils";

export const errorHandler = async (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors,
        });
    }

    return res.status(500).json({ success: false, error: "INTERNAL SERVER ERROR" });
};