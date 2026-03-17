import express from "express";

import userRoutes from "./src/routes/user.js";
import staffRoutes from "./src/routes/staff.js";
import adminRoutes from "./src/routes/admin.js";
import nurseRoutes from "./src/routes/nurse.js";
import doctorRoutes from "./src/routes/doctor.js";
import patientRoutes from "./src/routes/patient.js";
import serviceRoutes from "./src/routes/service.js";
import hospitalRoutes from "./src/routes/hospital.js";
import receptionRoutes from "./src/routes/receptionist.js";
import labTechnicianRoutes from "./src/routes/labTechnician.js";

const app = express();

app.use('/user', userRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', adminRoutes);
app.use('/nurse', nurseRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/services', serviceRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/receptionist', receptionRoutes);
app.use('/lab-technician', labTechnicianRoutes);


export default app;