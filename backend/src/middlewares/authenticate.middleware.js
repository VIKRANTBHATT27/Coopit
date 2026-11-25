import 'dotenv/config';
import APIError from '../utils/ApiError.utils.js';
import jwt from "jsonwebtoken";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new APIError(401, "NO AUTHENTICATION TOKEN");
        }

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        req.user = user;

        return next();
    } catch (err) {
        throw new APIError(401, err?.message || "Invalid access token");
    }
};

export const verifyRefreshToken = async (req, res, next) => {
    try {
        const incomingRefreshToken  = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!incomingRefreshToken) {
            throw new APIError(401, "NO REFRESH TOKEN");
        }

        const decodedData = jwt.verify(
            incomingRefreshToken ,
            process.env.REFRESH_TOKEN_SECRET
        );

        req.user = decodedData;
        req.refreshToken = incomingRefreshToken;

        return next();
    } catch (err) {
        throw new APIError(401, err?.message || "Invalid access token");
    }
};