import 'dotenv/config';
import jwt from "jsonwebtoken";
import APIError from "./ApiError.utils.js";

export const generateAccessAndRefreshToken = ({ _id: userId, role }, { staffId = null, staffRole = null, hospitalId = null, roleRefId = null }) => {
    try {
        const accessToken = jwt.sign(
            {
                userId,
                role,
                staffId,
                staffRole,
                roleRefId,
                hospitalId
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            {
                userId,
                staffId,
                hospitalId
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        );

        return {
            accessToken,
            refreshToken
        };

    } catch (err) {
        throw new APIError(
            500,
            "Error during generating access & refresh token"
        )
    }
};