import { Router } from "express";
import {
  userLogin,
  userRegister,
  userLogout,
  getUser,
  refreshToken,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/signup", userRegister);
router.post("/login", userLogin);
router.post("/logout", authMiddleware, userLogout);
router.post("/refresh", refreshToken);
router.get("/check", authMiddleware, getUser);

export default router;
