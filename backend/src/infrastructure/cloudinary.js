import { v2 as cloudinary } from "cloudinary";

const deleteUserAvatar = async (publicId) => {
     try {
          if (!publicId) throw new Error("publicId not provided!");

          const deletionResult = await cloudinary.uploader.destroy(
               publicId,
               {
                    resource_type: 'image',
               }
          );

          return deletionResult;
     } catch (err) {
          console.error("Cloudinary pfp deletion failed\n", err.message);
          throw new Error(500, "Cloudinary profile image deletion failed!");
     }
};

export default deleteUserAvatar;