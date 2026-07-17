import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import { uploadDicom, uploadImg } from "../middlewares/multer.middleware.js";
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
     handleAddDicomFile,
     handleGetPDF,
     handleGetAllLabReports
} from "../controllers/labTechnician.controller.js";

import { extractAndUploadDicoms, uploadDicomToGoogleCloud } from "../middlewares/dicom.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import {
     labTechSchema,
     labTechiUpdateSchema,
     labTechImgUploadSchema
} from "../zodSchemas/labTech.schema.js";
import { checkUpIdSchema } from "../zodSchemas/checkUp.schema.js";
import { uploadReport } from "../middlewares/multer.middleware.js";
import { labReportIdSchema, labReportUploadSchema } from "../zodSchemas/labReport.schema.js";
import { dicomZIPSchema } from "../zodSchemas/dicom.schema.js";

import { validateData } from "../middlewares/dbCheck.middleware.js";

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
router.post('/dicom/zip/:checkUpId',
     uploadDicom.single("dicom"),
     cleanupTempFiles,
     parseIncomingReq(dicomZIPSchema),
     validateData,
     extractAndUploadDicoms,
     handleDicomZip
);

router.post('/dicom/:checkUpId',
     uploadDicom.single("dicom"),
     uploadDicomToGoogleCloud,
     cleanupDICOM,
     handleAddDicomFile
);

// router.delete('/dicom/:studyUid',
//      handleDeleteDicomFile
// );


router.get('/dicom/:dicomFileId',
     handlePreviewDicomFile
);


router.route(
     '/report/:checkUpId',
     validateParams(checkUpIdSchema)
)
     .get(
          handleGetAllLabReports
     )
     .post(
          uploadReport('report'),
          validateFilePresence,
          validateBody(labReportUploadSchema),
          handleUploadPDF
     );

router.get('/report/:labReportId',
     validateParams(labReportIdSchema),
     handleGetPDF
);

export default router;