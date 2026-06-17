import express from "express";
import {validateBody} from "../middlewares/validateReq.middleware.js";

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
} from "../controllers/user.controller.js";

import {
     emailIdSchema,
     loginSchema,
     signUpSchema,
     checkOTPSchema,
     userUpdationSchema,
     updatePasswordSchema,
} from "../zodSchemas/user.schema.js";

const router = express.Router();

router.post('/signup',
     validateBody(signUpSchema),
     handleUserSignup
);

router.post('/login',
     validateBody(loginSchema),
     handleUserLogin
);
router.post('/send-otp',
     validateBody(emailIdSchema),
     handleUserSendOtp
);
router.post('/otp-login',
     validateBody(checkOTPSchema),
     handleUserLoginCheckOtp
);
router.post('/logout', handleLogout);

router.post("/check", handleGetUserFromToken);

router.get('/getUser/:Id',
     handleGetUser
);

router.patch('/updateUser',
     validateBody(userUpdationSchema),
     handleUserUpdate
);
router.patch('/pass-reset',
     validateBody(updatePasswordSchema),
     handleUserPasswordReset
);

export default router;