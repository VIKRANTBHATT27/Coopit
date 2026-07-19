import { Checkup, Patient, MedicalCase } from "../models/index.js";

export const validateData = async (req, res, next) => {
    const { checkUpId } = req.parsedQuery;
    const { patientId, medicalCaseId } = req.parsedBody;

    try {
        const [patientRecord, medicalCaseRecord, checkupRecord] = await Promise.all([
            Patient.exists({ _id: patientId }),
            MedicalCase.exists({ _id: medicalCaseId }),
            Checkup.exists({ _id: checkUpId })
        ]);

        if (!patientRecord)
            return res.status(404).json({
                message: "No patient record exist with this patientId."
            });

        if (!medicalCaseRecord)
            return res.status(404).json({
                message: "No medical case record exist with this medicalCaseId."
            });

        if (!checkupRecord)
            return res.status(404).json({
                message: "No checkup record exist with this CheckupId."
            });

        return next();
    } catch (err) {
        console.error(`failed during validating Data on request ${req.route.path}\nerrorMsg => `, err.message);
        
        return next(err);
    }
};