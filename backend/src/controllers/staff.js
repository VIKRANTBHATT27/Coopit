import staffModel from "../models/staffModel.js";
import * as z from "zod";

const staffSchema = z.object({
     userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     hospitalId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     employeeId: z.string().min(5),

     department: z.enum([
          "Anesthesiology",
          "Cardiology",
          "Dermatology",
          "Emergency Medicine",
          "Endocrinology",
          "Gastroenterology",
          "General Medicine",
          "General Surgery",
          "Gynecology & Obstetrics",
          "Neurology",
          "Oncology",
          "Orthopedics",
          "Pediatrics",
          "Psychiatry",
          "Pulmonology",
          "Radiology",
          "Urology"
     ]),

     role: z.enum(["Doctor", "Nurse", "LabTechnician", "Receptionist"]),

     status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),

     shift: z.enum(["Morning", "Evening", "Night"]),

     designation: z.string().optional()
});

export const handleAddStaffMember = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ msg: "no data is provided!" });

     try {
          const parsedData = staffSchema.parse(req.body);

          await staffModel.create(parsedData);

          return res.status(201).json({ msg: "successfully created staff member" });

     } catch (err) {
          console.log("error: ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handleUpdateStaffMember = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ msg: "no data is provided!" });

     try {
          const parsedData = staffSchema.parse(req.body.data);

          const staffMember = await staffModel.findOneAndUpdate(
               { employeeId: req.body.empId },
               { $set: { ...parsedData } },
               { returnDocument: "after" }
          );

          if (!staffMember) return res.status(404).json({ msg: "no staff member found with this Id" });

          return res.status(200).json({ msg: "successfully updated the staff member details" }, staffMember);
     } catch (err) {
          console.log("error: ", err.message);

          return null;
     }
};