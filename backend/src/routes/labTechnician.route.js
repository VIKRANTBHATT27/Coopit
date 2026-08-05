import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import { uploadDicom, uploadAvatar } from "../middlewares/multer.middleware.js";
import express from "express";
import {
     handleAddLabTech,
     handleGetLabTechnician,
     handleUpdateLabTechnician,
     handleUploadAvatar,
     handleDicomZip,
     handleDeleteAvatar,
     handleUploadReport,
     handleUploadDicomStudy,
     handleGetReport,
     handleGetAllLabReports,
     handlePreviewDicomStudy,
     handleGetAllDicomStudies
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
import { dicomZIPSchema, dicomUploadSchema } from "../zodSchemas/dicom.schema.js";

import { validateData } from "../middlewares/dbCheck.middleware.js";
import { staffIdSchema } from "../zodSchemas/staff.schema.js";
import checkForAuthentication from "../middlewares/authenticate.middleware.js";
import checkForAuthorization from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.use(checkForAuthentication());
router.use(checkForAuthorization(['LAB_TECH']));

router.route('/:staffId')
     .get(
          parseIncomingReq(staffIdSchema),
          handleGetLabTechnician
     )
     .patch(
          parseIncomingReq(labTechinicianUpdateSchema),
          handleUpdateLabTechnician
     );

router.route('/avatar/:staffId')
     .post(
          uploadAvatar.single("avatar"),
          cleanupTempFiles,
          parseIncomingReq(labTechAvatarUploadSchema),
          uploadUserAvatar,
          handleUploadAvatar
     )
     .delete(
          parseIncomingReq(staffIdSchema),
          handleDeleteAvatar
     );


router.get('/dicom-studies/:dicomStudyId',
     handlePreviewDicomStudy
);

router.route('/checkups/:checkUpId/dicom')
     .get(
          parseIncomingReq(checkupIdSchema),
          handleGetAllDicomStudies
     )
     .post(
          uploadDicom.single("dicom"),
          cleanupTempFiles,
          parseIncomingReq(dicomUploadSchema),
          validateData,
          uploadDicomToGoogleCloud,
          handleUploadDicomStudy
     );

router.post('/checkups/:checkUpId/dicom-zip',
     uploadDicom.single("dicom"),
     cleanupTempFiles,
     parseIncomingReq(dicomZIPSchema),
     validateData,
     extractAndUploadDicoms,
     handleDicomZip
);

// const cron = require('node-cron');

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