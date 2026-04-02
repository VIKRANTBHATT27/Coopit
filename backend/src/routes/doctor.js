import express from "express";
import { uploadImg } from "../middlewares/multer.js";
import deleteLocalImgFile from "../middlewares/deleteLocalFile.js";
import cloudinary_pfpUploader from "../middlewares/cloudinaryImgUpload.js";
import {
     handleGetDoctor,
     handleUploadImg,
     handleDeletePfpImage,
     handleAddDoctor,
     handleUpdateDoctor,
     handleGetDiseaseCase,
     handleApproveDiseaseCase,
     handleGetAllCheckUps,
     handlePreviewDicomFile
} from "../controllers/doctor.js";
import validateBody from "../middlewares/validateBody.middleware.js";
import { doctorSchema } from "../zodSchemas/doctor.schema.js";

const router = express.Router();

// router.post("/signup", handleDoctorSignup);

// router.post("/login", handleDoctorLogin);

router.post("/add-doctor",
     validateBody(doctorSchema),
     handleAddDoctor
);

router.route("/:Id")
     .get(handleGetDoctor)
     .post(handleUpdateDoctor);

router.patch('/pfpImgUpload',
     uploadImg.single("profilePic"),
     cloudinary_pfpUploader,
     deleteLocalImgFile,
     handleUploadImg
);

router.delete('/deletePfpImage',
     handleDeletePfpImage
);

router.get('/diseaseCase/:Id',
     handleGetDiseaseCase
);

router.post('/approve-diseaseCase/:Id', 
     handleApproveDiseaseCase
);

router.get('/get-allCheckups',
     handleGetAllCheckUps
);

router.get('/preview-dicomFiles', 
     handlePreviewDicomFile
);

// export const handleDocumentUpload = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ err: "no data is provided!" });

//      try {
//           const patientId = req.params.id;

//           const patient = await patientModel.findById(patientId);

//      } catch (error) {
//           console.log(err);
//           return null;
//      }
// };

export default router;