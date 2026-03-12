import express from "express";
import upload from "../middlewares/multer.js";
import deleteLocalImgFile from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import {
     handlePatientLogin,
     handlePatientSignup,
     handleGetPatient,
     handlePatientUploadImg,
     handleDeletePatientPfpImage,
} from "../controllers/patient.js";

const router = express.Router();

router.post('/signup', handlePatientSignup);

router.post('/login', handlePatientLogin);

router.get("/:id", handleGetPatient);

router.patch('/pfpImgUpload',
     upload.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handlePatientUploadImg
);

router.delete('/deletePfpImage', handleDeletePatientPfpImage);

// router.post('/:id/document-upload', handleDocumentUpload);



export default router;