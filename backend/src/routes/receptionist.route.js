import { uploadAvatar } from "../middlewares/multer.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";

import {
    handleCreatePatientVisit,
    handleCloseVisit,
    handleGetAllVisit,
    handleChangeNurse
} from "../controllers/visit.controller.js";

import {
    handleUploadAvatar,
    handleDeleteAvatar,
    handleGetReceptionist,
} from "../controllers/receptionist.controller.js";

import {
    handleCreatePatient,
    handlePatientLookup
} from "../controllers/patient.controller.js"

import { handleGetUserLookup } from "../controllers/user.controller.js";

import { avatarUploadSchema } from "../zodSchemas/receptionist.schema.js";
import { createPatientSchema } from "../zodSchemas/patient.schema.js";
import {
    emailIdSchema,
    userIdSchema
} from "../zodSchemas/user.schema.js";
import {
    changeVisitNurseSchema,
    getAllVisitSchema,
    patientVisitSchema,
    visitIdSchema
} from "../zodSchemas/visit.schema.js";

import express from "express";
import { getNursesQuerySchema } from "../zodSchemas/nurse.schema.js";
import { handleGetNursesByDept } from "../controllers/nurse.controller.js";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF"], ["RECEPTIONIST"]));

router.get("/me",                 //might remove this route => i think it serve no purpose
    handleGetReceptionist
)

router.route('/avatar')
    .post(
        uploadAvatar.single("avatar"),
        cleanupTempFiles,
        parseIncomingReq(avatarUploadSchema),
        uploadUserAvatar,
        handleUploadAvatar
    )
    .delete(handleDeleteAvatar);

router.get("/users/lookup",
    parseIncomingReq(emailIdSchema),
    handleGetUserLookup
);

router.route("/patient/:userId")
    .get(
        parseIncomingReq(userIdSchema),
        handlePatientLookup
    )
    .post(
        parseIncomingReq(createPatientSchema),
        handleCreatePatient
    );

// apply pagination
router.get('/nurses',
    parseIncomingReq(getNursesQuerySchema),
    handleGetNursesByDept
);

router.post("/patient/:patientId/visit",
    parseIncomingReq(patientVisitSchema),
    handleCreatePatientVisit
);

router.get("/visit",
    parseIncomingReq(getAllVisitSchema),
    handleGetAllVisit
);

router.patch("/visit/:visitId/nurse/:nurseStaffId",
    parseIncomingReq(changeVisitNurseSchema),
    handleChangeNurse
);

router.patch("/visit/:visitId",
    parseIncomingReq(visitIdSchema),
    handleCloseVisit
);

export default router;