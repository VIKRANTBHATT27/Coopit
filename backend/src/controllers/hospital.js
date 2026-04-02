import hospitalModel from "../models/hospitalModel.js";
import userModel from "../models/userModel.js";

export const handleAddHospital = async (req, res) => {
     try {
          const isAlreadyRegistered = await userModel.findOne({ name: req.parsedBody?.name });
          if (isAlreadyRegistered) return res.status(400).json({ msg: "Hospital is already registered" });

          const response = await hospitalModel.create(req.parsedBody);

          return res.status(201).json({ msg: "successfully created a user", Id: response._id });
     } catch (err) {
          console.log("error: ", err.message);
          return null;
     }
};

// update route
export const handleUpdateHospital = async (req, res) => {
     if (!req.body || Object.keys(req.body) === 0)
          return res.status(400).json({ err: "no data is provided!" });

     try {
          const updatedData = await hospitalModel({ name: req.parsedBody.name },
               { $set: { ...req.parsedBody } },
               { returnDocument: "after" }
          );

          if (!updatedData) return res.status(400).json({ err: "No hospital found!" });

          return res.status(200).json(updatedData);
     } catch (err) {
          console.log("error: ", err.message);

          return res.status(500).json({ err: "INTERNAL SERVER ERROR" });
     }

};

// add new phone number
export const handleAddHospitalPhone = async (req, res) => {
     try {
          const hospital = await hospitalModel.findOne({ name: req.parsedBody.name });
          if (!hospital)
               return res.status(400).json({ err: "no hospital found" });

          const newPhone = [];

          req.parsedData.map((phone) => {
               if (!phone in hospital.phones) 
                    newPhone.push(phone);
          });

          const response = await hospitalModel.updateOne({ name: req.parsedBody.name },
               { $addToSet: { phone: { $each: newPhone } } },
               { returnDocument: "after" }
          );

          return res.status(204).json({ msg: "successfully updated phones" }, response.phones);
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