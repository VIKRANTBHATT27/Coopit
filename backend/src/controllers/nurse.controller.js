import deleteUserAvatar from "../infrastructure/cloudinary.js";
import { Staff, Nurse, Patient, User } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetNurse = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const nurse = await Nurse.findOne({ staffId });

          if (!nurse) {
               return next(
                    new APIError(404, "No nurse record found")
               );
          }

          return res.status(200).json({
               data: nurse
          });

     } catch (err) {
          return next(err);
     }
};

export const handleGetNurseDetails = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const nurseDetails = await Nurse.findOne({ staffId })
               .populate({
                    path: "staffId",
                    populate: {
                         path: "userId",
                         select: "-passwordHash -phoneNumberHash -phoneNumberEnc -phoneIV -phoneAuthTag"
                    }
               });

          if (!nurseDetails) {
               return next(
                    new APIError(400, "Nurse record not found")
               );
          }

          return res.status(200).json({
               message: "All details of nurse",
               data: nurseDetails
          });

     } catch (err) {
          return next(err);
     }
};

export const handleCreateNurse = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const [staffExists, nurseExists] = await Promise.all([
               Staff.exists({
                    _id: staffId,
                    role: "NURSE"
               }).lean(),
               Nurse.exists({ staffId }).lean()
          ]);

          if (!staffExists) {
               return next(
                    new APIError(404, "Staff record not found")
               );
          }

          if (nurseExists) {
               return next(
                    new APIError(409, "Nurse record already exist")
               );
          }

          const nurse = await Nurse.create({
               ...req.parsedBody,
               staffId
          });

          return res.status(201).json({
               success: true,
               message: "Nurse record created successfully",
               data: nurse
          });

     } catch (err) {
          return next(err);
     }
};

export const handleUpdateNurse = async (req, res, next) => {
     try {
          const { staffId } = req.parsedParams;

          const nurse = await Nurse.findOneAndUpdate(
               { staffId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!nurse) {
               return next(
                    new APIError(400, "Nurse record not found")
               );
          }

          return res.status(200).json({
               success: true,
               msg: "Nurse record updated successfully",
               data: nurse
          });

     } catch (err) {
          return next(err);
     }
};

export const handleUploadAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const pfp_url = req.pfpImageURL;
          const pfp_publicId = req.pfpImagePublicId;

          const nurse = await Nurse.findOneAndUpdate(
               { staffId },
               { $set: { pfp_url, pfp_publicId } },
               { returnDocument: "after" }
          );

          if (!nurse) {
               return next(
                    new APIError(404, "Nurse record not found")
               );
          }

          return res.status(200).json({
               message: "Successfully uploaded avatar",
               url: nurse.pfp_url
          });

     } catch (err) {
          if (req.pfpAvatarPublicId) {
               const result = await deleteUserAvatar(req.pfpAvatarPublicId);

               if (!result)
                    throw new Error(500, "Cloudinary profile image deletion failed!");
          }

          return next(err);
     }
};

export const handleDeleteAvatar = async (req, res, next) => {
     try {
          const { staffId } = req.user;

          const nurse = await Nurse.findOne({ staffId });

          if (!nurse) {
               return next(
                    new APIError(404, "Nurse record not found")
               );
          }

          if (!nurse.pfp_publicId) {
               return next(
                    new APIError(400, "Doesn't have custom profile picture")
               );
          }

          const result = await deleteUserAvatar(nurse.pfp_publicId);

          if (!result) {
               return next(
                    new APIError(500, "Failed to delete avatar")
               );
          }

          nurse.pfp_publicId = null;
          nurse.pfp_url = "/default-pfp/default-nurse.png";
          await nurse.save();


          return res.status(200).json({
               messae: "successfully deleted avatar"
          });

     } catch (err) {
          return next(err);
     }
};

export const handleGetNursesByDept = async (req, res, next) => {
     try {
          const { hospitalId } = req.user;
          const { department } = req.parsedQuery;

          const allNurses = await Staff.find({
               hospitalId,
               department,
               role: "NURSE",
               status: "ACTIVE",
          });

          if (!allNurses) {
               return next(
                    new APIError(404, "No nurse records found")
               );
          }

          const allNurseDetails = [];

          for (const nurse of allNurses) {
               const userDetails = await User.findById(nurse.userId).select("fullName emailId gender dateOfBirth");

               allNurseDetails.push(userDetails);
          }

          return res.status(200).json({
               message: "details of all the doctors",
               data: allNurseDetails
          });

     } catch (err) {
          return next(err);
     }
};


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