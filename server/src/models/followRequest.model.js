import mongoose from "mongoose";

const followRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// prevent duplicate requests
followRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

const FollowRequest = mongoose.model(
  "FollowRequest",
  followRequestSchema,
);

export default FollowRequest