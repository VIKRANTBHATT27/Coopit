import { DicomStudy, Staff, User } from "../models/index.js";
import { previewDicomInstance } from "../services/dicom.service.js";
import APIError from "../utils/APIError.utils.js";


export const handleViewDicom = async (req, res) => {
    const { checkUpId } = req.parsedParams;

    try {
        const dicomStudyRecord = await DicomStudy.findOne({ checkUpId });
        if (!dicomStudyRecord) return res.status(404).json({ success: false, err: "no record found with this check-up" });

        const studyUid = dicomStudyRecord.studyInstanceId;
        const seriesUid = dicomStudyRecord.seriesInstanceId;
        const instanceUid = dicomStudyRecord.sopInstanceUid;

        const dicomBuffer = await previewDicomInstance(
            studyUid, seriesUid, instanceUid
        );

        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader("Content-Type", "application/dicom");
        res.send(dicomBuffer);

    } catch (err) {
        console.log("failed viewing dicom\n", err.message);
        return res.status(500).json({ success: false, err: 'INTERNAL SERVER ERROR' });
    }
};
