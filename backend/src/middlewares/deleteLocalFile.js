import fs from "fs";

const deleteLocalImgFile = async (req, res, next) => {
     if (!req.file || !req.body.emailId) return next();

     await fs.rm(req.file.path, { force: true }, (err) => {
          if (err) console.log(err);
     });

     return next();
};

export default deleteLocalImgFile;