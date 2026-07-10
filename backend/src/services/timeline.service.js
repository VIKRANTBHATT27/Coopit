import { TimelineEvent } from "../models/index.js";
import APIError from "../utils/APIError.utils.js";
import { addNewEventDataSchema } from "../zodSchemas/timelineEvent.schema.js";


export const logTimelineEvent = async (data) => {
    try {
        const parsedData = addNewEventDataSchema.parse(data);

        const { patientId, eventData } = parsedData;

        await TimelineEvent.findOneAndUpdate(
            { patientId },
            { $push: { eventData } },
            { upsert: true, returnDocument: "after", runValidators: true }
        );

    } catch (err) {
        console.log("failed during updating an event in timeline\n", err.message);
    }
};