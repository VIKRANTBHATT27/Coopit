import express from "express";

import adminRoutes from "./src/routes/admin.js";
import nurseRoutes from "./src/routes/nurse.js";
import doctorRoutes from "./src/routes/doctor.js";
import patientRoutes from "./src/routes/patient.js";
import labRoutes from "./src/routes/labTechnician.js";
import receptionRoutes from "./src/routes/receptionist.js";

import serviceRoutes from "./src/routes/service.js";

const app = express();

app.use('/admin', adminRoutes);
app.use('/nurse', nurseRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/lab-technician', labRoutes);
app.use('/receptionist', receptionRoutes);

app.use('/services', serviceRoutes);

export default app;