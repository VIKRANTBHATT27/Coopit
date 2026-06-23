import jwt from "jsonwebtoken";
import { config } from "dotenv";
import APIError from "./APIError.utils";
config();


const secretKey = process.env.JWT_SECRET_KEY;

export const generateToken = (user, staffId = null, roleDoc = null) => {
     return jwt.sign({
          userId: user._id,
          role: user.role,
          roleRefId: roleDoc?._id || null,
          staffId
     }, secretKey, { expiresIn: "24h" });
};

// token verify
export const getDataFromToken = (token) => {
     if (!token) throw new APIError(401, "NO AUTHENTICATION TOKEN");

     return jwt.verify(token, secretKey);
};