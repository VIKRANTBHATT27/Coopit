
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

export const handleGetReceptionistDetails = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const receptionistDetails = await Receptionist.findOne({ staffId })
               .populate({
                    path: "staffId",
                    populate: {
                         path: "userId",
                         select: "-passwordHash -phoneNumberHash -phoneNumberEnc -phoneIV -phoneAuthTag"
                    }
               })

          if (!receptionistDetails) {
               return next(
                    new APIError(404, "Receptionist record not found")
               );
          }

          return res.status(200).json({
               message: "All details of receptionist",
               data: receptionistDetails
          });

     } catch (err) {
          return next(err);
     }
};

export const handleCreateReceptionist = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;
          const { hospitalId } = req.user;

          const [staffExists, receptionistExists] = await Promise.all([
               Staff.exists({
                    _id: staffId,
                    role: "RECEPTIONIST"
               }).lean(),
               Receptionist.exists({ staffId }).lean()
          ]);

          if (!staffExists) {
               return next(
                    new APIError(404, "Staff Record not found")
               );
          }
          if (receptionistExists) {
               return next(
                    new APIError(400, "Receptionist already exists")
               );
          }

          const receptionist = await Receptionist.create({
               ...req.parsedBody,
               hospitalId,
               staffId
          });

          return res.status(201).json({
               message: "Successfully created a Receptionist",
               data: receptionist
          });

     } catch (err) {
          return next(err);
     };
};

export const handleUpdateReceptionist = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({
               _id: staffId,
               role: "RECEPTIONIST"
          }).lean();

          if (!staffRecord) {
               return next(
                    new APIError(400, "No staff record found")
               );
          }

          const receptionist = await Receptionist.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         ...req.parsedBody,
                         staffId
                    }
               },
               { returnDocument: "after", runValidator: true }
          );

          if (!receptionist) {
               return next(
                    new APIError(404, "No receptionist record found")
               );
          }

          return res.status(200).json({
               msg: "Successfully updated Receptionist record",
               data: receptionist
          });

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
               { returnDocument: "after" }
          );

          if (!receptionist) {
               return next(
                    new APIError(404, "Receptionist record not found")
               )
          }

          return res.status(200).json({
               message: "successfully uploaded avatar",
               url: receptionist.pfp_url
          });

     } catch (err) {
          if (req.pfpAvatarPublicId) {
               const result = await deleteUserAvatar(req.pfpAvatarPublicId);

               if (!result)
                    throw new Error(500, "Cloudinary profile image deletion failed!");
          }

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
                    new APIError(500, "Failed to delete avatar from stoage system.")
               );
          }

          receptionist.pfp_publicId = null;
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
