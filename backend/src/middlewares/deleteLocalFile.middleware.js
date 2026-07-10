import fs from "fs/promises";

export const deleteLocalImgFile = async (req, res, next) => {
     if (!req.file) return next();

     try {
          await fs.rm(req.file.path, { force: true });
     } catch (err) {
          console.warn(`[CLEANUP WARNING] Failed to delete file ${req.file.path}:`, err.message);
     }

     return next();
};

export const cleanupDICOM = (req, res, next) => {
     if (!req.file?.path) return next();

     try {
          await fs.access(req.file.path);

          await fs.unlink(req.file.path);
     } catch (err) {
          console.warn(`[DICOM WARNING] Could not clear file ${req.file.path}:`, err.message);
     }

     return next();
};