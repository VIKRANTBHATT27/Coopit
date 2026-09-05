import {
    handleGetLabTechnician,
    handleUploadAvatar,
    handleDeleteAvatar,
} from "../controllers/labTechnician.controller.js";

import {
    handleDicomZip,
    handlePreviewDicomStudy,
    handleUploadDicomStudy
} from "../controllers/dicom.controller.js";

import { handleGetReport, handleUploadReport } from "../controllers/labReport.controller.js";

import { extractAndUploadDicoms, uploadDicomToGoogleCloud } from "../middlewares/dicom.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import { uploadReport } from "../middlewares/multer.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import { uploadDicom, uploadAvatar } from "../middlewares/multer.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import { labReportIdSchema, labReportUploadSchema } from "../zodSchemas/labReport.schema.js";
import { dicomZIPSchema, dicomUploadSchema, dicomStudyIdSchema } from "../zodSchemas/dicom.schema.js";
import { labTechAvatarUploadSchema } from "../zodSchemas/labTech.schema.js";

import { validateCheckupId } from "../middlewares/dbCheck.middleware.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF"], ["LAB_TECH"]));

router.get("/",
    handleGetLabTechnician
);

router.route('/avatar')
    .post(
        uploadAvatar.single("avatar"),
        cleanupTempFiles,
        parseIncomingReq(labTechAvatarUploadSchema),
        uploadUserAvatar,
        handleUploadAvatar
    )
    .delete(handleDeleteAvatar);

router.get('/dicom-study/:dicomStudyId',
    parseIncomingReq(dicomStudyIdSchema),
    handlePreviewDicomStudy
);

router.post("/checkups/:checkUpId/dicom",
    uploadDicom.single("dicom"),
    cleanupTempFiles,
    parseIncomingReq(dicomUploadSchema),
    validateCheckupId,
    uploadDicomToGoogleCloud,
    handleUploadDicomStudy
);

router.post('/checkups/:checkupId/dicom-zip',
    uploadDicom.single("dicom"),
    cleanupTempFiles,
    parseIncomingReq(dicomZIPSchema),
    validateCheckupId,
    extractAndUploadDicoms,
    handleDicomZip
);

router.get('/report/:labReportId',
    parseIncomingReq(labReportIdSchema),
    handleGetReport
);

router.post("/checkups/:checkupId/report",
    uploadReport.single('report'),
    cleanupTempFiles,
    parseIncomingReq(labReportUploadSchema),
    handleUploadReport
);

export default router;