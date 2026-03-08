import { v2 as cloudinary } from "cloudinary";

const cloudinary_pfpUploader = async (req, res, next) => {
     try {
          if (!req.file || !req.body.emailId) return next();

          const uploadResult = await cloudinary.uploader.upload(req.file.path, {
               resource_type: 'image',
               folder: 'Coopit-pfp-images'
          });

          req.pfpImageURL = uploadResult.secure_url;
          req.pfpImagePublicId = uploadResult.public_id;

          return next();
     } catch (error) {
          console.log("Cloudinary upload failed: ", error);
          return res.status(500).json({ error: "Image upload failed " })
     }
};

export default cloudinary_pfpUploader;