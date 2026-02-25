import express from "express";
import adminRoutes from "./src/routes/admin.js";
import doctorRoutes from "./src/routes/doctor.js";
import patientRoutes from "./src/routes/patient.js";

const app = express();

app.use('/doctor', doctorRoutes);
app.use('/patient', patientRoutes);
app.use('/admin', adminRoutes);

export default app;