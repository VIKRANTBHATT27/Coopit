import fs from "fs/promises";
import logger from "../../config/logger";

const cleanupTempFiles = (req, res, next) => {
    let isCleanedUp = false;

    const cleanup = async () => {
        if (isCleanedUp || !req.file?.path) return;
        isCleanedUp = true;

        try {
            await fs.rm(req.file.path, { force: true });
        } catch (err) {
            logger.warn("File cleanup failed: ", { path: req.file.path, error: err.message });

            return next(err);
        }
    };

    res.on("finish", cleanup);
    res.on("close", cleanup);

    return next();
};

export default cleanupTempFiles;