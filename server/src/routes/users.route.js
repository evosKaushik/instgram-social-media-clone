import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getUserById,
  getUserByNameAndUsername,
  updateUser,
  changePassword,
  updateAvatar
} from "../controllers/users.controller.js";
import { createUploader } from "../middlewares/multer.middleware.js";

const avatarUpload = createUploader({ fileSize: 2 });
const router = Router();

router.get("/:userId", getUserById);
router.get("/", getUserByNameAndUsername);
router.patch("/", authMiddleware, updateUser);
router.post("/change-password/", authMiddleware, changePassword);
router.patch("/avatar", authMiddleware, avatarUpload.single("avatar"), updateAvatar);

export default router;
