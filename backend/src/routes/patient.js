import express from "express";
import upload from "../middlewares/multer.js";
import { cloudinary_pfpUploader } from "../middlewares/cloudinary.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";
import { handlePatientLogin, handlePatientSignup} from "../controllers/patient.js";

const router = express.Router();

router.post('/signup',
          upload.single('profilePic'),
          cloudinary_pfpUploader,
          deleteLocalImgFile,
          handlePatientSignup
     );
router.post('/login', handlePatientLogin);


export default router;