import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/user.model.js";
import Session from "../models/session.model.js";

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.session;

  if (!token) {
    return res.status(401).json({
      error: "Unauthorized",
      success: false,
    });
  }

  try {
    const decoded = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).lean();
    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        success: false,
      });
    }

    req.user = user; // Attach full user object to request

    next();
  } catch (error) {
    return res.status(401).json({
      error: "Invalid token",
      success: false,
    });
  }
};

export default authMiddleware;
