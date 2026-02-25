import patientModel from "../models/patientModel.js";

export const handlePatientSignup = async (req, res) => {
     const signupData = req.body;
     console.log("signupData: ", signupData);

     try {
          const result = await patientModel.create(signupData);

          console.log(result);

          return res.status(201).json({ msg: "successfully created a patient" });
     } catch (error) {
          console.log(error);
          return res.status(404).json({ err: "INTERNAL SERVER ERROR" });
     }
}

export const handlePatientLogin = async (req, res) => {
     return res.status(200).json({ msg: "working" });
}
