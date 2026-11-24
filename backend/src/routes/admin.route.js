import {
    handleChangeStaffRole,
    handleStaffLookUp,
    handleRegisterStaffMember,
    handleChangeStaffDetails,
    handleGetAllStaffMembers,
    handleToggleStaffStatus,
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

import {
    handleCreateDoctor,
    handleGetDoctorDetails,
    handleUpdateDoctor
} from "../controllers/doctor.controller.js";

import {
    handleCreateLabTechnician,
    handleGetLabTechDetails,
    handleUpdateLabTechnician
} from "../controllers/labTechnician.controller.js";

import {
    handleGetUserId,
    handleGetUserById
} from "../controllers/user.controller.js";

import { authorize } from "../middlewares/authorize.middleware.js";
import { authenticate } from "../middlewares/authenticate.middleware.js";

import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import {
    getUserByUserId,
    getUserSchema
} from "../zodSchemas/user.schema.js";

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

import {
    createDoctorSchema,
    updateDoctorSchema
} from "../zodSchemas/doctor.schema.js";

import {
    createLabTechnicianSchema,
    updateLabTechnicianSchema
} from "../zodSchemas/labTech.schema.js";

import express from "express";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF"], ["HOSPITAL_ADMIN"]));

router.get("/user",
    parseIncomingReq(getUserSchema),
    handleGetUserId
);

router.get("/user/:userId",
    parseIncomingReq(getUserByUserId),
    handleGetUserById
)

router.get("/staff",
    parseIncomingReq(getAllSchema),
    handleGetAllStaffMembers
);

router.post("/staff/:userId",
    parseIncomingReq(registrationSchema),
    handleRegisterStaffMember
);

router.route("/staff/:staffId")
    .get(
        parseIncomingReq(staffIdSchema),
        handleStaffLookUp
    )
    .patch(
        parseIncomingReq(detailChangeSchema),
        handleChangeStaffDetails
    );

router.patch("/staff/:staffId/role",
    parseIncomingReq(roleChangeSchema),
    handleChangeStaffRole
);

router.patch("/staff/:staffId/status",
    parseIncomingReq(toggleStaffStatusSchema),
    handleToggleStaffStatus
);

router.route("/receptionist/:staffId")
    .get(
        parseIncomingReq(staffIdSchema),
        handleGetReceptionistDetails
    )
    .post(
        parseIncomingReq(createReceptionistSchema),
        handleCreateReceptionist
    );

router.patch("/receptionist/:receptionistId",
    parseIncomingReq(updateReceptionistSchema),
    handleUpdateReceptionist
);

router.route("/:staffId/nurse")
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

router.route("/:staffId/doctor")
    .get(
        parseIncomingReq(staffIdSchema),
        handleGetDoctorDetails
    )
    .post(
        parseIncomingReq(createDoctorSchema),
        handleCreateDoctor
    )
    .patch(
        parseIncomingReq(updateDoctorSchema),
        handleUpdateDoctor
    );

router.route("/:staffId/lab-technician")
    .get(
        parseIncomingReq(staffIdSchema),
        handleGetLabTechDetails
    )
    .post(
        parseIncomingReq(createLabTechnicianSchema),
        handleCreateLabTechnician
    )
    .patch(
        parseIncomingReq(updateLabTechnicianSchema),
        handleUpdateLabTechnician
    )


export default router;