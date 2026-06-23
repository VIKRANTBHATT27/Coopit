import { Schema, model } from "mongoose";

const OtpSchema = new Schema({
     userId: {
          type: Schema.Types.ObjectId,
          required: true
     },

     otpType: {
          type: String,
          enum: ['EMAIL', 'PHONE'],
          required: true
     },

     otpCode: {
          type: String,
          required: true
     },
     
     createdAt: {
          type: Date,
          default: Date.now,
          expires: 180
     }
});

otpSchema.index({ userId: 1, otpType: 1 }, { unique: true });

const Otp = model("Otp", OtpSchema);
export default Otp;