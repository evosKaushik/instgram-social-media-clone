import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

// 🔐 helper to sign tokens
const signAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" },
  );
};

const signRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: "30d" },
  );
};

// 🧠 MAIN FUNCTION
export const generateSession = async (user, req, res) => {
  // 1. Generate tokens
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  // 2. Detect client (mobile vs web)
  const isMobile =
    req.headers["x-platform"] === "mobile" ||
    req.headers["user-agent"]?.toLowerCase().includes("okhttp"); // common RN/Android

  // 3. Cookie options (for web only)
  const cookieOptions = {
    httpOnly: true,
    secure: ENV.NODE_ENV === "production",
    sameSite: "Strict",
  };

  // 4. Set cookies ONLY for web
  if (!isMobile) {
    res.cookie("session", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 min
    });

    // res.cookie("refreshToken", refreshToken, {
    //   ...cookieOptions,
    //   maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    // });
  }

  // 5. (Optional but IMPORTANT) store refresh token in DB
  // 👉 you should implement this in your user/session model
  // await Session.create({ userId: user._id, refreshToken });

  // 6. Return response (mobile NEEDS tokens)
  return {
    accessToken,
    refreshToken,
  };
};
