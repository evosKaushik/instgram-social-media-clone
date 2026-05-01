import { model, Schema } from "mongoose";
import { maxLength, minLength } from "zod";

const userSchema = new Schema(
  {
    name: {
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
      match: [
        /^(?!_)(?!.*__)[a-zA-Z0-9_]{3,20}(?<!_)$/,
        "Invalid username or consecutive underscores",
      ],
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Email is invalid",
      ],
      description: "Email address for the user",
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must be at least 6 characters"],
      maxLength: [100, "Password cannot exceed 100 characters"],
      description: "Password for the user",
      select: false, // Don't return password by default
    },
    avatar: {
      type: String,
      default:
        "https://res.cloudinary.com/dvhqwwpdl/image/upload/v1777532041/default-avatar_frnvfo.jpg",
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
    isPrivate: {
      type: Boolean,
      default: false,
      description: "Indicates if the user's account is private",
    },
    followersCount: {
      type: Number,
      default: 0,
    },
    followingCount: {
      type: Number,
      default: 0,
    },
    posts: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id.toString(); // rename _id → id

        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        delete ret.password; // extra safety

        return ret;
      },
    },
    statics: {
      findByUsername(username) {
        return this.findOne({ username });
      },
    },
  },
);

userSchema.pre("save", function (docs) {
  if (!this.bio) {
    this.bio = `Hi, I am ${this.name}`;
  }
});

userSchema.virtual("id").get(function () {
  return this._id.toString();
});

const User = model("User", userSchema);

export default User;
