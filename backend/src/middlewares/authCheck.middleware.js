import { getDataFromToken } from "../utils/token.utils.js";

export const checkForAuthentication = (req, res, next) => {
     const tokenCookie = req.cookies?.token;
     req.user = null;

     if (!tokenCookie) return next();

     const user = getDataFromToken(tokenCookie);
     req.user = user;

     return next(); 
};

export const checkForAuthorization = (roles = []) => {
     return (req, res, next) => {
          if (!req.user) return res.status(400).json({ err: "user not logged in " });

          if (!roles.includes(req.user.role)) return res.status(403).json({ err: "Un-Authorize Request" });

          return next();
     };
};