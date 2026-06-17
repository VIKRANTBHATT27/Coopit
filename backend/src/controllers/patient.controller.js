 import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";

import Patient from "../models/patient.model.js";
import userModel from "../models/user.models.js";
import { dicomWebRetrieveInstance } from "../service/dicomFile.services.js";
import checkupModel from "../models/checkup.model.js";


export const handleCreatePatient = async (req, res) => {
     try {
          const { userId } = req.params;

          const isAlreadyPatient = await Patient.findOne({ userId });
          if (isAlreadyPatient) return res.status(409).json({ msg: "Patient already exist with this Email" });

          const patient = await Patient.create(req.parsedBody);

          return res.status(201).json({
               msg: "successfully created a patient",
               patientId: patient._id
          });
     } catch (err) {
          console.log("Patient signup failed\n", err.message);

          if (err.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleGetPatient = async (req, res) => {
     try {
          const patient = await Patient.findOne({ userId: req.params.userId });

          if (!patient) return res.status(404).json({ msg: "Patient not found" });

          return res.status(200).json(patient);
     } catch (err) {
          console.log("error: ", err);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// update current patient requires login first authentication etc.
export const handleUpdatePatient = async (req, res) => {
     try {
          const patient = await Patient.findOneAndUpdate(
               { userId: req.params.userId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!patient) return res.status(404).json({ err: "No patient found with this userId" });

          return res.status(200).json({ msg: "successfully updated" })
     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

export const handlePatientUploadImg = async (req, res) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     try {
          const patient = await Patient.findOneAndUpdate(
               { userId: req.parsedBody.userId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               },
               { returnDocument: "after" });

          if (!patient) return res.status(404).json({ err: "No patient found with this userId" });

          return res.status(200).json({ msg: "successfully uploaded image", url: patient.pfp_url });
     } catch (err) {
          console.log("Patient image upload failed!\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }
};

// fix the null issue here 
export const handleDeletePfpImage = async (req, res) => {
     try {
          const { userId } = req.params;

          const patient = await Patient.findOne({ userId });
          
          if (!patient) return res.status(404).json({ err: "no patient available with this userId" });

          const result = await cloudinary_Delete_pfp(patient.pfp_publicId);

          console.log(result);

          const patient = await Patient.findOneAndUpdate(
               { userId },
               {
                    $set: {
                         pfp_url: "/public/default-pfp/default-patient.png",
                         pfp_publicId: undefined
                    }
               },
               { returnDocument: "after" }
          );

          return res.status(200).json({ msg: "successfully deleted image" });
     } catch (err) {
          console.log("patient deletion request failed!\n", err);
          return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
     }

};



// // delete the user function or temp disable the user for 30 days
// export const handleDeletePatient = async (req, res) => {
//      // logout function too

//      try {

//      } catch (error) {

//      }
// };

export const handleDownloadDicom = async (req, res) => {
     const { checkUpId, studyInstanceId } = req.parsedBody;

     try {
          const checkUp = await checkupModel.findById(checkUpId);
          if (!checkUp) return res.status(404).json({ err: "Check up not found" });

          const dicomFile = checkUp.dicomFiles.find(file => file.studyInstanceId == studyInstanceId);

          if (!dicomFile) return res.status(404).json({ err: "DICOM file not found" });

          await dicomWebRetrieveInstance(
               fileName,
               dicomFile.studyInstanceId,
               dicomFile.seriesInstanceId,
               dicomFile.sopInstanceUid
          );

     } catch (err) {
          console.log("error: ", err);
          return res.status(500).json({ err: 'INTERNAL SERVER ERROR', errorMsg: err.message });
     }
};
