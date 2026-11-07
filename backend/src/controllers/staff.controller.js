import { Staff } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";

export const handleGetStaffMember = async (req, res) => {
     try {
          const { employeeId } = req.parsedParams;

          const staffMember = await Staff.findOne({ employeeId });

          if (!staffMember) {
               return next(
                    new APIError(404, "Staff Member not found")
               )
          }

          return res.status(200).json({ data: staffMember });
     } catch (err) {
          return next(err);
     }
};