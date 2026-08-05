import receptionistModel from "../models/receptionistModel.js";
import { Receptionist, Staff } from "../models/index.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";

export const handleGetReceptionist = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId });
          if (!staffRecord)
               return res.status(400).json({
                    message: 'No staff record exist with this staffId'
               });

          const receptionistRecord = await Receptionist.findOne({ staffId });
          if (!receptionistRecord)
               return res.status(404).json({
                    msg: "no receponist record found"
               });

          return res.status(200).json({ data: receptionist });
     } catch (err) {
          console.error("Failed to get receptionist\nErrorMsg: ", err.message);

          return next(err);
     }
};

// export const handleCreateReceptionist = async (req, res) => {
//      try {
//           const alreadyExist = await receptionistModel.findOne({ userId: req.parsedBody.userId });
//           if (alreadyExist) {
//                return res.status(400).json({ msg: "Receptionist already exist with this userId" });
//           }

//           const receptionist = await receptionistModel.create(req.parsedBody);

//           return res.status(201).json({ status: "created", data: newReceptionist });
//      } catch (err) {
//           console.log("error: ", err.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      };
// };

export const handleUploadAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const pfp_url = req.pfpImageURL;
          const pfp_publicId = req.pfpImagePublicId;

          const staffRecord = await Staff.exists({ _id: staffId });
          if (!staffRecord)
               return res.status(400).json({
                    err: "No staff record found with this staffId"
               });

          const receptionistRecord = await Receptionist.findOneAndUpdate(
               { staffId },
               { $set: { pfp_url, pfp_publicId } },
               { returnDocument: "after", runValidator: true }
          );

          if (!receptionistRecord)
               return res.status(404).json({
                    err: "no receptionist found with this staffId"
               });

          return res.status(200).json({
               message: "successfully uploaded image",
               url: receptionist.pfp_url
          });

     } catch (err) {
          console.error("failed during uploading recepionist avatar\nErrorMsg: ", err.message);

          return next(err);
     }
};

export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId });

          if (!staffRecord)
               return res.status(400).json({
                    err: "No staff record found with this staffId"
               });

          const receptionistRecord = await receptionistModel.findOne({ staffId });
          if (!receptionistRecord)
               return res.status(404).json({
                    err: "no receptionist found with this staffId"
               });

          const result = await deleteUserAvatar(receptionistRecord.pfp_publicId);

          if (!result)
               return res.status(400).json({
                    message: "Failed to delete avatar."
               });

          const updatedRecepionist = await receptionistModel.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         pfp_publicId: undefined,
                         pfp_url: "/default-pfp/default-receptionist.png"
                    }
               },
               { returnDocument: "after" }
          );

          if (!updatedRecepionist)
               return res.status(200).json({
                    success: true,
                    message: "successfully deleted profile picture"
               });

     } catch (err) {
          console.error("failed to delete avatar\nErrorMsg: ", err.message);

          return next(err);
     }
};

export const handleUpdateReceptionist = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const staffRecord = await Staff.exists({ _id: staffId });

          if (!staffRecord)
               return res.status(400).json({
                    err: "No staff record found with this staffId"
               });

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

          if (!receptionist)
               return res.status(404).json({
                    err: "No receptionist found with this staffId"
               });

          return res.status(200).json({
               msg: "successfully updated",
               staffId
          });

     } catch (err) {
          console.error("failed during receptionist updation\nErrorMsg: ", err.message);

          return next(err);
     }
};

