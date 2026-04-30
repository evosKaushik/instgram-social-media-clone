import multer from "multer";


export const createUploader = ({ fileSize = 2 } = {}) => {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: fileSize * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.startsWith("image")) {
        return cb(new Error("Only images allowed"), false);
      }
      cb(null, true);
    },
  });
};