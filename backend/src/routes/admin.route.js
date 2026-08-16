import {
    handleChangeStaffRole,
    handleStaffLookUp,
    handleRegisterStaff,
    handleInactiveStaff,
    handleChangeStaffDetails,
    handleReactivateStaff,
    handleGetAllStaff
} from "../controllers/admin.controller.js";

import {
    staffIdSchema,
    employeeIdSchema,
    staffLookUpSchema,
    staffRoleChangeSchema,
    staffDetailChangeSchema,
    staffRegistrationSchema
} from "../zodSchemas/staff.schema.js";

import checkForAuthentication from "../middlewares/authenticate.middleware.js";
import checkForAuthorization from "../middlewares/authorize.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import express from "express";
const router = express.Router();

router.use(checkForAuthentication);
router.use(checkForAuthorization(["HOSPITAL_ADMIN"]));

router.get("/staff",
    parseIncomingReq(staffLookUpSchema),
    handleGetAllStaff
);

router.post("/register-staff",
    parseIncomingReq(staffRegistrationSchema),
    handleRegisterStaff
);

router.route("/staff/:staffId")
    .get(
        parseIncomingReq(staffIdSchema),
        handleStaffLookUp
    )
    .patch(
        parseIncomingReq(staffDetailChangeSchema),
        handleChangeStaffDetails
    );


router.patch("/staff/:staffId/role",
    parseIncomingReq(staffRoleChangeSchema),
    handleChangeStaffRole
);

router.post("/staff/:staffId/reactivate",
    parseIncomingReq(staffIdSchema),
    handleReactivateStaff
);

router.post("/staff/:staffId/deactivate",
    parseIncomingReq(staffIdSchema),
    handleInactiveStaff
);


export default router;