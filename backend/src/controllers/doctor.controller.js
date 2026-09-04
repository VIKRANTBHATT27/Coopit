import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";

import { previewDicomInstance } from "../service/dicomFileService.js";

import { Doctor, MedicalCase, Staff } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";

export const handleCreateDoctor = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;

        const staffExists = await Staff.exists({ _id: staffId }).lean();

        if (!staffExists) {
            return next(
                new APIError(404, "No staff record found")
            );
        }

        const doctor = await Doctor.create({
            ...req.parsedBody,
            staffId
        });

        return res.status(201).json({
            message: "successfully created doctor record",
            data: doctor
        });

    } catch (err) {
        return next(err);
    }
};

// export const handleGetDoctor = async (req, res) => {
//      try {
//           const { staffId } = req.parsedParams;

//           const doctor = await doctorModel.findOne({ staffId });
//           if (!doctor) return res.status(400).json({ msg: "no doctor found with this staffId" });

//           return res.status(200).json(labTechi);
//      } catch (err) {
//           console.log("error: ", err);
//           return res.status(400).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
//      }
// };

export const handleGetDoctorDetails = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;

        const doctorDetails = await Doctor.findOne({ staffId })
            .populate({
                path: "staffId",
                populate: {
                    path: "userId",
                    select: "-passwordHash -phoneNumberHash -phoneNumberEnc -phoneIV -phoneAuthTag"
                }
            });

        if (!doctorDetails) {
            return next(
                new APIError(400, "Doctor record not found")
            );
        }

        return res.status(200).json({
            message: "All details of doctor",
            data: doctorDetails
        });

    } catch (err) {
        return next(err);
    }
};

export const handleUpdateDoctor = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;

        const doctor = await doctorModel.findOneAndUpdate(
            { staffId },
            { ...req.parsedBody },
            { returnDocument: "after", runValidators: true }
        );

        if (!doctor) {
            return next(
                new APIError(404, "Doctor record not found")
            );
        }

        return res.status(200).json({
            message: "successfully updated doctor record",
            data: doctor
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

        const doctor = await Doctor.findOneAndUpdate(
            { staffId },
            { $set: { pfp_url, pfp_publicId } },
            { returnDocument: "after" }
        );

        if (!doctor) {
            return next(
                new APIError(404, "Doctor record not found")
            );
        }

        return res.status(200).json({
            message: "Successfully uploaded avatar",
            url: doctor.pfp_url
        });

    } catch (err) {
        return next(err);
    }
};

export const handleDeleteAvatar = async (req, res, next) => {
    try {
        const { staffId } = req.user;

        const doctor = await Doctor.findOne({ staffId });

        if (!doctor) {
            return next(
                new APIError(404, "Doctor record not found")
            );
        }

        if (!doctor.pfp_publicId) {
            return next(
                new APIError(400, "Doesn't have custom profile picture")
            );
        }

        const result = await deleteUserAvatar(doctor.pfp_publicId);

        if (!result) {
            return next(
                new APIError(500, "Failed to delete avatar")
            );
        }

        doctor.pfp_publicId = null;
        doctor.pfp_url = "/default-pfp/default-doctor.png";

        await doctor.save();

        return res.status(200).json({
            messae: "successfully deleted avatar"
        });

    } catch (err) {
        return next(err);
    }
};

// show all the disease case
export const handleGetDiseaseCase = async (req, res) => {
    try {
        const allDiseaseCase = await diseaseCaseModel.find({ diagnosedBy: req.params.doctorId });

        return res.status(200).json(allDiseaseCase);
    } catch (err) {
        console.log("error: ", err);
        return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
    }
};

// approve and disapprove the disease 
// export const handleApproveMedicalCase = async (req, res) => {
//      try {
//           const medicalCase = await MedicalCase.findByIdAndUpdate(req.params.diseaseId,
//                { $set: { status: "Approved" } },
//                { returnDocument: "after" }
//           );

//           return res.status(204).json({ msg: "successfully updated", Id: diseaseCase._id });
//      } catch (err) {
//           console.log("error: ", err.message);
//           return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
//      }
// };

// pick those only checkups which have labResults
export const handleGetAllCheckups = async (req, res) => {
    try {
        const allCheckUps = await checkupModel.find({ doctorId: req.params.doctorId });

        return res.status(200).json(allCheckUps);
    } catch (err) {
        console.log("error: ", err);
        return res.status(500).json({ err: "INTERNAL SERVER ERROR", errorMsg: err.message });
    }
};

export const handleGetDoctorsByDept = async (req, res, next) => {
    try {
        const { hospitalId } = req.user;
        const { department } = req.parsedQuery;

        const allDoctors = await Staff.find({
            hospitalId,
            department,
            role: "DOCTOR",
            status: "ACTIVE",
        });

        if (!allDoctors) {
            return next(
                new APIError(404, "No doctor records found")
            );
        }

        const allDoctorDetails = [];

        for (const doctor of allDoctors) {
            const userDetails = await User.findById(doctor.userId).select("fullName emailId gender dateOfBirth");

            allDoctorDetails.push(userDetails);
        }

        return res.status(200).json({
            message: "details of all the doctors",
            data: allDoctorDetails
        });
    } catch (err) {
        return next(err);
    }
};