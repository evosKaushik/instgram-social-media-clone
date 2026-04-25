import { Router } from "express";
import { userRegister } from "../controllers/auth.controller.js";

const router = Router();

router.post("/login", (req, res) => {
  res.send("Login route");
});

router.post("/register", userRegister);

export default router;