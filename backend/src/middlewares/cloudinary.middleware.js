import { v2 as cloudinary } from "cloudinary";
import APIError from "../utils/APIError.utils.js";

const uploadUserAvatar = async (req, res, next) => {
    try {
        const uploadResult = await cloudinary.uploader.upload(
            req.file.path,
            {
                resource_type: 'image',
                folder: 'Coopit-pfp-images'
            }
        );

        req.pfpAvatarURL = uploadResult.secure_url;
        req.pfpAvatarPublicId = uploadResult.public_id;

        return next();
    } catch (err) {
        return next(
            new APIError(500, "Image Upload failed from cloudinary")
        );
    }
};

export default uploadUserAvatar;