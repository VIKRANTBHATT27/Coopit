import APIError from "../utils/APIError.utils.js";
import logger from "../../config/logger.js";
import { deleteDicomInstance } from "../services/dicom.service.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";
import { deleteFileFromS3 } from "../infrastructure/aws.js";

export const errorHandler = async (err, req, res, next) => {
    logger.error({
        err,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?._id
    });

    if (req.pfpAvatarPublicId) {
        const result = await deleteUserAvatar(req.pfpAvatarPublicId);

        if (!result)
            throw new Error(500, "Cloudinary profile image deletion failed!");
    }

    if (req.dicomPayload.studyUid) {
        await deleteDicomInstance(req.dicomPayload.studyUid);
    }

    if (req.s3Key) {
        await deleteFileFromS3(req.s3Key);
    }

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