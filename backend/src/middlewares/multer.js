import multer from "multer";
import path from "path";

const customStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-images"))
     },
     filename: (req, file, cb) => {
          const extensionName = path.extname(file.originalname);
          const basename = path.basename(file.originalname, extensionName);
          
          cb(null, "file-" + Date.now() + file.originalname);
     }
});

const upload = multer({ storage: customStorage });
export default upload;