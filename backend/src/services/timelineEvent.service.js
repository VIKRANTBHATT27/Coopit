import { TimelineEvent } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import { addEventDataSchema } from "../zodSchemas/timelineEvent.schema.js";

export const logTimelineEvent = async (data) => {
    try {
        const parsedData = addEventDataSchema.parse(data);

        const { patientId, eventData } = parsedData;

        await TimelineEvent.findOneAndUpdate(
            { patientId },
            { $push: { eventData } },
            { returnDocument: "after", runValidators: true }
        );

    } catch (err) {
        console.error("failed during updating an event in timeline\n", err.message);

        throw new APIError(500, "INTERNAL SERVER ERROR");
    }
};