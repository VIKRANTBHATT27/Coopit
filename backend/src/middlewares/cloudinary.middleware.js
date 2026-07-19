import { v2 as cloudinary } from "cloudinary";
import APIError from "../utils/APIError.utils";

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
     } catch (error) {
          console.log("Cloudinary upload failed: ", error);

          return res.status(500).json({
               error: "Image upload failed"
          });
     }
};

export default uploadUserAvatar;