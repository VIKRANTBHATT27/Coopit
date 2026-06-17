import receptionistModel from "../models/receptionistModel.js";
import cloudinary_Delete_pfp from "../services/cloudinary-image-delete.service.js";


export const handleGetReceptionist = async (req, res) => {
     try {
          const { staffId } = req.params;

          const receptionist = await receptionistModel.findOne({ staffId });

          if (!receptionist) return res.status(404).json({ msg: "no receponist found" });

          return res.status(200).json({ status: "ok", data: receptionist });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleCreateReceptionist = async (req, res) => {
     try {
          const alreadyExist = await receptionistModel.findOne({ userId: req.parsedBody.userId });
          if (alreadyExist) {
               return res.status(400).json({ msg: "Receptionist already exist with this userId" });
          }

          const receptionist = await receptionistModel.create(req.parsedBody);

          return res.status(201).json({ status: "created", data: newReceptionist });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     };
};

export const handleUploadPfp = async (req, res) => {
     if (!req.file)
          return res.status(400).json({ err: "no file is provided!" });

     try {
          const { staffId } = req.parsedParams;
          const pfp_url = req.pfpImageURL;
          const pfp_publicId = req.pfpImagePublicId;

          const receptionist = await receptionistModel.findOneAndUpdate(
               { staffId },
               { $set: { pfp_url, pfp_publicId } },
               { returnDocument: "after" }
          );

          if (!receptionist) {
               return res.status(404).json({ err: "no receptionist found with this staffId ID" });
          }

          return res.status(200).json({ msg: "successfully uploaded image", url: receptionist.pfp_url });
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleDeletePfp = async (req, res) => {
     try {
          const { staffId } = req.parsedParams;

          const receptionist = await receptionistModel.findOne({ staffId });

          const result = await cloudinary_Delete_pfp(receptionist.pfp_publicId);

          console.log(result);

          if (!result) return res.status(400).json({ err: "Failed to delete profile picture from cloudinary" });

          const receptionist = await receptionistModel.findOneAndUpdate(
               { staffId },
               { $set: { pfp_url: "/default-pfp/default-receptionist.png", pfp_publicId: undefined } },
               { returnDocument: "after" }
          );

          return res.status(200).json({ msg: "successfully deleted profile picture" });

     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateReceptionist = async (req, res) => {
     try {
          const { staffId } = req.parsedParams;

          const receptionist = await receptionistModel.findOneAndUpdate(
               { staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!receptionist) return res.status(404).json({ err: "No receptionist found with this userId" });

          return res.status(200).json({ msg: "successfully updated" })
     } catch (err) {
          console.log("error: ", err.message);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};