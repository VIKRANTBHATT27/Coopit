import patientModel from "../models/patientModel.js";
import bcrypt from "bcrypt";
import * as z from "zod";

const patientSchema = z.object({
     fullName: z.string().min(3),
     emailId: z.string().email(),
     password: z.string().min(6),
     phoneNumber: z.string().regex(/^\+?[0-9]{10,15}$/, "Phone number must be 10–15 digits"),
     gender: z.enum(['Male', 'Female', 'Others']),
     pfp_url: z.string().optional(),
     dateofBirth: z.date().optional(),
     weight: z.number().optional(),
     height: z.number().optional(),
     bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
     birthPlace: z.string().optional(),

     lifestyle: z.object({
          smoking: z.boolean().default(false),
          alcohol: z.boolean().default(false),
          tobacco: z.boolean().default(false),
          occupation: z.string().optional(),
     }).optional(),

     allergies: z.array(z.string()).optional(),

     location: z.object({
          type: z.literal('Point').default('Point'),
          coordinates: z.array(z.number()).length(2).optional(),
     }).optional(),
});

export const handlePatientSignup = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const parsedData = patientSchema.parse(req.body);

          const hashedPassword = await bcrypt.hash(parsedData.password, 13);

          const patient = await patientModel.create({ ...parsedData, password: hashedPassword });

          return res.status(201).json({
               msg: "✅ successfully created a patient",
               patientId: patient._id
          });
     } catch (error) {
          console.log("❌ Patient signup Failed", error.message);

          if (error.message === "ValidationError") {
               return res.status(400).json({ err: "VALIDATION ERROR" });
          }
     
          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
};

export const handlePatientLogin = async (req, res) => {
     // make a cookie and a otp during login in user email or phoneNo if password matched

     const { emailId, password } = req.body;

     try {
          const token = await patientModel.matchPassword_and_GenerateToken(emailId, password);


          
     } catch (error) {
          console.log("error: ", error.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }
     return res.status(200).json({ msg: "query reached successfully" });
};
