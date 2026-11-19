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

app.use('/users', userRoutes);
app.use('/staffs', staffRoutes);
app.use('/admins', adminRoutes);
app.use('/nurses', nurseRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/receptionists', receptionistRoutes);
app.use('/lab-technicians', labTechnicianRoutes);
app.use('/super-admin/hospitals', superAdminRoutes);

export default app;