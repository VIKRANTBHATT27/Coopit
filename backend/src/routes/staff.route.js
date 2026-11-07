import { checkEmployeeId } from "../zodSchemas/staff.schema.js";

import { handleGetStaffMember } from "../controllers/staff.controller.js";

import { authenticate } from "../middlewares/authenticate.middleware.js";
import { authorize, guardCheckupAccess } from "../middlewares/authorize.middleware.js";
import parseIncomingReq from "../middlewares/parseReq.middleware.js";

import express from "express";
import { checkupIdSchema } from "../zodSchemas/checkup.schema.js";
import { handleGetAllLabReports, handleGetReport } from "../controllers/labReport.controller.js";
import { handleGetAllDicomStudies, handlePreviewDicomStudy } from "../controllers/dicom.controller.js";
import { labReportIdSchema } from "../zodSchemas/labReport.schema.js";
import { dicomStudyIdSchema } from "../zodSchemas/dicom.schema.js";
const router = express.Router();

router.use(authenticate);
router.use(authorize(["STAFF"]));

router.get("/staff/:employeeId",
    parseIncomingReq(checkEmployeeId),
    handleGetStaffMember
);

router.get("/checkups/:checkupId/report",
    parseIncomingReq(checkupIdSchema),
    guardCheckupAccess,
    handleGetAllLabReports
);

router.get("/checkups/:checkupId/dicom",
    parseIncomingReq(checkupIdSchema),
    guardCheckupAccess,
    handleGetAllDicomStudies
);

router.get('/report/:labReportId',
    authorize(["STAFF"], ["NURSE", "DOCTOR", "LAB_TECH"]),
    parseIncomingReq(labReportIdSchema),
    handleGetReport
);

router.get('/dicom-study/:dicomStudyId',
    authorize(["STAFF"], ["NURSE", "DOCTOR", "LAB_TECH"]),
    parseIncomingReq(dicomStudyIdSchema),
    handlePreviewDicomStudy
);

export default router;