import { Checkup } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const validateCheckupId = async (req, res, next) => {
    try {
        const { checkupId } = req.parsedParams;

        const checkupRecord = await Checkup.exists({ _id: checkupId });

        if (!checkupRecord) {
            return next(
                new APIError(404, "Checkup record not found")
            );
        }

        return next();
    } catch (err) {
        return next(err);
    }
};