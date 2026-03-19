import express from "express";
import {
     handleAddHospital,
     handleUpdateHospital,
     handleAddHospitalPhone
} from "../controllers/hospital.js";

const router = express.Router();

router.post('/add', handleAddHospital);
router.patch('/update', handleUpdateHospital);
router.patch('/add-phone', handleAddHospitalPhone);

export default router;