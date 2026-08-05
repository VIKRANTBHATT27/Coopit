import {
     handleUserLogin,
     handleUserSignup,
     handleVerifyEmailId,
     handleVerifyUserLogin,
} from "../controllers/user.controller.js";

import {
     createUserSchema,
     loginSchema,
     signUpSchema,
     updatePhoneSchema,
     userUpdationSchema,
     verificationSchema
} from "../zodSchemas/user.schema.js";

import { checkForAuthentication } from "../middlewares/authenticate.middleware.js";
import { checkForAuthorization } from "../middlewares/authorize.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";
import updatePhoneLimiter from "../middlewares/rateLimiter.middleware.js";

import express from "express";
const router = express.Router();

router.post('/signup',
     parseIncomingReq(createUserSchema),
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

router.patch("/auth/update-phone",
     updatePhoneLimitermiter,
     validateBody(updatePhoneSchema),
     handleUpdatePhone
);

router.use(checkForAuthentication());
router.use(checkForAuthorization(["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"]));

router.post('/logout', handleLogout);


//why this route ?
// router.post("/check/:Id", handleGetUser);

// router => /user
router.route('/')
     .get(handleGetUserFromToken)
     .patch(
          validateBody(userUpdationSchema),
          handleUserUpdate
     );

export default router;