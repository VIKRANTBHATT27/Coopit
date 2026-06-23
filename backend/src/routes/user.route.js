import express from "express";
import { validateBody } from "../middlewares/validateReq.middleware.js";

import {
     handleUserLogin,
     handleUserSignup,
     handleVerifyEmailId,
     handleVerifyUserLogin,
} from "../controllers/user.controller.js";

import {
     loginSchema,
     signUpSchema,
     verificationSchema
} from "../zodSchemas/user.schema.js";

import { checkForAuthentication } from "../middlewares/authCheck.middleware.js";

const router = express.Router();

router.post('/signup',
     validateBody(signUpSchema),
     handleUserSignup
);

router.post('/verify/emailId',
     validateBody(verificationSchema),
     handleVerifyEmailId
);

router.post('/login',
     validateBody(loginSchema),
     handleUserLogin
);
router.post('/verify/login',
     validateBody(verificationSchema),
     handleVerifyUserLogin
);

router.post('/otp-login',
     validateBody(checkOTPSchema),
     handleUserLoginCheckOtp
);
router.post('/logout', handleLogout);

router.use(checkForAuthentication());

//why this route ?
// router.post("/check/:Id", handleGetUser);

router.get('/getUser',
     handleGetUserFromToken
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