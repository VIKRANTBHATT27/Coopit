import { Checkup, Patient, MedicalCase } from "../models/index.js";

export const validateData = async (req, res, next) => {
    const { checkupId } = req.parsedQuery;
    const { patientId, medicalCaseId } = req.parsedBody;

    try {
        const [patient, medicalCaseRecord, checkup] = await Promise.all([
            Patient.exists({ _id: patientId }),
            MedicalCase.exists({ _id: medicalCaseId }),
            Checkup.exists({ _id: checkUpId })
        ]);

        if (!patient)
            return res.status(404).json({
                message: "invalid patient mongooseId. This mongooseId doesn't point to any record"
            });

        if (!medicalCaseRecord)
            return res.status(404).json({
                message: "invalid medical case mongooseId. This mongooseId doesn't point to any record"
            });

        if (!checkup)
            return res.status(404).json({
                message: "invalid checkup mongooseId. This mongooseId doesn't point to any record"
            });

        return next();
    } catch (err) {
        console.error(`failed during validating Data on request ${req.route.path}\nerrorMsg => `, err.message);
        
        return next(err);
    }
};