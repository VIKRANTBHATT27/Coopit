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
    patientVisitSchema,
    visitIdSchema
} from "../zodSchemas/visit.schema.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF"], ["RECEPTIONIST"]));

router.get("/receptionist",
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

router.post("/patient/:patientId/visit",
    parseIncomingReq(patientVisitSchema),
    handleCreatePatientVisit
);

router.get("/visit",
    handleGetAllVisit
);

router.patch("/visit/:visitId/nurse/:nurseId",
    parseIncomingReq(changeVisitNurseSchema),
    handleChangeNurse
);

router.patch("/visit/:visitId",
    parseIncomingReq(visitIdSchema),
    handleCloseVisit
);

export default router;