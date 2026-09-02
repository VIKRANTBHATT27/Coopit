import express from "express";
import {validateBody} from "../middlewares/validateReq.middleware.js";

import {
     handleAddHospital,
     handleUpdateHospital,
     handleAddHospitalPhone
} from "../controllers/hospital.js";

import {
     hospitalSchema,
     phoneNumberSchema,
     hospitalUpdateSchema,
} from "../zodSchemas/hospital.schema.js";

const router = express.Router();

// router.post('/add',
//      validateBody(hospitalSchema),
//      handleAddHospital
// );
// router.patch('/update',
//      validateBody(hospitalUpdateSchema),
//      handleUpdateHospital
// );
// router.patch('/update-phone',
//      validateBody(phoneNumberSchema),
//      handleAddHospitalPhone
// );

export default router;