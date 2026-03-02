import express from "express";
import upload from "../middlewares/multer.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";
import { cloudinary_pfpUploader } from "../middlewares/cloudinaryImgUpload.js";
import { 
     handlePatientLogin,
     handlePatientSignup,
     handleGetPatient,
     handleUploadImg,
     handleDeletePfpImage } from "../controllers/patient.js";

const router = express.Router();

router.post('/signup', handlePatientSignup);

router.post('/login', handlePatientLogin);

router.post('/pfpImgUpload', 
     upload.single("profilePic"), 
     cloudinary_pfpUploader, 
     deleteLocalImgFile, 
     handleUploadImg
);

router.post('/deletePfpImage', handleDeletePfpImage);

router.get("/:id", handleGetPatient);

export default router;