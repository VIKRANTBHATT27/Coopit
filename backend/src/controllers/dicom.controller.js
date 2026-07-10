import { DicomFile } from "../models/index.js";
import { previewDicomInstance } from "../services/dicom.service.js";

export const handleViewDicomFile = async (req, res) => {
    const { checkUpId } = req.parsedParams;

    try {
        const dicomFileRecord = await DicomFile.findOne({ checkUpId });
        if (!dicomFileRecord) return res.status(404).json({ success: false, err: "no record found with this check-up" });

        const studyUid = dicomFileRecord.studyInstanceId;
        const seriesUid = dicomFileRecord.seriesInstanceId;
        const instanceUid = dicomFileRecord.sopInstanceUid;

        const dicomBuffer = await previewDicomInstance(
            studyUid, seriesUid, instanceUid
        );

        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader("Content-Type", "application/dicom");
        res.send(dicomBuffer);

    } catch (err) {
        console.log("failed viewing dicom file\n", err.message);
        return res.status(500).json({ success: false, err: 'INTERNAL SERVER ERROR' });
    }
};
