import { checkEmployeeId } from "../zodSchemas/staff.schema.js";

import {
     handleGetStaffMember
} from "../controllers/staff.controller.js";

import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF"]));

router.get("/staff/:employeeId",
     parseIncomingReq(checkEmployeeId),
     handleGetStaffMember
);

export default router;