import { getDataFromToken } from "../utils/token.utils.js";

const authenticate = (req, res, next) => {
     const tokenCookie = req.cookies?.token;
     req.user = null;

     if (!tokenCookie) return next();

     const user = getDataFromToken(tokenCookie);
     req.user = user;

     return next(); 
};

export default authenticate;