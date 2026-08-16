import { Staff } from "../models/index.js";

export const handleUpdateStaffMember = async (req, res) => {
     try {
          const staffMember = await staffModel.findOneAndUpdate(
               { employeeId: req.parsedBody?.employeeId },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!staffMember) return res.status(404).json({ msg: "no staff member found with this Id" });

          return res.status(200).json({
               msg: "successfully updated the staff member details",
               data: staffMember
          });
     } catch (err) {
          return next(err);
     }
};

export const handleGetStaffMember = async (req, res) => {
     try {
          const staffMember = await staffModel.findOne({ employeeeId: req.parsedBody.employeeId });

          if (!staffMember) return res.status(404).json({ msg: "no staff member found" });

          return res.status(200).json({ data: staffMember });
     } catch (err) {
          console.log("error: ", err);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR", error: err.message });
     }
};