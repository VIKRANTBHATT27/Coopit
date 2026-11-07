import { uploadAvatar } from "../middlewares/multer.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";

import {
    handleUploadPatientAvatar,
    handleDeleteAvatar,
    handlePatientLookup,
} from "../controllers/patient.controller.js";
import { handleGetTimelines } from "../controllers/timeline.controller.js";
import { handleGetMedicalCase } from "../controllers/medicalCase.controller.js";
import { handleGetCheckups } from "../controllers/checkup.controller.js";
import { handleGetAllDicomStudies } from "../controllers/dicom.controller.js";
import { handleGetAllLabReports } from "../controllers/labReport.controller.js";

import { avatarUploadSchema } from "../zodSchemas/patient.schema.js";
import { userIdSchema } from "../zodSchemas/user.schema.js";
import { medicalCaseIdSchema } from "../zodSchemas/medicalCase.schema.js";
import { checkupIdSchema } from "../zodSchemas/checkup.schema.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize('PATIENT'));

router.get("/:userId",
    parseIncomingReq(userIdSchema),
    handlePatientLookup
);

router.route('/avatar')
    .post(
        uploadAvatar.single("avatar"),
        cleanupTempFiles,
        parseIncomingReq(avatarUploadSchema),
        uploadUserAvatar,
        handleUploadPatientAvatar
    )
    .delete(handleDeleteAvatar);

router.get("/timeline",
    handleGetTimelines
);

router.get("/medical-case/:medicalCaseId",
    parseIncomingReq(medicalCaseIdSchema),
    handleGetMedicalCase
);

router.get("/checkups/:medicalCaseId",
    parseIncomingReq(medicalCaseIdSchema),
    handleGetCheckups
);

router.get("/dicom-study/:checkupId",
    parseIncomingReq(checkupIdSchema),
    handleGetAllDicomStudies
);

router.get("/report/:checkupId",
    parseIncomingReq(checkupIdSchema),
    handleGetAllLabReports
);

export default router;