import { Staff, Receptionist, Doctor, Nurse, LabTechnician, Patient } from "../models/index.js";
import APIError from "./APIError.utils.js";

const roleModelMap = {
     NURSE: Nurse,
     DOCTOR: Doctor,
     RECEPTIONIST: Receptionist,
     LAB_TECH: LabTechnician,
};

const resolveRoleReferences = async (user) => {
     if (user.role === "PATIENT") {
          const patient = await Patient.findOne({ userId: user._id });
          if (!patient) throw new APIError(400, "Patient profile record missing");

          return { staffId: null, roleDoc: patient };
     }

     const staff = await Staff.findOne({ userId: user._id });
     if (!staff) throw new APIError(404, "Core Staff base account record missing");

     const roleModel = roleModelMap[user.role];
     if (!roleModel) throw new APIError(400, `Invalid or unmapped user role: ${user.role}`);

     const roleDoc = await roleModel.findOne({ staffId: staff?._id });
     if (!roleDoc) throw new APIError(404, `Specific sub-role profile (${user.role}) missing`);

     return { staffId: staff?._id, roleDoc };
};

export default resolveRoleReferences;