import { v2 as cloudinary } from "cloudinary";

const deleteUserAvatar = async (publicId) => {
     try {
          if (!publicId) throw new Error("publicId not provided!");

          await cloudinary.uploader.destroy(
               publicId,
               {
                    resource_type: 'image',
               }
          );

          return true;
     } catch (err) {
          console.error("Cloudinary pfp deletion failed\n", err.message);
          
          return false;
     }
};

export default deleteUserAvatar;