import { User, LabTechnician, Staff } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import deleteUserAvatar from "../infrastructure/cloudinary.js";

import dotenv from "dotenv";
dotenv.config();

export const handleGetLabTechDetails = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;

        const staff = await Staff.exists({ _id: staffId });

        if (!staff) {
            return next(
                new APIError(404, "No staff record found")
            );
        }

        const labTechDetails = await LabTechnician.findOne({ staffId })
            .populate({
                path: "staffId",
                populate: {
                    path: "userId"
                }
            });

        if (!labTechDetails) {
            return next(
                new APIError(404, "No lab technician record found")
            );
        }

        return res.status(200).json({
            message: "details of lab technician",
            data: labTechDetails
        });

    } catch (err) {
        return next(err);
    }
};

export const handleGetLabTechnician = async (req, res, next) => {
    try {
        const { staffId } = req.user;

        const labTechnician = await LabTechnician.findOne({ staffId });

        if (!labTechnician) {
            return next(
                new APIError(404, "Lab Technician record not found.")
            );
        }

        return res.status(200).json({
            success: true,
            data: labTechnician
        });

    } catch (err) {
        return next(err);
    }
};

export const handleCreateLabTechnician = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;

        const staff = await Staff.exists({ _id: staffId });

        if (!staff) {
            return next(
                new APIError(404, "No staff record found")
            );
        }

        const labTech = await LabTechnician.create({
            ...req.parsedBody,
            staffId
        });

        return res.status(201).json({
            message: "lab technician record created",
            data: labTech
        });

    } catch (err) {
        return next(err);
    }
};

export const handleUpdateLabTechnician = async (req, res, next) => {
    try {
        const { staffId } = req.parsedParams;

        const staffRecord = await Staff.exists({ _id: staffId });

        if (!staffRecord) {
            return next(
                new APIError(404, "No staff record found")
            );
        }

        const updatedLabTechnician = await LabTechnician.findOneAndUpdate(
            { staffId },
            { $set: { ...req.parsedBody } },
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedLabTechnician) {
            return next(
                new APIError(404, "Lab Technician record not found.")
            );
        }

        return res.status(200).json({
            message: "lab technician updated successfully",
            data: updatedLabTechnician
        });
    } catch (err) {
        return next(err);
    }
};

export const handleUploadAvatar = async (req, res, next) => {
    try {
        const { staffId } = req.user;

        const updatedLabTech = await LabTechnician.findOneAndUpdate(
            { staffId },
            {
                $set: {
                    pfp_url: req.pfpAvatarURL,
                    pfp_publicId: req.pfpAvatarPublicId
                }
            },
            { returnDocument: "after", runValidators: true }
        );

        if (!updatedLabTech) {
            return next(
                new APIError(404, "Lab Technician record not found")
            );
        }

        return res.status(200).json({
            message: "Successfully uploaded profile image",
            url: updatedLabTech.pfp_url
        });

    } catch (err) {
        return next(err);
    }
};

export const handleDeleteAvatar = async (req, res, next) => {
    try {
        const { staffId } = req.user;

        const labTech = await LabTechnician.findOne({ staffId });

        if (!labTech) {
            return next(
                new APIError(404, "No lab technician record found")
            );
        }

        const result = await deleteUserAvatar(labTech.pfp_publicId);

        if (!result) {
            return res.status(500).json({
                sucess: false,
                err: "Failed to delete image from cloudinary"
            });
        }

        labTech.pfp_publicId = undefined;
        labTech.pfp_url = "/default-pfp/default-lab-technician.png";

        await labTech.save();

        return res.status(200).json({
            message: "successfully deleted profile image",
            data: labTech
        });

    } catch (err) {
        return next(err);
    }
};

export const handleGetLabTechByDept = async (req, res, next) => {
    try {
        const { hospitalId } = req.user;
        const { department } = req.parsedQuery;

        const allLabTechnicians = await Staff.find({
            hospitalId,
            department,
            role: "LAB_TECHNICIAN",
            status: "ACTIVE",
        });

        if (!allLabTechnicians) {
            return next(
                new APIError(404, "No lab technicians records found")
            );
        }

        const allLabTechniciansDetails = [];

        for (const labTech of allLabTechnicians) {
            const userDetails = await User.findById(labTech.userId)
                .select("fullName emailId gender dateOfBirth");

            allLabTechniciansDetails.push(userDetails);
        }

        return res.status(200).json({
            message: "details of all the doctors",
            data: allLabTechniciansDetails
        });

    } catch (err) {
        return next(err);
    }
};