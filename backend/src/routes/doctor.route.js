import {
    handleUploadAvatar,
    handleDeleteAvatar,
    handleGetDoctorDetails,
} from "../controllers/doctor.controller.js";

import { handleApproveMedicalCase, handleGetDoctorMedicalCases } from "../controllers/medicalCase.controller.js";

import { handleGetCheckups } from "../controllers/checkup.controller.js";

import { uploadAvatar } from "../middlewares/multer.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import { medicalCaseIdSchema } from "../zodSchemas/medicalCase.schema.js";
import { staffIdSchema, avatarUploadSchema } from "../zodSchemas/doctor.schema.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF", "DOCTOR"]));

router.get("/:staffId",
    parseIncomingReq(staffIdSchema),
    handleGetDoctorDetails
);

router.route('/avatar')
    .post(
        uploadAvatar.single("avatar"),
        cleanupTempFiles,
        parseIncomingReq(avatarUploadSchema),
        uploadUserAvatar,
        handleUploadAvatar
    )
    .delete(handleDeleteAvatar);

router.get('/medical-cases',
    handleGetDoctorMedicalCases
);

router.patch('/medical-case/:medicalCaseId/approve',
    parseIncomingReq(medicalCaseIdSchema),
    handleApproveMedicalCase
);

router.get('/checkups/:medicalCaseId',
    parseIncomingReq(medicalCaseIdSchema),
    handleGetCheckups
);

export default router;