import express from "express";
import { staffSchema, checkEmployeeId } from "../zodSchemas/staff.schema.js";

import {validateBody, validateParams} from "../middlewares/validateReq.middleware.js";

import {
     handleCreateStaffMember,
     handleGetStaffMember,
     handleUpdateStaffMember
} from "../controllers/staff.controller.js";


const router = express.Router();

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