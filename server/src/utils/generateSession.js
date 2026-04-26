import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";

// 🔐 helper to sign tokens
const signAccessToken = (user, accessTokenExpiresAt) => {
  return jwt.sign(
    {
      id: user._id,
    },
    ENV.ACCESS_TOKEN_SECRET,
    { expiresIn: accessTokenExpiresAt },
  );
};

const signRefreshToken = (user, refreshTokenExpiresAt) => {
  return jwt.sign(
    {
      id: user._id,
    },
    ENV.REFRESH_TOKEN_SECRET,
    { expiresIn: refreshTokenExpiresAt },
  );
};

// 🧠 MAIN FUNCTION
export const generateSession = async ({
  user,
  req,
  res,
  refreshTokenExpiresAt = "30d",
  accessTokenExpiresAt = "15m",
}) => {
  // 1. Generate tokens
  const accessToken = signAccessToken(user, accessTokenExpiresAt);
  const refreshToken = signRefreshToken(user, refreshTokenExpiresAt);

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
  }

  // 6. Return response (mobile NEEDS tokens)
  return {
    accessToken,
    refreshToken,
  };
};
