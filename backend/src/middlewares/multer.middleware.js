import multer from "multer";
import path from "path";

const customStorageAvatar = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-avatar"))
     },
     filename: (req, file, cb) => {
          // const extensionName = path.extname(file.originalname);
          // const basename = path.basename(file.originalname, extensionName);
          
          cb(null, "image-" + Date.now() + file.originalname);
     }
});

export const uploadAvatar = multer({ storage: customStorageImage });

const customStoragePdf = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-pdf-files"));
     },
     filename: (req, file, cb) => {
          cb(null, "pdf-" + Date.now() + file.originalname);
     }
});

export const uploadPdf = multer({ storage: customStoragePdf });

const customStorageDicomFiles = multer.diskStorage({
     destination: (req, file, cb) => {
          cb(null, path.resolve("./public/uploaded-dicom-files"));
     },
     filename: (req, file, cb) => {
          cb(null, "DICOM-file-" + Date.now() + file.originalname);
     }
});

export const uploadDicomFile = multer({ storage: customStorageDicomFiles });