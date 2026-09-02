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
     handleGetNurseMedicalCases,
     handleChangeNurse,
     handleChangeDoctor,
     handleAssignMedicalCase,
} from "../controllers/medicalCase.controller.js";

import {
     handleGetPatientTimeline,
     handleCreatePatientTimeline,
     handleUpdatePatientTimeline,
     handleGetPatientTimeline,
} from "../controllers/timeline.controller.js";

import {
     handleViewDicom
} from "../controllers/dicom.controller.js";


import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import { uploadAvatar } from "../middlewares/multer.middleware.js";

import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";


import { getStaffByDept } from "../zodSchemas/staff.schema.js";
import { checkUpIdSchema, createCheckupSchema, updateCheckupSchema } from "../zodSchemas/checkup.schema.js";
import { avatarUploadSchema, getNursesQuerySchema } from "../zodSchemas/nurse.schema.js";
import { updatePatientSchema } from "../zodSchemas/patient.schema.js";

import {
     assignMedicalCase,
     changeDoctorSchema,
     changeNurseSchema,
     createmedicalCaseIdSchema,
     medicalCaseIdSchema,
     medicalCaseUpdationSchema
} from "../zodSchemas/medicalCase.schema.js";

import {
     createPatientTimelineSchema,
     getTimelineSchema,
     updateTimelineSchema,
} from "../zodSchemas/timeline.schema.js";

import express from "express";
import { handleAssignCheckup, handleCreateCheckup, handleGetCheckups, handleUpdateCheckup } from "../controllers/checkup.controller.js";
import { handleGetLabTechByDept } from "../controllers/labTechnician.controller.js";
const router = express.Router();

router.use(authenticate);

router.get('/department',
     authorize(["STAFF"], ["RECEPTIONIST", "NURSE", "ADMIN"]),
     parseIncomingReq(getNursesQuerySchema),
     handleGetNursesByDept
);

router.use(authorize(["STAFF"], ["NURSE"]));

router.get("/",
     handleGetNurse
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
          handleGetNurseMedicalCases
     )
     .post(
          parseIncomingReq(createmedicalCaseIdSchema),
          handleCreateMedicalCase
     );

router.patch("/medical-case/:medicalCaseId",
     parseIncomingReq(medicalCaseUpdationSchema),
     handleUpdateMedicalCase
);

router.patch(
     "/assign-medical-case/:medicalCaseId/doctor/:doctorId",
     parseIncomingReq(assignMedicalCase),
     handleAssignMedicalCase
);

router.get("/nurses",
     parseIncomingReq(getStaffByDept),
     handleGetNursesByDept
);

router.get("/doctors",
     parseIncomingReq(getStaffByDept),
     handleGetDoctorsByDept
);

router.get("/lab-technicians",
     parseIncomingReq(getStaffByDept),
     handleGetLabTechByDept
)

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

router.patch(
     "/assign-check-up/:checkupId/lab-tech/;:labTechId",
     parseIncomingReq(assignLabTechSchema),
     handleAssignCheckup
);

// frontend form should uses a standard browser date picker 
// (<input type="date" />), YYYY-MM-DD format 


// add emergency situation for other timeline events and medical cases analysis by nurse / doctor => log it

router.route("/timeline/:patientId/medical-case/:medicalCaseId")
     .get(
          parseIncomingReq(getTimelineSchema),
          handleGetPatientTimeline      //refine this route if needed
     )
     .post(
          parseIncomingReq(createPatientTimelineSchema),
          handleCreatePatientTimeline
     )
     .patch(
          parseIncomingReq(updateTimelineSchema),
          handleUpdatePatientTimeline
     );


router.get("/view/dicom-file/:checkUpId",
     validateParams(checkUpIdSchema),
     handleViewDicom
);

export default router;