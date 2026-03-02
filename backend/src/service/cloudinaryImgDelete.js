import { v2 as cloudinary } from "cloudinary";

export const cloudinary_Delete_pfp = async (publicId) => {
     try {
          if (!publicId) throw new Error("publicId not provided!");

          console.log(publicId);

          const deletionResult = await cloudinary.uploader.destroy(publicId, {
               resource_type: 'image',
          });

          return deletionResult;
     } catch (error) {
          console.log("Cloudinary pfp deletion failed: ", error);
          throw new Error("Cloudinary profile image deletion failed!");
     }
};