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
    } catch (error) {
        throw new APIError(401, error?.message || "Invalid access token")
    }
};