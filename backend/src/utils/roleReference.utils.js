import { Staff, Receptionist, Doctor, Nurse, LabTechnician, Patient } from "../models/index.js";
import APIError from "./APIError.utils.js";

const roleModelMap = {
    NURSE: Nurse,
    DOCTOR: Doctor,
    RECEPTIONIST: Receptionist,
    LAB_TECH: LabTechnician,
};

const resolveRoleReferences = async ({ role, _id: userId }) => {
    if (role === "PATIENT") {
        const patient = await Patient.findOne({ userId });

        if (!patient) throw new APIError(404, "Patient record not found")

        return { roleRefId: patient?._id };
    }

    const staff = await Staff.findOne({ userId }).select("_id role hospitalId").lean();

    if (!staff) return {};

    if (staff.role === "HOSPITAL_ADMIN") {
        return {
            staffId: staff._id,
            staffRole: staff.role,
            hospitalId: staff.hospitalId
        }
    }

    const roleModel = roleModelMap[staff.role];
    if (!roleModel) throw new APIError(400, `Invalid user role: ${role}`);

    const roleDoc = await roleModel.findOne({ staffId: staff?._id });
    if (!roleDoc) throw new APIError(404, `${role} record not found`);

    return {
        staffId: staff?._id,
        staffRole: staff.role,
        hospitalId: staff.hospitalId,
        roleRefId: roleDoc?._id
    };
};

export default resolveRoleReferences;