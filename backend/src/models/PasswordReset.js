import { model, Schema } from "mongoose";

const passwordResetSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    resetToken: {
        type: String,
        required: true,
        minlength: 64,
        maxlength: 64,
        trim: true
    },

    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300
    },

    expiresAt: {
        type: Date,
        required: true
    }
});

passwordResetSchema.index({ resetToken: 1 });

const PasswordReset = model("PasswordReset", passwordResetSchema);
export default PasswordReset;