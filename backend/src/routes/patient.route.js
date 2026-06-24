import express from "express";
import { uploadImg } from "../middlewares/multer.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinary.middleware.js";

import {
     handleGetPatient,
     handleUpdatePatient,
     handlePatientSignup,
     handlePatientUploadImg,
     handleDeletePfpImage,
     handleDownloadDicom,
} from "../controllers/patient.controller.js";

import {
     validateBody,
     validateParams
} from "../middlewares/validateReq.middleware.js";

import {
     patientSchema,
     userIdSchema,
     downloadDicomSchema
} from "../zodSchemas/patient.schema.js";

const router = express.Router();


router.route("/:userId", validateParams(userIdSchema))
     .get(handleGetPatient)
     .patch(
          validateBody(patientSchema.partial()),
          handleUpdatePatient
     );


router.patch('/pfp-image-upload/:userId',
     uploadImg.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     validateParams(userIdSchema),
     handlePatientUploadImg
);

router.delete('/deletePfpImage', 
     validateParams(userIdSchema),
     handleDeletePfpImage
);

// router.post('/:id/document-upload', handleDocumentUpload);

router.post("/download-dicom", 
     validateBody(downloadDicomSchema),
     handleDownloadDicom
);

export default router;