import cloudinary_Delete_pfp from "../service/cloudinaryImgDelete.js";
import patientModel from "../models/patientModel.js";
import userModel from "../models/userModel.js";
import * as z from "zod";

const patientSchema = z.object({
     userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid ObjectId"),
     pfp_url: z.string().optional(),
     weight: z.number().min(1).max(500).optional(),
     height: z.number().min(30).max(300).optional(),
     bloodType: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),


     lifestyle: z.object({
          smoking: z.boolean().default(false),
          alcohol: z.boolean().default(false),
          tobacco: z.boolean().default(false),
          occupation: z.string().optional(),
     }),

     allergies: z.array(z.string()).default([]),
     chronicConditions: z.array(z.string()).default([]),

     location: z.object({
          type: z.literal('Point').default('Point'),
          coordinates: z.array(z.number()).length(2, "Coordinates must be [longitude, latitude]").optional(),
     }).optional(),
});

export const handlePatientSignup = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const isAlreadyPatient = await patientModel.findOne({ userId: req.body.userId });
          if (isAlreadyPatient) return res.status(400).json({ msg: "Patient already exist with this Email" });

          const parsedData = patientSchema.parse(req.body.data);

          const patient = await patientModel.create(parsedData);

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

export const handleGetPatient = async (req, res) => {
     if (!req.params.id) res.status(400).json({ msg: "no patient Id provided!" });

     try {
          const userId = req.params.Id;
          if (!userId || isNaN(userId)) {
               return res.status(400).send('Invalid or missing user ID');
          }

          const patient = await patientModel.findById({ userId });

          if (!patient) {
               return res.status(404).json({ msg: "Patient not found" });
          }

          return res.status(200).json(patient);
     } catch (error) {
          console.log("error: ", error.message);

          return null;
     }
};


// update current patient requires login first authentication etc.
export const handleUpdatePatient = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ msg: "no data is provided" });

     try {
          const userId = req.params.Id;
          if (!userId || isNaN(userId)) {
               return res.status(400).send('Invalid or missing user ID');
          }

          const parsedData = patientSchema.parse(req.body);

          const patient = await patientModel.findOneAndUpdate({ userId },
               { $set: { ...parsedData } },
               { returnDocument: "after" });

          if (!patient) {
               return res.status(404).json({ err: "No patient found with this userId" });
          }

          return res.status(200).json({ msg: "successfully updated" })
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

export const handlePatientUploadImg = async (req, res) => {
     if (!req.file) return res.status(400).json({ err: "no image file uploaded" });

     try {
          const { emailId, userId } = req.body;

          const user = await userModel.findOneAndUpdate({ emailId },
               { $set: { pfp_publicId: req.pfpImagePublicId } });

          if (!user) return res.status(404).json({ err: "No patient found with this emailId" })

          const patient = await patientModel.findOneAndUpdate({ userId },
               { $set: { pfp_url: req.pfpImageURL } },
               { returnDocument: "after" });

          if (!patient) return res.status(404).json({ err: "No patient found with this userId" });

          return res.status(200).json({ msg: "successfully uploaded image", url: patient.pfp_url });
     } catch (error) {
          console.log("Patient image upload failed", error.message);
          return null;
     }
};

// fix the null issue here 
export const handleDeletePfpImage = async (req, res) => {
     if (!req.body || Object.keys(req.body).length === 0)
          return res.status(400).json({ err: "no data is provided" });

     try {
          const { emailId, userId } = req.body;

          const user = await userModel.findOne({ emailId });

          if (!user) return res.status(404).json({ err: "no user available with this emailId" });

          const result = await cloudinary_Delete_pfp(user.pfp_publicId);

          console.log(result);

          if (result) {
               const user = await userModel.findOneAndUpdate({ emailId }, {
                    $set: { pfp_publicId: undefined, }
               });

               const patient = await patientModel.findOneAndUpdate({ userId }, {
                    $set: { pfp_url: "/public/pfp/default-patient.png" }
               }, { returnDocument: "after" });

               if (!patient) return res.status(404).json({ err: "no patient available with this userId" });

               return res.status(202).json({ msg: "deletion successfull" })
          }
     } catch (error) {
          console.log("patient deletion request Failed!");
          return null;
     }

     return res.status(200).json({ msg: "successfully deleted image" });
};



// // delete the user function or temp delete
// export const handleDeletePatient = async (req, res) => {
//      // logout function too

//      try {

//      } catch (error) {

//      }
// };


