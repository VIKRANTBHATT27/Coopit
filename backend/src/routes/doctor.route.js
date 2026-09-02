
import { uploadImg } from "../middlewares/multer.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";

import {
    handleGetDoctor,
    handleUploadImg,
    handleDeletePfpImage,
    handleAddDoctor,
    handleUpdateDoctor,
    handleGetDiseaseCase,
    handleApproveDiseaseCase,
    handleGetAllCheckUps,
    handlePreviewDicomFile,
    handleUploadAvatar,
    handleDeleteAvatar,
    handleGetDoctorDetails,
} from "../controllers/doctor.controller.js";

import { validateBody, validateParams } from "../middlewares/validateReq.middleware.js";
import { doctorIdSchema, staffIdSchema, doctorSchema, doctorUpdateSchema, emailIdSchema, avatarUploadSchema } from "../zodSchemas/doctor.schema.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";

import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import express from "express";
import { handleApproveMedicalCase, handleGetAllMedicalCases, handleGetDoctorMedicalCases } from "../controllers/medicalCase.controller.js";
import { medicalCaseIdSchema } from "../zodSchemas/medicalCase.schema.js";
import { handleGetCheckups } from "../controllers/checkup.controller.js";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF", "DOCTOR"]));

// router.post("/add-doctor",
//      validateBody(doctorSchema),
//      handleAddDoctor
// );

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

router.post('/medical-case/:medicalCaseId/approve',
    parseIncomingReq(medicalCaseIdSchema),
    handleApproveMedicalCase
);

router.get('/checkups/:medicalCaseId',
    parseIncomingReq(medicalCaseIdSchema),
    handleGetCheckups
);

router.get('/preview-dicom-file',
    handlePreviewDicomFile
);

// export const handleDocumentUpload = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ err: "no data is provided!" });

//      try {
//           const patientId = req.params.id;

//           const patient = await patientModel.findById(patientId);

//      } catch (error) {
//           console.log(err);
//           return null;
//      }
// };

router.post("/view/dicom-file/:checkUpId",
    validateParams(checkUpIdSchema),
    handleViewDicomFile
);

export default router;