import { staffSchema, checkEmployeeId } from "../zodSchemas/staff.schema.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import {
     handleCreateStaffMember,
     handleGetStaffMember,
     handleUpdateStaffMember
} from "../controllers/staff.controller.js";


import checkForAuthentication from "../middlewares/authenticate.middleware.js";
import checkForAuthorization from "../middlewares/authorize.middleware.js";

import express from "express";
const router = express.Router();

router.use(checkForAuthentication);
router.use(checkForAuthorization([
     "NURSE",
     "DOCTOR",
     "LAB_TECH",
     "RECEPTIONIST",
]));

router.post("/add-staff-member",
     validateBody(staffSchema),
     handleCreateStaffMember
);
router.patch("/update-staff-member",
     validateBody(staffSchema),
     handleUpdateStaffMember
);

router.get("/get-staff/:employeeId",
     validateParams(checkEmployeeId),
     handleGetStaffMember
);

export default router;