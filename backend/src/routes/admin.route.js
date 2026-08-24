import {
    handleChangeRole,
    handleLookUp,
    handleRegister,
    handleChangeDetails,
    handleGetAll,
    handleToggleStatus,
} from "../controllers/admin.controller.js";

import {
    handleCreateReceptionist,
    handleUpdateReceptionist
} from "../controllers/receptionist.controller.js";

import { handleGetUser } from "../controllers/user.controller.js";
import { getUserSchema } from "../zodSchemas/user.schema.js";

import {
    idSchema,
    getAllSchema,
    roleChangeSchema,
    registrationSchema,
    detailChangeSchema,
    toggleStaffStatusSchema,
} from "../zodSchemas/staff.schema.js";

import {
    createReceptionistSchema,
    updateReceptionistSchema
} from "../zodSchemas/receptionist.schema.js";

import authorize from "../middlewares/authorize.middleware.js";
import authenticate from "../middlewares/authenticate.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["HOSPITAL_ADMIN"]));

router.get("/user",
    parseIncomingReq(getUserSchema),
    handleGetUser
)

router.get("/staff",
    parseIncomingReq(getAllSchema),
    handleGetAll
);

router.post("/staff",
    parseIncomingReq(registrationSchema),
    handleRegister
);

router.route("/staff/:staffId")
    .get(
        parseIncomingReq(idSchema),
        handleLookUp
    )
    .patch(
        parseIncomingReq(detailChangeSchema),
        handleChangeDetails
    );

router.patch("/staff/:staffId/role",
    parseIncomingReq(roleChangeSchema),
    handleChangeRole
);

router.post("/staff/:staffId/status",
    parseIncomingReq(toggleStaffStatusSchema),
    handleToggleStatus
);

router.route("/receptionist/:staffId")
    .post(
        parseIncomingReq(createReceptionistSchema),
        handleCreateReceptionist
    )
    .patch(
        parseIncomingReq(updateReceptionistSchema),
        handleUpdateReceptionist
    );

export default router;