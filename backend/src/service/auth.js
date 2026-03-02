import jwt from "jsonwebtoken";
import { configDotenv } from "dotenv";

configDotenv();

const secretKey = process.env.JWT_SECRET;

// token generation
export const generateToken = (user, userRole) => {
     return jwt.sign({
          _id: user.id,
          fullName: user.fullName,
          emailId: user.emailId,
          role: userRole                     //"patient", "doctor", "admin"
     }, secretKey, { expiresIn: "12h" });
};

// token verify
export const getUserFromToken = (token) => {
     if (!token) return null;
     try {
          return jwt.verify(token, secretKey);
     } catch (err) {
          return null;
     }
};