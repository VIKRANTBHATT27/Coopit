import express from "express";
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
     handleDeleteAvatar
} from "../controllers/doctor.controller.js";

import { validateBody, validateParams } from "../middlewares/validateReq.middleware.js";
import { doctorIdSchema, staffIdSchema, doctorSchema, doctorUpdateSchema, emailIdSchema, avatarUploadSchema } from "../zodSchemas/doctor.schema.js";
import { uploadAvatar } from "../middlewares/multer.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";

const router = express.Router();

router.post("/add-doctor",
     validateBody(doctorSchema),
     handleAddDoctor
);

router.route("/:staffId")
     .get(validateParams(staffIdSchema), handleGetDoctor)
     .post(
          validateParams(staffIdSchema),
          validateBody(doctorUpdateSchema),
          handleUpdateDoctor
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

router.get('/diseaseCase/:doctorId',
     validateParams(doctorIdSchema),
     handleGetDiseaseCase
);

router.post('/approve-diseaseCase/:Id',
     validateParams(diseaseIdSchema),
     handleApproveDiseaseCase
);

router.get('/get-allCheckups',
     validateParams(doctorIdSchema),
     handleGetAllCheckUps
);

router.get('/preview-dicomFiles',
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