import express from "express";
import {
     handleAddStaffMember,
     handleUpdateStaffMember
} from "../controllers/staff.js";

const router = express.Router();

router.post("/add-staff-member", handleAddStaffMember);
router.patch("/update-staff-member", handleUpdateStaffMember);

export default router;