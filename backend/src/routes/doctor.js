import express from "express";
import { uploadImg } from "../middlewares/multer.js";
import deleteLocalImgFile from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import {
     handleDoctorLogin,
     handleDoctorSignup,
     handleGetDoctor,
     handleUploadImg,
     handleDeletePfpImage
} from "../controllers/doctor.js";

const router = express.Router();

router.post("/signup", handleDoctorSignup);

router.post("/login", handleDoctorLogin);

router.get("/:id", handleGetDoctor);

router.patch('/pfpImgUpload', 
     uploadImg.single("profilePic"), 
     cloudinary_pfpUploader, 
     deleteLocalImgFile, 
     handleUploadImg
);

router.delete('/deletePfpImage', handleDeletePfpImage);


// export const handleDocumentUpload = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ err: "no data is provided!" });

//      try {
//           const patientId = req.params.id;

//           const patient = await patientModel.findById(patientId);

//      } catch (error) {
//           console.log(err);
//           return null;
//      }
// };

export default router;