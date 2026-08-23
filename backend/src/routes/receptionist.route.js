import { uploadAvatar } from "../middlewares/multer.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";

import {
     handleUploadAvatar,
     handleDeleteAvatar,
     handleGetReceptionist,
} from "../controllers/receptionist.controller.js";


import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";

import { handleGetUserLookup } from "../controllers/user.controller.js";
import { handleCreatePatient } from "../controllers/patient.controller.js"
import { handleCreatePatientVisit } from "../controllers/visit.controller.js";
import { handleGetAllNurse } from "../controllers/nurse.controller.js";

import { emailIdSchema } from "../zodSchemas/user.schema.js";
import { patientVisitSchema } from "../zodSchemas/visit.schema.js";
import { createPatientSchema } from "../zodSchemas/patient.schema.js";
import { receptionistAvatarUploadSchema } from "../zodSchemas/receptionist.schema.js";

import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

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
          parseIncomingReq(receptionistAvatarUploadSchema),
          uploadUserAvatar,
          handleUploadAvatar
     )
     .delete(handleDeleteAvatar);

router.get("/users/lookup",
     parseIncomingReq(emailIdSchema),
     handleGetUserLookup
);

router.post("/patient/:userId",
     parseIncomingReq(createPatientSchema),
     handleCreatePatient
);

router.post("/patients/:patientId/visits",
     parseIncomingReq(patientVisitSchema),
     handleCreatePatientVisit
);

router.get("/nurses",
     handleGetAllNurse
);


export default router;