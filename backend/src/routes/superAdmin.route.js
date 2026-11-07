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
    toggleHospitalStatusSchema,
    promoteStaffSchema,
    degradeStaffSchema,
} from "../zodSchemas/hospital.schema.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize } from "../middlewares/authorize.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

router.get("/",
    handleGetAllHospitals
);

router.post("/",
    parseIncomingReq(hospitalRegistrationSchema),
    handleRegisterHospital
);

router.get("/:hospitalId",
    parseIncomingReq(hospitalIdSchema),
    handleGetHospitalDetails
)

router.post("/:hospitalId",
    parseIncomingReq(updateHospitalSchema),
    handleUpdateHospital
);

router.patch("/:hospitalId/status",
    parseIncomingReq(toggleHospitalStatusSchema),
    handleToggleHospitalStatus
);

router.route("/:hospitalId/admin/:adminId")
    .post(
        parseIncomingReq(promoteStaffSchema),
        handlePromoteToAdmin
    )
    .delete(
        parseIncomingReq(degradeStaffSchema),
        handleRemoveAdmin
    );

// extra optional feature
// .patch(
//     parseIncomingReq(),
//     handleInactiveAdmin
// )

export default router;