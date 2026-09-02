import { Timeline } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import { addEventDataSchema } from "../zodSchemas/timeline.schema.js";

export const logTimelineEvent = async (timelineData, session) => {
    try {
        const parsedData = addEventDataSchema.parse(timelineData);

        const { timlineId, eventData } = parsedData;

        const timline = await Timeline.findByIdAndUpdate(
            timlineId,
            { $push: { eventData } },
            { returnDocument: "after", runValidators: true, session }
        );

        return timline;
    } catch (err) {
        throw new APIError(500, "INTERNAL SERVER ERROR");
    }
};