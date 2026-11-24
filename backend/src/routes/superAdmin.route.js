import {
    handleGetAllHospitals,
    handleGetHospitalDetails,
    handleRegisterHospital,
    handleToggleHospitalStatus,
    handleUpdateHospital
} from "../controllers/hospital.controller.js";

import {
    handlePromoteToAdmin,
    handleRemoveAdmin,
} from "../controllers/superAdmin.controller.js";


import {
    hospitalIdSchema,
    updateHospitalSchema,
    hospitalRegistrationSchema,
    // toggleHospitalStatusSchema,
    hospitalIdAndStaffIdSchema
} from "../zodSchemas/hospital.schema.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

router.route("/")
    .get(handleGetAllHospitals)
    .post(
        parseIncomingReq(hospitalRegistrationSchema),
        handleRegisterHospital
    );

router.route("/:hospitalId")
    .get(
        parseIncomingReq(hospitalIdSchema),
        handleGetHospitalDetails
    )
    .patch(
        parseIncomingReq(updateHospitalSchema),
        handleUpdateHospital
    );

router.patch("/:hospitalId/status",
    parseIncomingReq(hospitalIdSchema),
    handleToggleHospitalStatus
);

router.patch("/:hospitalId/admin/:staffId/add",
    parseIncomingReq(hospitalIdAndStaffIdSchema),
    handlePromoteToAdmin
);

router.patch("/:hospitalId/admin/:staffId/remove",
    parseIncomingReq(hospitalIdAndStaffIdSchema),
    handleRemoveAdmin
);

// extra optional feature
// .patch(
//     parseIncomingReq(),
//     handleInactiveAdmin
// )

export default router;