import fs from "fs/promises";
import APIError from "../utils/APIError.utils";

const cleanupTempFiles = (req, res, next) => {
     let isCleanedUp = false;

     const cleanup = async () => {
          if (isCleanedUp || !req.file?.path) return;
          isCleanedUp = true;

          try {
               await fs.rm(req.file.path, { force: true });
          } catch (err) {
               console.warn(`[DISK CRISIS] Hard permissions failure for path ${req.file.path}:`, err.message);

               return next(err);
          }
     };

     res.on("finish", cleanup);
     res.on("close", cleanup);

     return next();
};

export default cleanupTempFiles;