import express from "express";
import { validateBody, validateParams } from "../middlewares/validateReq.middleware.js";

import { uploadImg } from "../middlewares/multer.js";
import { deleteLocalImgFile } from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";

import {
     handleUploadPfp,
     handleDeletePfp,
     handleCreateReceptionist,
     handleAddPatientVisit,
     handleUpdateReceptionist,
     handleGetReceptionist,
} from "../controllers/receptionist.controller.js";

import {
     receptionistSignupSchema,
     receptionistUpdateSchema
} from "../zodSchemas/receptionist.schema.js";

import { emailIdSchema } from "../zodSchemas/user.schema.js";
import { handleGetUserLookup } from "../controllers/user.controller.js";

import { patientIdSchema, patientSchema } from "../zodSchemas/patient.schema.js";
import { handleCreatePatient } from "../controllers/patient.controller.js"

import { handleCreatePatientVisit, handleGetAllNurse } from "../controllers/visit.controller.js";

import { checkForAuthentication, checkForAuthorization } from "../middlewares/authCheck.middleware.js";

import { visitSchema } from "../zodSchemas/visit.schema.js";

const router = express.Router();

router.post("/",
     validateBody(receptionistSignupSchema),
     handleCreateReceptionist
);

router.use(checkForAuthentication());
router.use(checkForAuthorization(['receptionist']));

router.post("/users/lookup",
     validateBody(emailIdSchema),
     handleGetUserLookup
);

router.post("/patients/:userId",
     validateBody(patientSchema),
     handleCreatePatient
);

router.get("/nurses",
     handleGetAllNurse
);

router.post("/patients/:patientId/visits",
     validateParams(patientIdSchema),
     validateBody(visitSchema),
     handleCreatePatientVisit
);

router.patch("/:staffId/profile-picture",
     validateParams(receptionistSignupSchema.pick({ staffId: true })),
     uploadImg.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handleUploadPfp
);

router.delete("/:staffId/profile-picture",
     validateParams(receptionistSignupSchema.pick({ staffId: true })),
     handleDeletePfp
);

router.patch("/:staffId",
     validateParams(receptionistUpdateSchema.pick({ staffId: true })),
     handleUpdateReceptionist
);


export default router;