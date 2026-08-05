import express from "express";

import { uploadAvatar, uploadImg } from "../middlewares/multer.middleware.js";
import cleanupTempFiles from "../middlewares/deleteLocalFile.middleware.js";

import {
     handleUploadAvatar,
     handleDeleteAvatar,
     handleCreateReceptionist,
     handleAddPatientVisit,
     handleUpdateReceptionist,
     handleGetReceptionist,
} from "../controllers/receptionist.controller.js";

import {
     receptionistSignupSchema,
     receptionistUpdateSchema,
     receptionistAvatarUploadSchema
} from "../zodSchemas/receptionist.schema.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import uploadUserAvatar from "../middlewares/cloudinary.middleware.js";

import { emailIdSchema } from "../zodSchemas/user.schema.js";
import { handleGetUserLookup } from "../controllers/user.controller.js";

import { patientIdSchema, patientSchema } from "../zodSchemas/patient.schema.js";
import { handleCreatePatient } from "../controllers/patient.controller.js"

import { handleCreatePatientVisit, handleGetAllNurse } from "../controllers/visit.controller.js";

import { checkForAuthentication, checkForAuthorization } from "../middlewares/authCheck.middleware.js";

import { patientVisitSchema } from "../zodSchemas/visit.schema.js";
import { staffIdSchema } from "../zodSchemas/staff.schema.js";

const router = express.Router();

router.post("/",
     validateBody(receptionistSignupSchema),
     handleCreateReceptionist
);

router.use(checkForAuthentication());
router.use(checkForAuthorization(['receptionist']));




router.post("/users/lookup",
     parseIncomingReq(emailIdSchema),
     handleGetUserLookup
);

router.post("/patients/:userId",
     validateBody(patientSchema),
     handleCreatePatient
);

//    .patch(
//           validateBody(patientUpdationSchema),
//           handleUpdatePatient
//      );



router.patch("/:staffId",
     parseIncomingReq(receptionistUpdateSchema),
     handleUpdateReceptionist
);

router.route('/avatar/:staffId')
     .post(
          uploadAvatar.single("avatar"),
          cleanupTempFiles,
          parseIncomingReq(receptionistAvatarUploadSchema),
          uploadUserAvatar,
          handleUploadAvatar
     )
     .delete(
          parseIncomingReq(staffIdSchema),
          handleDeleteAvatar
     );

router.get("/nurses",
     handleGetAllNurse
);

router.post("/patients/:patientId/visits",
     parseIncomingReq(patientVisitSchema),
     handleCreatePatientVisit
);


export default router;