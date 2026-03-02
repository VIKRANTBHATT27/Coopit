import multer from "multer";
import path from "path";

const customStorage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-images"))
     },
     filename: (req, file, cb) => {
          cb(null, file.originalname + "-" + Date.now());
     }
});

const upload = multer({ storage: customStorage });
export default upload;