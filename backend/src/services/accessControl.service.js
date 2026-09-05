import { Checkup, LabTechnician, MedicalCase } from "../models/index.js";

const accessChecker = async (user, checkupId) => {
    const { staffRole, roleRefId } = user;

    try {
        switch (staffRole) {
        
        case "NURSE": {
            const checkup = await Checkup.findById(checkupId).select("medicalCaseId");
            if (!checkup) return false;

            const hasAccess = await MedicalCase.exists({
                _id: checkup.medicalCaseId,
                assistedBy: roleRefId,
            });

            return !!hasAccess;
        }

        case "DOCTOR": {
            const hasAccess = await Checkup.exists({
                _id: checkupId,
                doctorId: roleRefId,
            });

            return !!hasAccess;
        }

        case "LAB_TECHNICIAN": {
            const hasAccess = await LabTechnician.exists({
                _id: roleRefId,
                assignedCheckups: checkupId
            });

            return !!hasAccess;
        }

        default:
            return false;
    }
    } catch (err) {
        return next(err);
    }
};

export default accessChecker;