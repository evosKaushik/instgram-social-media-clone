import multer from "multer";
import fs from "fs";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/*
|--------------------------------------------------------------------------
| MEMORY STORAGE
| Best for:
| - avatars
| - small images
|--------------------------------------------------------------------------
*/

const memoryStorage = multer.memoryStorage();

/*
|--------------------------------------------------------------------------
| DISK STORAGE
| Best for:
| - videos
| - large media
|--------------------------------------------------------------------------
*/

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + file.originalname.replace(/\s+/g, "");

    cb(null, uniqueName);
  },
});

/*
|--------------------------------------------------------------------------
| REUSABLE UPLOADER FACTORY
|--------------------------------------------------------------------------
*/

export const createUploader = ({
  fileSize = 5,
  allowedMimeTypes = [],
  useMemoryStorage = false,
} = {}) => {
  return multer({
    storage: useMemoryStorage ? memoryStorage : diskStorage,

    limits: {
      fileSize: fileSize * 1024 * 1024,
    },

    fileFilter: (req, file, cb) => {
      const isAllowed = allowedMimeTypes.some((type) =>
        file.mimetype.startsWith(type),
      );

      if (!isAllowed) {
        return cb(new Error("Invalid file type"), false);
      }

      cb(null, true);
    },
  });
};

/*
|--------------------------------------------------------------------------
| AVATAR UPLOAD
|--------------------------------------------------------------------------
*/

export const avatarUpload = createUploader({
  fileSize: 2,
  allowedMimeTypes: ["image"],
  useMemoryStorage: true,
});

/*
|--------------------------------------------------------------------------
| POST UPLOAD
|--------------------------------------------------------------------------
*/

export const postUpload = createUploader({
  fileSize: 100,
  allowedMimeTypes: ["image", "video"],
});