import {
    handleChangePhone,
    handleForgotPassword,
    handleLogout,
    handleResetPassword,
    handleUpdatePassword,
    handleUpdatePhone,
    handleUpdateProfile,
    handleUserLogin,
    handleUserSignup,
    handleVerifyEmailId,
    handleVerifyUserLogin,
} from "../controllers/user.controller.js";

import {
    changePhoneSchema,
    createUserSchema,
    emailIdSchema,
    loginSchema,
    passwordResetSchema,
    updatePasswordSchema,
    updatePhoneSchema,
    updateProfileSchema,
    verificationSchema
} from "../zodSchemas/user.schema.js";

import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

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
    parseIncomingReq(emailIdSchema),
    handleForgotPassword
);

router.post("/auth/reset-password",
    parseIncomingReq(passwordResetSchema),
    handleResetPassword
);

router.use(authenticate);
router.use(authorize([
    "PATIENT",
    "STAFF",
    "SUPER-ADMIN",
]));

router.post('/logout', handleLogout);

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