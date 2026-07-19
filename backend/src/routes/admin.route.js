import express from "express";

const router = express.Router();

router.post('/login',
    handleAdminLogin
);

router.post('/lab-technician',
    handleCreateLabTechnician
)

export default router;