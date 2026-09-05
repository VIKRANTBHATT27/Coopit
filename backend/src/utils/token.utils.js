import jwt from "jsonwebtoken";
import APIError from "./APIError.utils.js";

import { config } from "dotenv";
config();

const secretKey = process.env.JWT_SECRET_KEY;

export const generateToken = ({ _id: userId, role }, { staffId = null, staffRole = null, hospitalId = null, roleRefId = null }) => {
    return jwt.sign({
        userId,
        role,
        staffId,
        staffRole,
        roleRefId,
        hospitalId
    }, secretKey, { expiresIn: "24h" });
};

// token verify
export const getDataFromToken = (token) => {
    if (!token)
        throw new APIError(401, "NO AUTHENTICATION TOKEN");

    return jwt.verify(token, secretKey);
};