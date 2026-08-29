import { DicomStudy } from "../models/index.js";
import { previewDicomInstance } from "../services/dicom.service.js";
import APIError from "../utils/APIError.utils.js";


export const handleViewDicom = async (req, res, next) => {
    const { checkUpId } = req.parsedParams;

    try {
        const dicomStudyRecord = await DicomStudy.findOne({ checkUpId });

        if (!dicomStudyRecord) {
            return next(
                new APIError(404, "Dicom record not found")
            );
        }

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
        return next(err);
    }
};
