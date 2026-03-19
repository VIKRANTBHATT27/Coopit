import hospitalModel from "../models/hospitalModel.js";
import * as z from "zod";

const hospitalSchema = z.object({
     name: z.string().min(1).max(100),
     city: z.string(),
     landmark: z.string().optional(),

     address: z.object({
          street: z.string(),
          locality: z.string(),
          city: z.string(),
          state: z.string(),
          pincode: z.string().regex(/^[1-9][0-9]{5}$/, "invalid pincode"),
     }),

     hospitalType: z.enum(["Government", "Private", "Clinic", "Speciality"]),

     phones: z.array(
          z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid Phone")
     ).nonempty(),

     departments: z.array(
          z.enum([
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
          ])
     ).nonempty(),

     createdBy: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),

     location: z.object({
          type: z.literal("Point").default("Point"),
          coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]").optional()
     })
});

const phoneNumberSchema = z.array( z.string().regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number") ).nonempty()
     .refine(
          phones => new Set(phones).size === phones.length,
          { message: "Phone numbers must be unique" }
     )

export const handleAddHospital = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ error: "no data is provided!" });

     try {
          const isAlreadyRegistered = await userModel.findOne({ name: req.body?.name });
          if (isAlreadyRegistered) return res.status(400).json({ msg: "Hospital is already registered" });

          const parsedData = hospitalSchema.parse(req.body);

          const response = await hospitalModel.create(parsedData);

          return res.status(201).json({ msg: "✅ successfully created a user" });
     } catch (err) {
          console.log("error: ", err.message);

          if (error.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return null;
     }
};

// update route
export const handleUpdateHospital = async (req, res) => {
     if (!req.body || Object.keys(req.body) === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const parsedData = hospitalSchema.parse(req.body.data);

          const updatedData = await hospitalModel({ name: req.body.name },
               { $set: { ...parsedData } },
               { returnDocument: "after" });

          if (!updatedData) return res.status(400).json({ err: "No hospital found!" });

          return res.status(200).json(updatedData);
     } catch (err) {
          console.log("error: ", err.message);

          if (err.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }

          return null;
     }

};

// add new phone number
export const handleAddHospitalPhone = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: 'no data is provided' });

     try {
          const parsedPhone = phoneNumberSchema.parse(req.body.phones);

          const hospital = await hospitalModel.findOne({ name: req.body.name });
          if (!hospital)
               return res.status(400).json({ err: "no hospital found" });

          const newPhone = [];

          parsedData.map((phone) => {
               if (!phone in hospital.phones) 
                    newPhone.push(phone);
          });

          const response = await hospitalModel.updateOne({ name: req.body.name },
               { $addToSet: { phone: { $each: newPhone } } },
               { returnDocument: "after" });

          return res.status(204).json({ msg: "✅ successfully updated phones" }, response.phones);
     } catch (err) {
          console.log("error: ", err.message);

          if (err.message === 'VALIDATION ERROR')
               return res.status(400).json({ error: err.message });

          return res.status(500).json({ error: "INTERNAL SERVER ERROR" });
     }
};

// same hospital name


// google maps location 
// app.get('/hospital-location', (req, res) => {
//     const lat = 44.0225;
//     const lng = -92.4666;
    
//     // This will center the map exactly on these coordinates
//     const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

//     res.redirect(googleMapsUrl);
// });