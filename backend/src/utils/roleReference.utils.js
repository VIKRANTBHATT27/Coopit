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

          return { staffId: null, roleDocId: patient?._id || null };
     }

     const staff = await Staff.findOne({ userId });
     if (!staff) return { staffId: null, roleDocId: null };

     const roleModel = roleModelMap[role];
     if (!roleModel) throw new APIError(400, `Invalid user role: ${role}`);

     const roleDoc = await roleModel.findOne({ staffId: staff?._id });
     if (!roleDoc) throw new APIError(404, `Specific sub-role profile (${role}) missing`);

     return { staffId: staff?._id, roleDocId: roleDoc?._id };
};

export default resolveRoleReferences;