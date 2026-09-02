import accessChecker from "../services/accessControl.service";

export const authorize = (roles = [], staffRoles = []) => {
    return (req, res, next) => {
        if (!req.user)
            return res.status(400).json({ err: "user not logged in" });

        if (!roles.includes(req.user.role) && !staffRoles.includes(req.user.staffRole))
            return res.status(403).json({ err: "Un-Authorize Request" });

        return next();
    };
};

export const guardCheckupAccess = async (req, res, next) => {
    try {
        const { checkupId } = req.parsedParams;

        const isAccessible = accessChecker(req.user, checkupId);

        if (!isAccessible) {
            return res.status(403).json({
                message: "Access Denied"
            });
        }

        return next();
    } catch (err) {
        return next(err);
    }
};