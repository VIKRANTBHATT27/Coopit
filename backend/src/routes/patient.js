import express from "express";
import upload from "../middlewares/multer.js";
import deleteLocalImgFile from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import {
     handlePatientLogin,
     handlePatientSignup,
     handleGetPatient,
     handleUploadImg,
     handleDeletePfpImage,
     handleGetPatientPhone
} from "../controllers/patient.js";

const router = express.Router();

router.post('/signup', handlePatientSignup);

router.post('/login', handlePatientLogin);

router.get("/getPhone/:id", handleGetPatientPhone);

router.patch('/pfpImgUpload',
     upload.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handleUploadImg
);

router.delete('/deletePfpImage', handleDeletePfpImage);

// router.post('/:id/document-upload', handleDocumentUpload);

router.get("/:id", handleGetPatient);


export default router;