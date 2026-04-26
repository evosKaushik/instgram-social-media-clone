import { Router } from "express";
import { userLogin, userRegister, userLogout } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/logout",authMiddleware, userLogout);


export default router;