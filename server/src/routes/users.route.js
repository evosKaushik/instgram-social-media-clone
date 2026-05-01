import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  getUserByUsername,
  getUserByNameAndUsername,
  updateUser,
  changePassword,
  updateAvatar,
} from "../controllers/users.controller.js";
import { createUploader } from "../middlewares/multer.middleware.js";
import { acceptRequest, followUser, getFollowers, rejectRequest, unfollowUser } from "../controllers/follow.controller.js";

const avatarUpload = createUploader({ fileSize: 2 });
const router = Router();

router.get("/:username", getUserByUsername);
router.get("/", getUserByNameAndUsername);
router.patch("/", authMiddleware, updateUser);
router.post("/change-password/", authMiddleware, changePassword);
router.patch(
  "/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  updateAvatar,
);

/*-------------------------------------------*/

router.post("/follow/:username", authMiddleware, followUser);
router.delete("/unfollow/:username",authMiddleware, unfollowUser);

router.post("/request/:requestId/accept",authMiddleware,  acceptRequest);
router.post("/request/:username/reject",authMiddleware,  rejectRequest);

router.get("/followers/:username",authMiddleware, getFollowers);

export default router;
