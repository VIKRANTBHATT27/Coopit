import express from "express";

import upload from "../middlewares/multer.js";
import deleteLocalImgFile from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";

import {
     handlePatientSignup,
     handleGetPatient,
     handleGetPatientPhone
} from "../controllers/patient.js";

import {
     handleReceptionistSignup,
     handleReceptionistLogin,
     handleGetReceptionist,
     handleGetReceptionistPhone,
     handleReceptionistUploadImg,
     handleDeleteReceptionistPfpImg
} from "../controllers/receptionist.js";


const router = express.Router();

// assignment a doctor this patient 
// require a patient _id (extract from email currently) & a dotor object access for that particular category

router.post("/add-patient", handlePatientSignup);
router.get("/get-patient", handleGetPatient);
router.get("/get-patient-phone", handleGetPatientPhone);

router.post("/signup", handleReceptionistSignup);
router.post("/login", handleReceptionistLogin);
router.get("/:id", handleGetReceptionist);
router.get("/getPhone/:id", handleGetReceptionistPhone);

router.patch("/pfpImgUpload",
     upload.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handleReceptionistUploadImg
);
route.delete("/deletePfpImage", handleDeleteReceptionistPfpImg);

export default router;