import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();


const secretKey = process.env.JWT_SECRET_KEY;

export const generateToken = (user, staffId = null,  roleDoc = null) => {
     return jwt.sign({
          _id: user.id,
          role: user.role,
          roleRefId: roleDoc?._id || null,
          staffId
     }, secretKey, { expiresIn: "24h" });
};

// token verify
export const getUserFromToken = (token) => {
     if (!token) return null;

     try {
          return jwt.verify(token, secretKey);
     } catch (err) {
          console.log("error: ", err);
          return { error: "INTERNAL SERVER ERROR", response: err.message };
     }
};