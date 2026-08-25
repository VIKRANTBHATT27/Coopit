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
    handleGetReceptionistDetails,
    handleUpdateReceptionist
} from "../controllers/receptionist.controller.js";

import {
    handleGetNurseDetails,
    handleCreateNurse,
    handleUpdateNurse
} from "../controllers/nurse.controller.js";

import { handleGetUser } from "../controllers/user.controller.js";
import { getUserSchema } from "../zodSchemas/user.schema.js";

import {
    staffIdSchema,
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

import {
    createNurseSchema,
    nurseUpdationSchema
} from "../zodSchemas/nurse.schema.js";

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
        parseIncomingReq(staffIdSchema),
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
    .get(
        parseIncomingReq(staffIdSchema),
        handleGetReceptionistDetails
    )
    .post(
        parseIncomingReq(createReceptionistSchema),
        handleCreateReceptionist
    )
    .patch(
        parseIncomingReq(updateReceptionistSchema),
        handleUpdateReceptionist
    );

router.route("/nurse/:staffId")
    .get(
        parseIncomingReq(staffIdSchema),
        handleGetNurseDetails
    )
    .post(
        parseIncomingReq(createNurseSchema),
        handleCreateNurse
    )
    .patch(
        parseIncomingReq(nurseUpdationSchema),
        handleUpdateNurse
    );

export default router;