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
     }
}, { timestamps: true });

const failedDicomFilesModel = model('failedDicom', failedDicomFilesSchema);
export default failedDicomFilesModel;