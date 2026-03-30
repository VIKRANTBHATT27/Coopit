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
     handleGetDicomFiles,
     handleDeleteDicomFile,
     handlePreviewDicomFile,
} from "../controllers/labTechnician.js";

import { extractAndUploadDICOMs } from "../middlewares/extractAndUploadDicoms.js";
import validateBody from "../middlewares/validateBody.middleware.js";
import {
     labTechSchema,
     labTechiUpdateSchema,
     labTechImgUploadSchema
} from "../zodSchemas/labTech.schema.js";

const router = express.Router();

router.post('/create',
     validateBody(labTechSchema),
     handleAddLabTech
);

router.route('/:Id')
     .get(handleGetLabTech)
     .patch(validateBody(labTechiUpdateSchema), handleUpdateLabTech
     );

router.post('/upload-pfp',
     uploadImg.single("pfpImage"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     validateBody(labTechImgUploadSchema),
     handleUploadPfpImg
);

router.delete('/delete-pfp',
     handleDeletePfpImage
);

router.get('/get-dicom',
     handleGetDicomFiles
)

router.post('/upload-dicom/:checkUpId',
     uploadDicomFile.single("dicom"),
     extractAndUploadDICOMs,
     cleanupDICOMFile,
     handleAddDicomReport
);

router.delete('/delete-dicom/:studyUid',
     handleDeleteDicomFile
);

router.get('/preview-dicom',
     handlePreviewDicomFile
);


export default router;