import { DicomStudy } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import { createDicomStudySchema } from "../zodSchemas/dicomStudy.schema.js";

export const createDicomStudy = async (dicomData, session) => {
    try {
        const parsedData = createDicomStudySchema.parse(dicomData);

        const dicomStudy = await DicomStudy.create(
            [parsedData],
            { returnDocument: 'after', runValidators: true, session }
        );

        return dicomStudy;
    } catch (err) {
        throw new APIError(500, "INTERNAL SERVER ERROR");
    }
};