import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import { cleanupDICOM, deleteLocalImgFile } from "../middlewares/deleteLocalFile.middleware.js";
import { uploadDicomFile, uploadImg } from "../middlewares/multer.middleware.js";
import express from "express";
import {
     handleAddLabTech,
     handleGetLabTech,
     handleUpdateLabTech,
     handleUploadPfpImg,
     handleDicomZip,
     handleGetDicomFiles,
     handleDeleteDicomFile,
     handlePreviewDicomFile,
     handleDeletePfpImage,
     handleUploadPDF,
     handleAddDicomFile
} from "../controllers/labTechnician.controller.js";

import { extractAndUploadDICOMs, uploadDicomToGoogleCloud } from "../middlewares/dicom.middleware.js";
import { validateBody, validateFilePresence, validateParams } from "../middlewares/validateReq.middleware.js";
import {
     labTechSchema,
     labTechiUpdateSchema,
     labTechImgUploadSchema
} from "../zodSchemas/labTech.schema.js";
import { checkUpIdSchema } from "../zodSchemas/checkUp.schema.js";
import { uploadPdf } from "../middlewares/multer.middleware.js";
import { labReportUploadSchema } from "../zodSchemas/labReport.schema.js";

const router = express.Router();

router.post('/',
     validateBody(labTechSchema),
     handleAddLabTech
);

router.route('/:staffId')
     .get(handleGetLabTech)
     .patch(
          validateBody(labTechiUpdateSchema),
          handleUpdateLabTech
     );

router.route('/avatar')
     .post(
          uploadImg.single("pfpImage"),
          uploadUserAvatar,
          deleteLocalImgFile,
          validateBody(labTechImgUploadSchema),
          handleUploadPfpImg
     )
     .delete(
          handleDeletePfpImage
     );

router.get('/dicom',
     handleGetDicomFiles
)

// zip
router.post('/dicom/unzip/:checkUpId',
     uploadDicomFile.single("dicom"),
     extractAndUploadDICOM,
     cleanupDICOM,
     handleDicomZip
);

router.post('/dicom/:checkUpId',
     uploadDicomFile.single("dicom"),
     uploadDicomToGoogleCloud,
     cleanupDICOM,
     handleAddDicomFile
);

router.delete('/dicom/:studyUid',
     handleDeleteDicomFile
);

router.get('/dicom',
     handlePreviewDicomFile
);

router.post("/upload/file",
     uploadPdf('pdf'),
     validateFilePresence,
     validateBody(labReportUploadSchema),
     handleUploadPDF
);

export default router;