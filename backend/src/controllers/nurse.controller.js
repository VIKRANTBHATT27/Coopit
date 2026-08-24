import { Staff, Nurse } from "../models/index.js";

export const handleCreateNurse = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const [staff, alreadyRegistered] = await Promise.all([
               Staff.findOne({ staffId }),
               Nurse.findOne({ staffId })
          ]);

          if (!staff) return res.status(404).json({ err: "no staff found with this staffId" });
          if (alreadyRegistered) return res.status(409).json({ err: "nurse already exist with this staffId" });

          const newNurse = await Nurse.create(req.parsedBody);

          return res.status(201).json({
               success: true,
               message: "Nurse profile created successfully",
               data: newNurse
          });
     } catch (err) {
          console.error("failed nurse creation controller\n", err.message);
          next(err);
     }
};

export const handleGetNurse = async (req, res, next) => {
     try {
          const { staffId } = req.user;
          const nurse = await Nurse.findOne({ staffId });

          if (!nurse) return res.status(400).json({ msg: "no nurse found with this staffId" });

          return res.status(200).json({ success: true, data: nurse });
     } catch (err) {
          console.log("failed getting details for nusre form db\n", err.message);
          next(err);
     }
};

export const handleUpdateNurse = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const nurse = await Nurse.findOneAndUpdate(
               { staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!nurse) return res.status(400).json({ msg: "no nurse found with this staffId" });

          return res.status(200).json({
               success: true,
               msg: "nurse updated successfully",
               data: nurse
          });
     } catch (err) {
          console.log("failed nurse updation\n", err.message);
          next(err);
     }
};

export const handleUploadImg = async (req, res, next) => {
     if (!req.file)
          return res.status(400).json({ err: "no file is provided!" });

     try {
          const { staffId } = req.user;
          const pfp_url = req.pfpImageURL;
          const pfp_publicId = req.pfpImagePublicId;

          const nurse = await Nurse.findOneAndUpdate(
               { staffId },
               { $set: { pfp_url, pfp_publicId } },
               { returnDocument: "after" }
          );
          if (!nurse) return res.status(404).json({ err: "no nurse found with this staff ID" });

          return res.status(200).json({ data: nurse });
     } catch (err) {
          console.log("image upload failedn\n", err.message);
          next(err);
     }
};

export const handleDeleteUploadedImg = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const nurse = await Nurse.findOne({ staffId });
          if (!nurse) return res.status(404).json({ err: "no nurse available with this staffId" });

          const result = await cloudinary_Delete_pfp(nurse.pfp_publicId);

          console.log(result);

          if (!result) return res.status(400).json({ err: "Failed to delete profile picture from cloudinary" });

          const updatedNurse = await Nurse.findOneAndUpdate(
               { staffId },
               {
                    $set: {
                         pfp_url: "/default-pfp/default-nurse.png", pfp_publicId: undefined
                    }
               },
               { returnDocument: "after" }
          );

          return res.status(200).json({ msg: "successfully deleted profile picture" });
     } catch (err) {
          console.error("image deletion request Failed\n", err.message);
          next(err);
     }
};

export const handleGetAllNurse = async (req, res) => {
     try {
          const { hospitalId } = req.user;

          const allNurse = await Staff.find({
               hospitalId,
               role: "NURSE",
               department: {
                    $in: [
                         "EMERGENCY_MEDICINE",
                         "GENERAL_MEDICINE",
                         "GENERAL_SURGERY"
                    ]
               }
          });

          if (!allNurse) {
               return next(
                    new APIError(204, "No nurse record found")
               );
          }

          return res.status(200).json({
               message: "All nurse records of department Emergency, General Medicine, General Surgery.",
               data: allNurse
          });

     } catch (err) {
          return next(err);
     }
};



// export const handleAddDiseaseCase = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ err: "no data is provided" });

//      const { patientId, nurseId, doctorId } = req.body;

//      if (!patientId || !mongoose.Types.ObjectId.isValid(patientId))
//           return res.status(400).json({ err: "invalid Patient Id" });

//      if (!nurseId || !mongoose.Types.ObjectId.isValid(nurseId))
//           return res.status(400).json({ err: "invalid Nurse Id" });

//      if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId))
//           return res.status(400).json({ err: "invalid Doctor Id" });

//      try {
//           const parsedData = diseaseCase_Schema.parse(req.body);

//           const [patient, nurse, doctor] = await Promise.all([
//                patientModel.findById(patientId),
//                Nurse.findById(nurseId),
//                doctorModel.findById(doctorId)
//           ]);

//           if (!patient) return res.status(404).json({ err: "Patient not found" });
//           if (!nurse) return res.status(404).json({ err: "Nurse not found" });
//           if (!doctor) return res.status(404).json({ err: "Doctor not found" });


//           const response = await diseaseCaseModel.create(parsedData);

//           return res.status(201).json({ msg: "Disease case created successfully", Id: response._id })
//      } catch (err) {
//           console.log("error: ", err.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      }
// };

// export const handleUpdateDiseaseCase = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ err: "no data is provided!" });

//      const { patientId } = req.body;
//      if (!patientId) return res.status(400).json({ err: "no patient id provided!" });

//      try {
//           const parsedData = diseaseUpdation_Schema.parse(req.body);

//           const diseaseCase = await diseaseCaseModel.findOneAndUpdate({ patientId }, {
//                $set: { ...parsedData }
//           }, { returnDocument: "after" });

//           if (!diseaseCase) return res.status(400).json({ msg: "no disease found with this patient Id" });

//           return res.status(200).json({ msg: "successfully updated disease case", Id: diseaseCase._id });
//      } catch (err) {
//           console.log("error: ", err.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      }
// };

// export const handlePatientCheckUp = async (req, res) => {
//      if (!req.body || Object.keys(req.body).length === 0)
//           return res.status(400).json({ msg: "no data is provided!" });

//      const { diseaseCaseId, patientId, doctorId } = req.body;

//      if (!diseaseCaseId || !mongoose.Types.ObjectId.isValid(diseaseCaseId))
//           return res.status(400).json({ err: "invalid Disease Id" });

//      if (!patientId || !mongoose.Types.ObjectId.isValid(patientId))
//           return res.status(400).json({ err: "invalid patient Id" });

//      if (!doctorId || !mongoose.Types.ObjectId.isValid(doctorId))
//           return res.status(400).json({ err: "invalid Doctor Id" });

//      try {
//           const parsedData = checkupSchema.parse(req.body);

//           const [diseaseCase, patient, doctor] = await Promise.all([
//                diseaseCaseModel.findById(diseaseCaseId),
//                patientModel.findById(patientId),
//                doctorModel.findById(doctorId)
//           ]);

//           if (!diseaseCase) return res.status(404).json({ err: "disease case not found!" });
//           if (!patient) return res.status(404).json({ err: "Patient not found" });
//           if (!doctor) return res.status(404).json({ err: "Doctor not found" });

//           const response = await checkupModel.create(parsedData);

//           return res.status(201).json({ msg: "successfully created a check-up", Id: response._id });
//      } catch (err) {
//           console.log("error: ", err.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
//      }
// };