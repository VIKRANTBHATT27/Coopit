import { Patient } from "../models/index.js";
import deleteUserAvatar from "../services/cloudinary.service.js";
import APIError from "../utils/APIError.utils.js";

export const handleCreatePatient = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const alreadyExists = await Patient.exists({ userId }).lean();

          if (alreadyExists) {
               return next(
                    new APIError(409, "Patient already exist with this emailId")
               );
          }

          const patient = await Patient.create({
               ...req.parsedBody,
               userId
          });

          return res.status(201).json({
               msg: "successfully created a patient",
               patientId: patient._id
          });
     } catch (err) {
          return next(err);
     }
};

export const handleGetPatient = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOne({ userId });
          if (!patient) return res.status(404).json({ msg: "Patient not found" });

          return res.status(200).json({ success: true, data: patient });
     } catch (err) {
          console.error("failed during getting patient detials\n", err.message);
          next(err);
     }
};

export const handleUpdatePatient = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOneAndUpdate(
               { userId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );
          if (!patient) return res.status(404).json({ err: "No patient found with this userId" });

          return res.status(200).json({ success: true, msg: "successfully updated patient data" });
     } catch (err) {
          console.error("failed during patient updation\n", err.message);
          next(err);
     }
};

export const handleUploadPatientAvatar = async (req, res, next) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOneAndUpdate(
               { userId },
               {
                    $set: {
                         pfp_url: req.pfpImageURL,
                         pfp_publicId: req.pfpImagePublicId
                    }
               },
               { returnDocument: "after" }
          );
          if (!patient) return res.status(404).json({ err: "No patient found with this userId" });

          return res.status(200).json({
               success: true,
               msg: "successfully uploaded image",
               url: patient.pfp_url
          });
     } catch (err) {
          console.log("Patient image upload failed!\n", err.message);
          next(err);
     }
};

// fix the null issue here 
export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { userId } = req.parsedParams;

          const patient = await Patient.findOne({ userId });

          if (!patient) return res.status(404).json({ err: "no patient available with this userId" });

          const result = await deleteUserAvatar(patient.pfp_publicId);

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
          next(err);
     }

};


// // delete the user function or temp disable the user for 30 days
// export const handleDeletePatient = async (req, res) => {
//      // logout function too

//      try {

//      } catch (error) {

//      }
// };