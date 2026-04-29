/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

import { UAParser } from "ua-parser-js";
import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateSession } from "../utils/generateSession.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";
import Session from "../models/session.model.js";
import { createSession } from "../services/session.service.js";
import { ENV } from "../config/env.js";
import { hashToken } from "../utils/utils.js";
import jwt from "jsonwebtoken";

const userRegister = async (req, res, next) => {
  const { name, username, email, password } = req.body;
  // Basic validation
  if (!name || !username || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }
  // Validate input using Zod schema
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    const formattedErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value[0],
      ]),
    );
    return res.status(400).json({
      error: "Invalid input data",
      success: false,
      errors: formattedErrors,
    });
  }
  try {
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).lean(); // Check if email or username already exists
    if (existingUser) {
      return res.status(400).json({
        error: "Email or username already exists",
        success: false,
      });
    }

    // Hash the password before saving
    const hashedPassword = await hashPassword(password);
    // Save user to DB
    const createdUser = await User.insertOne({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      success: true,
      data: {
        id: createdUser.id,
        name: createdUser.name,
        username: createdUser.username,
        email: createdUser.email,
        bio: createdUser.bio,
      },
    });
  } catch (error) {
    next(error);
  }
};

const userLogin = async (req, res, next) => {
  const { email, username, password } = req.body;
  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ error: "email or username and password are required" });
  }

  // Validate input using Zod schema
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    const formattedErrors = Object.fromEntries(
      Object.entries(parsed.error.flatten().fieldErrors).map(([key, value]) => [
        key,
        value[0],
      ]),
    );
    return res.status(400).json({
      error: "Invalid input data",
      success: false,
      errors: formattedErrors,
    });
  }

  try {
    const user = await User.findOne({ $or: [{ email }, { username }] }).select(
      "+password",
    );
    if (!user || !user.password) {
      return res.status(400).json({
        error: "Invalid credentials",
        success: false,
      });
    }

    const isMatchedPassword = await comparePassword(password, user.password);

    if (!isMatchedPassword) {
      return res.status(400).json({
        error: "Invalid credentials",
        success: false,
      });
    }

    const { accessToken, refreshToken } = await generateSession({
      user,
      req,
      res,
    });

    const session = await createSession({
      userId: user._id,
      req,
      res,
      refreshToken,
    }); // Store session in DB

    if (!session) {
      return res.status(500).json({
        error: "Failed to create session",
        success: false,
      });
    }

    res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
        isBlueTick: user.isBlueTick,
        isPrivate: user.isPrivate,
      },
      session: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

const userLogout = async (req, res, next) => {
  try {
    const sessionId = req.sessionId;
    if (!sessionId) {
      return res.status(400).json({
        error: "No active session found",
        success: false,
      });
    }

    const session = await Session.findOneAndUpdate(
      { _id: sessionId },
      { isValid: false },
    ).lean();

    if (!session) {
      return res.status(400).json({
        error: "Session not found",
        success: false,
      });
    }

    res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

const getUser = async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      isBlueTick: user.isBlueTick,
      isPrivate: user.isPrivate,
    },
  });
};

const refreshToken = async (req, res, next) => {
  const refreshToken = req.cookies.refreshSession;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized, token not provided",
    });
  }

  try {
    const decoded = jwt.verify(refreshToken, ENV.REFRESH_TOKEN_SECRET);

    const hashedToken = hashToken(refreshToken);

    const session = await Session.findOne({
      userId: decoded.id,
      refreshToken: hashedToken,
    });

    if (!session) {
      return res.status(403).json({ message: "Session not found" });
    }

    // 3️⃣ Generate new access token
    const newAccessToken = jwt.sign(
      { id: decoded.id },
      ENV.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" },
    );

    // 5️⃣ Set cookies
    res.cookie("session", newAccessToken, {
      httpOnly: true,
      secure: ENV.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });

    return res.json({ success: true, token: newAccessToken });
  } catch (err) {
    console.log(err);
    return res.status(403).json({ error: "Invalid refresh token" });
  }
};

export { userRegister, userLogin, userLogout, getUser, refreshToken };
