import express from "express";
import { handlePatientLogin, handlePatientSignup} from "../controllers/patient.js";

const router = express.Router();

router.post('/signup', handlePatientSignup);
router.post('/login', handlePatientLogin);


export default router;