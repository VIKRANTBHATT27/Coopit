import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import { uploadDicom, uploadAvatar } from "../middlewares/multer.middleware.js";
import {
    handleAddLabTech,
    handleGetLabTechnician,
    handleUpdateLabTechnician,
    handleUploadAvatar,
    handleDeleteAvatar,
    handleUploadReport,
    handleGetReport,
    handleGetAllLabReports,
} from "../controllers/labTechnician.controller.js";

import { extractAndUploadDicoms, uploadDicomToGoogleCloud } from "../middlewares/dicom.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import {
    labTechSchema,
    labTechinicianUpdateSchema,
    labTechAvatarUploadSchema
} from "../zodSchemas/labTech.schema.js";
import { checkupIdSchema } from "../zodSchemas/checkup.schema.js";
import { uploadReport } from "../middlewares/multer.middleware.js";
import { labReportIdSchema, labReportUploadSchema } from "../zodSchemas/labReport.schema.js";
import { dicomZIPSchema, dicomUploadSchema, dicomStudyIdSchema } from "../zodSchemas/dicom.schema.js";

import { validateCheckupId } from "../middlewares/dbCheck.middleware.js";
import { staffIdSchema } from "../zodSchemas/staff.schema.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import authorize, { guardCheckupAccess } from "../middlewares/authorize.middleware.js";

import express from "express";
import { handleDicomZip, handleGetAllDicomStudies, handlePreviewDicomStudy, handleUploadDicomStudy } from "../controllers/dicom.controller.js";
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

router.route('/checkups/:checkUpId/dicom')
    .get(
        parseIncomingReq(checkupIdSchema),
        guardCheckupAccess,
        handleGetAllDicomStudies
    )
    .post(
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

// const cron = require('node-cron');
// for dicom auto delete if it stayed more than 50-60 days inactive or so

// // Schedules a task to run every minute
// cron.schedule('* * * * *', () => {
//   console.log('This task runs every minute:', new Date().toLocaleTimeString());
// });

router.get('/report/:labReportId',
    validateParams(labReportIdSchema),
    handleGetReport
);

router.route('/checkups/:checkUpId/report')
    .get(
        parseIncomingReq(checkUpIdSchema),
        handleGetAllLabReports
    )
    .post(
        uploadReport('report'),
        cleanupTempFiles,
        parseIncomingReq(labReportUploadSchema),
        handleUploadReport
    );

export default router;