import express from "express";

import {
    userRoutes,
    staffRoutes,
    adminRoutes,
    nurseRoutes,
    doctorRoutes,
    patientRoutes,
    superAdminRoutes,
    receptionistRoutes,
    labTechnicianRoutes
} from "./src/routes/index.js";

import serviceRoutes from "./src/routes/service.js";
const app = express();

app.use('/user', userRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', adminRoutes);
app.use('/nurse', nurseRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/services', serviceRoutes);
app.use('/super-admin', superAdminRoutes);
app.use('/receptionist', receptionRoutes);
app.use('/lab-technician', labTechnicianRoutes);


export default app;