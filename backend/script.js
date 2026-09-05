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

const app = express();

app.use('/user', userRoutes);
app.use('/staff', staffRoutes);
app.use('/admin', adminRoutes);
app.use('/nurse', nurseRoutes);
app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/receptionist', receptionistRoutes);
app.use('/lab-technician', labTechnicianRoutes);
app.use('/super-admin/hospital', superAdminRoutes);

export default app;