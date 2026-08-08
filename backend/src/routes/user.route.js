import {
     handleForgotPassword,
     handleResetPassword,
     handleUpdatePassword,
     handleUpdatePhone,
     handleUserLogin,
     handleUserSignup,
     handleVerifyEmailId,
     handleVerifyUserLogin,
} from "../controllers/user.controller.js";

import {
     changePhoneSchema,
     createUserSchema,
     forgotPasswordSchema,
     loginSchema,
     passwordResetSchema,
     signUpSchema,
     updatePasswordSchema,
     updatePhoneSchema,
     updateProfileSchema,
     userUpdationSchema,
     verificationSchema
} from "../zodSchemas/user.schema.js";

import { checkForAuthentication } from "../middlewares/authenticate.middleware.js";
import { checkForAuthorization } from "../middlewares/authorize.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import phoneLimiter from "../middlewares/rateLimiter.middleware.js";

import express from "express";
const router = express.Router();

router.post('/signup',
     parseIncomingReq(createUserSchema),
     handleUserSignup
);

router.post('/verify/emailId',
     parseIncomingReq(verificationSchema),
     handleVerifyEmailId
);

router.post('/login',
     parseIncomingReq(loginSchema),
     handleUserLogin
);
router.post('/verify/login',
     parseIncomingReq(verificationSchema),
     handleVerifyUserLogin
);

router.patch("/auth/change-phone",
     phoneLimiter,
     parseIncomingReq(changePhoneSchema),
     handleChangePhone
);

router.post("/auth/forgot-password",
     parseIncomingReq(forgotPasswordSchema),
     handleForgotPassword
);

router.post("auth/reset-password",
     parseIncomingReq(passwordResetSchema),
     handleResetPassword
)

router.use(checkForAuthentication());
router.use(checkForAuthorization(["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"]));

router.post('/logout', handleLogout);


//why this route ?
// router.post("/check/:Id", handleGetUser);

// router => /user
// router.route('/')
// .get(handleGetUserFromToken)


router.patch("/profile",
     parseIncomingReq(updateProfileSchema),
     handleUpdateProfile
);

router.patch("/phone",
     parseIncomingReq(updatePhoneSchema),
     handleUpdatePhone
);

router.patch("/password",
     parseIncomingReq(updatePasswordSchema),
     handleUpdatePassword
);

export default router;