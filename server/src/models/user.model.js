import { model, Schema } from "mongoose";
import { maxLength, minLength } from "zod";

const userSchema = new Schema(
  {
    name:{
      type: String,
      required: true,
      minLength: [3, "Full name must be at least 3 characters"],
      maxLength: [16, "Full name cannot exceed 16 characters"],
      description: "Full name of the user",
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minLength: [3, "Username must be at least 3 characters"],
      maxLength: [20, "Username cannot exceed 20 characters"],
      description: "Unique username for the user",
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is invalid",
      ],
      description: "Email address for the user",
    },
    password: {
      type: String,
      required: true,
      minLength : [6, "Password must be at least 6 characters"],
      maxLength : [100, "Password cannot exceed 100 characters"],
      description: "Password for the user",
      select: false, // Don't return password by default
    },
    profilePicture: {
      type: String,
      default: "",
      description: "URL of the user's profile picture",
    },
    bio: {
      type: String,
      default: "",
      description: "User's biography",
    },
    isBlueTick: {
      type: Boolean,
      default: false,
      description: "Indicates if the user has a blue tick (verified account)",
    },
  },
  { timestamps: true, strict: "throw" },
);

const User = model("User", userSchema);

export default User;
