import fs from "fs";

export const deleteLocalImgFile = async (req, res, next) => {
     if (!req.file) return next();

     await fs.rm(req.file.path, { force: true }, (err) => {
          if (err) console.log(err);
     });

     return next();
}