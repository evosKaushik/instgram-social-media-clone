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
import {
  acceptRequest,
  followUser,
  getFollowerStatus,
  getFollowers,
  rejectRequest,
  unfollowUser,
  getFollowersRequest,
} from "../controllers/follow.controller.js";

const avatarUpload = createUploader({ fileSize: 2 });
const router = Router();

/* ---------- FOLLOW SYSTEM ---------- */

router.get("/followersRequest", authMiddleware, getFollowersRequest);

router.post("/follow/:username", authMiddleware, followUser);
router.delete("/unfollow/:username", authMiddleware, unfollowUser);

router.post("/request/:requestId/accept", authMiddleware, acceptRequest);
router.post("/request/:requestId/reject", authMiddleware, rejectRequest);

router.get("/followers/:username", authMiddleware, getFollowers);
router.get("/follow-status/:userId", authMiddleware, getFollowerStatus);

/* ---------- USER ---------- */

router.get("/", authMiddleware, getUserByNameAndUsername);
router.get("/:username", getUserByUsername); // ALWAYS LAST

router.patch("/", authMiddleware, updateUser);
router.post("/change-password", authMiddleware, changePassword);

router.patch(
  "/avatar",
  authMiddleware,
  avatarUpload.single("avatar"),
  updateAvatar,
);

export default router;