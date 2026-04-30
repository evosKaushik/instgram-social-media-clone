import { isValidObjectId } from "mongoose";
import User from "../models/user.model.js";
import {
  changePasswordSchema,
  updateUserSchema,
} from "../validators/user.validator.js";
import { comparePassword, hashPassword } from "../utils/bcrypt.js";
import { uploadToCloudinary } from "../utils/uploader.js";

const getUserByUsername = async (req, res, next) => {
  const { username } = req.params;
  // if (!isValidObjectId(userId))
  //   return res.status(400).json({
  //     success: false,
  //     error: "Invalid, UserId",
  //   });

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res.status(404).json({
        success: false,
        error: "User not found",
      });

    return res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    next(error);
  }
};

const getUserByNameAndUsername = async (req, res, next) => {
  const { search } = req.query;

  let filter = {};

  if (search) {
    filter = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ],
    };
  }

  try {
    const users = await User.find(filter);
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  const parsed = updateUserSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    const formattedFieldErrors = Object.fromEntries(
      Object.entries(errors.fieldErrors).map(([key, value]) => [
        key,
        value?.[0],
      ]),
    );

    return res.status(400).json({
      success: false,
      error: errors.formErrors[0] || "Invalid input data",
      errors: formattedFieldErrors,
    });
  }

  try {
    const userId = req.user.id;
    const updateData = parsed.data;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { returnDocument: true, runValidators: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};

const changePassword = async (req, res, next) => {
  const parsed = changePasswordSchema.safeParse(req.body);

  if (!parsed.success) {
    const errors = parsed.error.flatten();

    const formattedFieldErrors = Object.fromEntries(
      Object.entries(errors.fieldErrors).map(([key, value]) => [
        key,
        value?.[0],
      ]),
    );

    return res.status(400).json({
      success: false,
      error: errors.formErrors[0] || "Invalid input data",
      errors: formattedFieldErrors,
    });
  }
  const userId = req.user.id;

  const { newPassword, oldPassword } = parsed.data;
  if (!oldPassword?.trim() || !newPassword?.trim())
    return res.status(400).json({
      success: false,
      error: "Enter all the fields",
    });

  if (oldPassword === newPassword)
    return res.status(400).json({
      success: false,
      error: "Old password is same as new password",
    });

  try {
    const user = await User.findById(userId).select("+password");

    const isMatched = await comparePassword(oldPassword, user.password);

    if (!isMatched) {
      return res.status(400).json({
        success: false,
        error: "Old password is incorrect",
      });
    }

    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "instagram-clone/avatar",
      public_id: userId,
      overwrite: true,
      resource_type: "image",
      transformation: [
        {
          width: 200,
          height: 200,
          crop: "fill", // fill the box
          gravity: "face", // focus on face (smart for avatars)
        },
        {
          quality: "auto", // optimize size
          fetch_format: "auto", // webp/avif when supported
        },
      ],
    });

    // result.secure_url = image URL
    // result.public_id = needed for delete later

    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar: result.secure_url,
      },
      { returnDocument: true },
    );

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export {
  getUserByUsername,
  getUserByNameAndUsername,
  updateUser,
  changePassword,
  updateAvatar,
};
