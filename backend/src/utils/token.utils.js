import jwt from "jsonwebtoken";
import { config } from "dotenv";
import APIError from "./APIError.utils";
config();

const secretKey = process.env.JWT_SECRET_KEY;

export const generateToken = ({ _id: userId, role }, { staffId = null, roleRefId = null }) => {
    return jwt.sign({
        userId,
        role,
        staffId,
        staffRole,
        roleRefId,
        hospitalId,
        patientId
    }, secretKey, { expiresIn: "24h" });
};

// token verify
export const getDataFromToken = (token) => {
    if (!token)
        throw new APIError(401, "NO AUTHENTICATION TOKEN");

    return jwt.verify(token, secretKey);
};