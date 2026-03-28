import multer from "multer";
import path from "path";

const customStorageImage = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-images"))
     },
     filename: (req, file, cb) => {
          // const extensionName = path.extname(file.originalname);
          // const basename = path.basename(file.originalname, extensionName);
          
          cb(null, "file-" + Date.now() + file.originalname);
     }
});

export const uploadImg = multer({ storage: customStorageImage });

const customStorageDicomFiles = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-dicom-files"));
     },
     filename: (req, file, cb) => {
          cb(null, "DICOM-file-" + Date.now() + file.originalname);
     }
});

export const uploadDicomFile = multer({ storage: customStorageDicomFiles });