import express from "express";
import { 
     handleLogout,
     handleGetUser,
     handleUserLogin,
     handleUserSignup,
     handleUserUpdate,
     handleUserSendOtp,
     handleUserLoginCheckOtp,
     handleUserPasswordReset,
     handleGetUserFromToken
} from "../controllers/user.js";

const router = express.Router();

router.post('/signup', handleUserSignup);
router.post('/login', handleUserLogin);
router.post('/send-otp', handleUserSendOtp);
router.post('/otp-login', handleUserLoginCheckOtp);
router.post('/logout', handleLogout);

router.post("/check", handleGetUserFromToken);

router.get('/getUser/:Id', handleGetUser);
router.patch('/updateUser', handleUserUpdate);
router.patch('/pass-reset', handleUserPasswordReset);

export default router;