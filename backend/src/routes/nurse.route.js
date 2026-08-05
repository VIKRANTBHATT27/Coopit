import express from "express";

import {
     handleCreateNurse,
     handleGetNurse,
     handleUpdateNurse,
     handleUploadImg,
     handleDeleteUploadedImg,
} from "../controllers/nurse.controller.js";

import {
     handleCreateMedicalCase,
     handleUpdateMedicalCase,
     handleGetAllMedicalCase,
} from "../controllers/medicalCase.controller.js";

import {
     validateParams,
     validateQuery,
     validateBody
} from "../middlewares/validateReq.middleware.js";

import {
     medicalCaseSchema,
     medicalCaseUpdationSchema
} from "../zodSchemas/medicalCase.schema.js";

import checkForAuthentication from "../middlewares/authenticate.middleware.js";
import checkForAuthorization from "../middlewares/authorize.middleware.js";

import { uploadImg } from "../middlewares/multer.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";




import {
     handleViewDicomFile
} from "../controllers/dicom.controller.js";

import {
     handleCreateNurse
} from "../controllers/nurse.controller.js";

import {
     handleAddNewEventData,
     handleGetPatientTimeline,
     handleDeleteTimelimeEvent,
     handleCreatePatientTimeline,
     handleUpdatePatientTimeline,
} from "../controllers/timelineEvent.controller.js";



import {
     checkUpIdSchema
} from "../zodSchemas/checkUp.schema.js";

import {
     nurseSchema,
     nurseUpdationSchema
} from "../zodSchemas/nurse.schema.js";

import {
     addNewEventDataSchema,
     checkpatientIdSchema,
     checkTimelineEventIdSchema,
     createPatientTimelineSchema,
} from "../zodSchemas/timelineEvent.schema.js";

const router = express.Router();

router.use(checkForAuthentication());
router.use(checkForAuthorization(['NURSE']));

router.post("/",

);

router.route('/')
     .get( handleGetNurse )
     .post(
          validateBody(nurseSchema),
          handleCreateNurse
     )
     .patch(
          validateBody(nurseUpdationSchema),
          handleUpdateNurse
     );

router.route('/profile-picture')
     .post(
          uploadImg.single("avatar"),
          cloudinary_pfpUploader,
          deleteLocalImgFile,
          handleUploadImg
     )
     .delete(

          handleDeleteUploadedImg
     );


router.route('/medical-case')
     .post(
          validateBody(createMedicalCaseSchema),
          handleCreateMedicalCase
     )
     .patch(
          validateBody(medicalCaseUpdationSchema),
          handleUpdateMedicalCase
     );


router.get('/medical-case/:timelineEventId',
     handleGetAllMedicalCase
);

router.route('/timeline-event',
     validateQuery(checkpatientIdSchema)
)
     .get(
          handleGetPatientTimeline
     )
     .post(
          validateBody(createPatientTimelineSchema),
          handleCreatePatientTimeline
     )

router.route('/timeline-event/:timelineEventId',
     validateParams(checkTimelineEventIdSchema)
)
     .patch(
          validateBody(addNewEventDataSchema),
          handleAddNewEventData
     )
     .delete(
          handleDeleteTimelimeEvent
     );

router.get("/view/dicom-file/:checkUpId",
     validateParams(checkUpIdSchema),
     handleViewDicomFile
);

export default router;