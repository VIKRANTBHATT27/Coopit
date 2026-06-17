import { model, Schema } from "mongoose";

const failedDicomFilesSchema = new Schema({
     orphanedUrls: {
          type: [{
               type: String,
               required: true
          }],
          required: true
     },
     checkUpId: {
          type: Schema.Types.ObjectId,
          ref: "Checkup",
          required: true,
     },
     reason: {
          type: String,
          required: true
     },
     resolved: {
          type: Boolean,
          default: false
     },
     
     timelineEventId: {
          type: Schema.Types.ObjectId,
          ref: "TimeLineEvent",
          required: false,
     }
     
}, { timestamps: true });

const FailedDicomFiles = model('FailedDicomFiles', failedDicomFilesSchema);
export default FailedDicomFiles;