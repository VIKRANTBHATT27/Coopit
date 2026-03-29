import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import { cleanupDICOMFile, deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";
import { uploadDicomFile, uploadImg } from "../middlewares/multer.js";
import express from "express";
import {
     handleAddLabTech,
     handleGetLabTech,
     handleUpdateLabTech,
     handleUploadPfpImg,
     handleAddDicomReport,
} from "../controllers/labTechnician.js";
import { extractAndUploadDICOMs } from "../middlewares/extractAndUploadDicoms.js";
import { validateReportBody } from "../middlewares/validateDicomBody.js";

const router = express.Router();

router.post('/create-labTech', handleAddLabTech);
router.route(':Id')
     .get(handleGetLabTech)
     .patch(handleUpdateLabTech);

router.post('/upload-pfp', 
     uploadImg.single("pfpImage"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handleUploadPfpImg
);

router.delete('/delete-pfp', handleDeletePfpImage);

router.post('/upload-dicom/:checkUpId', 
     uploadDicomFile.single("dicom"),
     validateReportBody,
     extractAndUploadDICOMs,
     cleanupDICOMFile,
     handleAddDicomReport
);



export default router;