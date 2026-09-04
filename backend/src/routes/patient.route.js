import express from "express";
import { uploadAvatar } from "../middlewares/multer.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";

import {
    handleGetPatient,
    handleUpdatePatient,
    handlePatientSignup,
    handleUploadPatientAvatar,
    handleDeleteAvatar,
} from "../controllers/patient.controller.js";

import {
    validateBody,
    validateParams
} from "../middlewares/validateReq.middleware.js";

import {
    patientSchema,
    userIdSchema,
    checkUpIdSchema,
    patientUpdationSchema,
} from "../zodSchemas/patient.schema.js";

import checkForAuthentication from "../middlewares/authenticate.middleware.js";

import checkForAuthorization from "../middlewares/authorize.middleware.js";


const router = express.Router();


router.use(checkForAuthentication);
router.use(checkForAuthorization('PATIENT'));

router.get("/:userId",
    validateParams(userIdSchema),
    handleGetPatient
);

router.route('/avatar/:userId',
    validateParams(userIdSchema),
)
    .patch(
        uploadAvatar.single("avatar"),
        uploadUserAvatar,
        deleteLocalImgFile,
        handleUploadPatientAvatar
    )
    .delete(
        handleDeleteAvatar
    );

// router.post('/:id/document-upload', handleDocumentUpload);

export default router;