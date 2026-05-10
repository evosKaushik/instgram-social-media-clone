import { Router } from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import {
  createPost,
  deletePost,
  getFeedPosts,
  getPost,
  updatePost,
} from "../controllers/post.controller.js";
import { postUpload } from "../middlewares/multer.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Post CRUD
|--------------------------------------------------------------------------
*/

router.post("/", authMiddleware, postUpload.array("media", 10), createPost);

router.get("/feed", authMiddleware, getFeedPosts);

router.get("/:postId", authMiddleware, getPost);

router.patch("/:postId", authMiddleware, updatePost);

router.delete("/:postId", authMiddleware, deletePost);

/*
|--------------------------------------------------------------------------
| Likes
|--------------------------------------------------------------------------
*/

// router.post("/:postId/like", authMiddleware, likePost);

export default router;
