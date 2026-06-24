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
     userUpdationSchema,
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

router.use(checkForAuthentication());
router.use(checkForAuthentication(["PATIENT", "DOCTOR", "RECEPTIONIST", "NURSE", "LAB_TECH"]));

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