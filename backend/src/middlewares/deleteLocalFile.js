import fs from "fs";

export const deleteLocalImgFile = async (req, res, next) => {
     if (!req.file || !req.body.emailId) return next();

     await fs.rm(req.file.path, { force: true }, (err) => {
          if (err) console.log(err);
     });

     return next();
};

export const cleanupDICOMFile = (req, res, next) => {
     if (req.file?.path && fs.existsSync(req.file.path))
          fs.unlinkSync(req.file.path);
     return next();
};