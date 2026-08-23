import receptionistModel from "../models/receptionistModel.js";
import { Receptionist, Staff } from "../models/index.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetReceptionist = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const receptionist = await Receptionist.findOne({ staffId });
          if (!receptionist) {
               return next(
                    new APIError(404, "Receptionist record not found")
               )
          }

          return res.status(200).json({ data: receptionist });
     } catch (err) {
          return next(err);
     }
};

export const handleUploadAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const pfp_url = req.pfpImageURL;
          const pfp_publicId = req.pfpImagePublicId;

          const receptionist = await Receptionist.findOneAndUpdate(
               { staffId },
               { $set: { pfp_url, pfp_publicId } },
               { returnDocument: "after", runValidator: true }
          );

          if (!receptionist) {
               return next(
                    new APIError(404, "Receptionist record not found")
               )
          }

          return res.status(200).json({
               message: "successfully uploaded image",
               url: receptionist.pfp_url
          });

     } catch (err) {
          return next(err);
     }
};

export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const receptionist = await Receptionist.findOne({ staffId });

          if (!receptionist) {
               return next(
                    new APIError(404, "Receptionist record not found")
               )
          }

          if (!receptionist.pfp_publicId) {
               return next(
                    new APIError(400, "Doesn't have custom profile picture")
               );
          }

          const cloudDeletionResult = await deleteUserAvatar(receptionist.pfp_publicId);

          if (!cloudDeletionResult) {
               return next(
                    new APIError(400, "Failed to delete avatar from stoage system.")
               );
          }

          receptionist.pfp_publicId = undefined;
          receptionist.pfp_url = "/default-pfp/default-receptionist.png";
          await receptionist.save();

          return res.status(200).json({
               success: true,
               message: "Successfully deleted profile picture",
               data: receptionist
          });

     } catch (err) {
          return next(err);
     }
};

