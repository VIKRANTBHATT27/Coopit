import express from "express";

import {
     handleAddNurse,
     handleGetNurse,
     handleUpdateNurse,
     handleUploadImg,
     handleDeleteUploadedImg
} from "../controllers/nurse.js";

const router = express.Router();

router.post("/add-nurse", handleAddNurse);
router.route("/:Id")
     .get(handleGetNurse)
     .post(handleUpdateNurse);

router.post("/upload-pfp-img", handleUploadImg);
router.post("/delete-pfp-Img", handleDeleteUploadedImg);

export default router;