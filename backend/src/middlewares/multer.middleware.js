import multer from "multer";
import path from "path";

const customStorageAvatars = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("./public/uploaded-avatar"))
    },
    filename: (req, file, cb) => {
        const fileName =  `Image-${Date.now()}-${file.originalname}`;
        file.path = fileName;
        
        req.file = file;
        cb(null, fileName);
    }
});

export const uploadAvatar = multer({ storage: customStorageAvatars });

const customStorageReports = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("./public/uploaded-report"));
    },
    filename: (req, file, cb) => {
        cb(null, "pdf-" + Date.now() + file.originalname);
    }
});

export const uploadReport = multer({ storage: customStorageReports });

const customStorageDicoms = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve("./public/uploaded-dicom-files"));
    },
    filename: (req, file, cb) => {
        cb(null, "DICOM-file-" + Date.now() + file?.originalname);
    }
});

export const uploadDicom = multer({ storage: customStorageDicoms });