import { hashPhone, encryptPhoneFn, decryptPhoneFn } from "../utils/phoneNumber.utils.js";
import { model, Schema } from "mongoose";
import { hashPassword } from "../utils/password.utils.js";

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },

    middleName: {
        type: String,
        required: false,
        trim: true,
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
    },

    emailId: {
        type: String,
        required: true,
        trim: true,
    },
    emailIdVerified: {
        type: Boolean,
        default: false
    },

    passwordHash: {
        type: String,
        required: true,
        select: false,
    },

    phoneNumberHash: {
        type: String,
        required: false,
        unique: true,
        select: false,
    },
    phoneNumberEnc: {
        type: String,
        required: true,
        select: false,
    },
    phoneIV: {
        type: String,
        required: false,
        select: false,
    },
    phoneAuthTag: {
        type: String,
        required: false,
        select: false,
    },

    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHERS'],
        required: true
    },

    dateOfBirth: {
        type: Date,
        required: false  //true in production, false in dev and test
    },

    state: {
        type: String,
        required: true
    },
    districtName: {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: false
    },

    mfaEncryptedPayload: {
        type: String,
        required: false,
        select: false,
    },
    mfaEnabled: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

userSchema.index({ emailId: 1 });


userSchema.methods.getPhoneNumber = function () {
    return decryptPhoneFn(this.phoneNumberEnc, this.phoneIV, this.phoneAuthTag);
};

userSchema.pre('save', function () {
    if (!this.isModified('phoneNumberEnc')) return;

    const phone = this.phoneNumberEnc;
    this.phoneNumberHash = hashPhone(phone);

    const { encryptedPhone, iv, authTag } = encryptPhoneFn(phone);
    this.phoneNumberEnc = encryptedPhone;
    this.phoneIV = iv;
    this.phoneAuthTag = authTag;
});

userSchema.pre('save', async function () {
    if (!this.isModified('passwordHash')) return;

    this.passwordHash = await hashPassword(this.passwordHash);
});

const User = model('User', userSchema);
export default User;
