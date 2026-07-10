import { getDataFromToken } from "../utils/token.utils.js";

const checkForAuthentication = (req, res, next) => {
     const tokenCookie = req.cookies?.token;
     req.user = null;

     if (!tokenCookie) return next();

     const user = getDataFromToken(tokenCookie);
     req.user = user;

     return next(); 
};

export default checkForAuthentication;