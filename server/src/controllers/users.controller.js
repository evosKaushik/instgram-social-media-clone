import User from "../models/user.model.js";
import {
  changePasswordSchema,
  updateUserSchema,
} from "../validators/user.validator.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { uploadToCloudinary } from "../utils/uploader.js";

/* ---------------- GET USER ---------------- */

export const getUserByUsername = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username }).lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    res.json({ success: true, user });

  } catch (err) {
    next(err);
  }
};

/* ---------------- SEARCH ---------------- */

export const getUserByNameAndUsername = async (req, res, next) => {
  try {
    const { search } = req.query;

    let filter = {};
    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { username: { $regex: `^${search}`, $options: "i" } },
        ],
      };
    }

    const users = await User.find(filter).lean();

    res.json({ success: true, users });

  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE USER ---------------- */

export const updateUser = async (req, res, next) => {
  try {
    const parsed = updateUserSchema.safeParse(req.body);
    if (!parsed.success) throw new Error("Invalid data");

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      parsed.data,
      { new: true }
    ).lean();

    res.json({ success: true, user: updated });

  } catch (err) {
    next(err);
  }
};

/* ---------------- CHANGE PASSWORD ---------------- */

export const changePassword = async (req, res, next) => {
  try {
    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new Error("Invalid input");

    const user = await User.findById(req.user.id).select("+password");

    const match = await comparePassword(
      parsed.data.oldPassword,
      user.password
    );

    if (!match) throw new Error("Wrong password");

    user.password = await hashPassword(parsed.data.newPassword);
    await user.save();

    res.json({ success: true, message: "Password updated" });

  } catch (err) {
    next(err);
  }
};

/* ---------------- UPDATE AVATAR ---------------- */

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) throw new Error("No file");

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "instagram/avatar",
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { returnDocument: true }
    );

    res.json({ success: true, user: user });

  } catch (err) {
    next(err);
  }
};