import express from "express";
import upload from "../middlewares/multer.js";
import deleteLocalImgFile from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import {
     handleGetPatient,
     handleUpdatePatient,
     handlePatientSignup,
     handlePatientUploadImg,
     handleDeletePatientPfpImage,
} from "../controllers/patient.js";

const router = express.Router();

router.post('/signup', handlePatientSignup);

router.route("/:id")
     .get(handleGetPatient)
     .patch(handleUpdatePatient);


router.patch('/pfpImgUpload',
     upload.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handlePatientUploadImg
);

router.delete('/deletePfpImage', handleDeletePatientPfpImage);

// router.post('/:id/document-upload', handleDocumentUpload);



export default router;