import { handleGetDoctorsByDept } from "../controllers/doctor.controller.js";

import {
     handleGetNurse,
     handleUploadAvatar,
     handleDeleteAvatar,
     handleGetNursesByDept,
} from "../controllers/nurse.controller.js";

import {
     handleGetPatients,
     handleUpdatePatient
} from "../controllers/patient.controller.js";

import {
     handleCreateMedicalCase,
     handleUpdateMedicalCase,
     handleGetAllMedicalCase,
     handleGetAllMedicalCases,
     handleChangeNurse,
     handleChangeDoctor,
} from "../controllers/medicalCase.controller.js";

import {
     handleAddNewEventData,
     handleGetPatientTimeline,
     handleDeleteTimelimeEvent,
     handleCreatePatientTimeline,
     handleUpdatePatientTimeline,
     handleGetPatientTimelines,
} from "../controllers/timelineEvent.controller.js";

import {
     handleViewDicomFile
} from "../controllers/dicom.controller.js";


import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import { uploadAvatar } from "../middlewares/multer.middleware.js";

import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";


import { getStaffByDept } from "../zodSchemas/staff.schema.js";
import { checkUpIdSchema, createCheckupSchema, updateCheckupSchema } from "../zodSchemas/checkup.schema.js";
import { avatarUploadSchema } from "../zodSchemas/nurse.schema.js";
import { patientIdSchema, updatePatientSchema } from "../zodSchemas/patient.schema.js";

import {
     changeDoctorSchema,
     changeNurseSchema,
     createmedicalCaseIdSchema,
     medicalCaseIdSchema,
     medicalCaseUpdationSchema
} from "../zodSchemas/medicalCase.schema.js";

import {
     addNewEventDataSchema,
     checkpatientIdSchema,
     checkTimelineEventIdSchema,
     createPatientTimelineSchema,
} from "../zodSchemas/timelineEvent.schema.js";

import express from "express";
import { handleCreateCheckup, handleGetCheckups, handleUpdateCheckup } from "../controllers/checkup.controller.js";
const router = express.Router();

router.use(authenticate);

router.get('/',
     authorize(["STAFF"], ["RECEPTIONIST", "NURSE", "ADMIN"]),
     parseIncomingReq(getNursesQuerySchema),
     handleGetNursesByDept
);

router.use(authorize(["STAFF"], ["NURSE"]));

router.route('/')
     .get(handleGetNurse);

router.route('/avatar')
     .post(
          uploadAvatar.single("avatar"),
          cleanupTempFiles,
          parseIncomingReq(avatarUploadSchema),
          uploadUserAvatar,
          handleUploadAvatar
     )
     .delete(handleDeleteAvatar);

router.get("/patients",
     handleGetPatients
);

router.patch("/patients/:patientId",
     parseIncomingReq(updatePatientSchema),
     handleUpdatePatient
);


router.route("/medical-case/:patientId")
     .get(
          parseIncomingReq(getmedicalCaseIdSchema),
          handleGetAllMedicalCases
     )
     .post(
          parseIncomingReq(createmedicalCaseIdSchema),
          handleCreateMedicalCase
     );

router.patch("/medical-case/:medicalCaseId",
     parseIncomingReq(medicalCaseUpdationSchema),
     handleUpdateMedicalCase
);

router.get("/nurses",
     parseIncomingReq(getStaffByDept),
     handleGetNursesByDept
);

router.get("/doctors",
     parseIncomingReq(getStaffByDept),
     handleGetDoctorsByDept
);

router.patch(
     "/medical-case/:medicalCaseId/nurse/:nurseId",
     parseIncomingReq(changeNurseSchema),
     handleChangeNurse
);

router.patch(
     "/medical-case/:medicalCaseId/doctor/:doctorId",
     parseIncomingReq(changeDoctorSchema),
     handleChangeDoctor
);

// medical-case route to add timeline

router.route("/check-up/:medicalCaseId")
     .get(
          parseIncomingReq(medicalCaseIdSchema),
          handleGetCheckups
     )
     .post(
          parseIncomingReq(createCheckupSchema),
          handleCreateCheckup
     );

router.patch("/check-up/:checkupId",
     parseIncomingReq(updateCheckupSchema),
     handleUpdateCheckup
);

// assignment route to labTechnician $push

// frontend form should uses a standard browser date picker 
// (<input type="date" />), YYYY-MM-DD format 

router.route("/timeline-event/:patientId")
     .get(
          parseIncomingReq(patientIdSchema),
          handleGetPatientTimelines
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