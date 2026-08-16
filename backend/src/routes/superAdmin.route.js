
import authenticate from "../middlewares/authenticate.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(['SUPER_ADMIN']));

router.post("/register-hospital",
);

router.post("/register-hospital-admin",
);

export default router;