import { DicomStudy } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import { createDicomStudySchema } from "../zodSchemas/dicomStudy.schema.js";

export const createDicomStudy = async (data) => {
    try {
        const parsedData = createDicomStudySchema.parse(data);

        const dicomStudy = await DicomStudy.findOneAndUpdate(
            { checkupId },
            { parsedData },
            { returnDocument: 'after', runValidators: true }
        );

        return dicomStudy;
    } catch (err) {
        console.error("failed during creating a dicom study\n", err.message);

        throw new APIError(500, "INTERNAL SERVER ERROR");
    }
};