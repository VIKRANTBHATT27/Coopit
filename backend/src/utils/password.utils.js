import argon2 from "argon2";
import APIError from "./APIError.utils.js";

export const hashPassword = async (password) => {
    try {
        const hashPass = await argon2.hash(password);
        return hashPass;
    } catch (err) {
        throw new APIError(500, `password hashing failed`);
    }
};

export const passwordMatch = async (encryptedPassword, newPassword) => {
    try {
        const isVerified = await argon2.verify(encryptedPassword, newPassword);
        return isVerified;
    } catch (err) {
        throw new APIError(500, `INTERNAL SERVER ERROR due to ${err.message}`);
    }
};