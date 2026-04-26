/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */

import User from "../models/user.model.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { generateSession } from "../utils/generateSession.js";
import { loginSchema, registerSchema } from "../validators/auth.validator.js";

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

    const { accessToken, refreshToken } = await generateSession(user, req, res);

    // TODO: Store refreshToken in DB Session

    res.status(200).json({
      message: "Login successful",
      success: true,
      data: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        bio: user.bio,
      },
      session: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export { userRegister, userLogin };
