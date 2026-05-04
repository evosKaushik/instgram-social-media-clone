import mongoose, { isValidObjectId } from "mongoose";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import FollowRequest from "../models/followRequest.model.js";

/* ---------------- FOLLOW ---------------- */

export const followUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const followerId = req.user.id;
    const { username } = req.params;

    const targetUser = await User.findOne({ username }).session(session);
    if (!targetUser) throw new Error("User not found");

    if (targetUser._id.toString() === followerId) {
      throw new Error("Cannot follow yourself");
    }

    const followingId = targetUser._id;

    const alreadyFollowing = await Follow.exists({
      followerId,
      followingId,
    }).session(session);

    if (alreadyFollowing) {
      return res.status(409).json({
        success: false,
        message: "Already following",
      });
    }

    // 🔐 PRIVATE ACCOUNT
    if (targetUser.isPrivate) {
      const existingRequest = await FollowRequest.findOne({
        senderId: followerId,
        receiverId: followingId,
      }).session(session);

      if (existingRequest) {
        throw new Error("Request already sent");
      }

      await FollowRequest.create(
        [{ senderId: followerId, receiverId: followingId }],
        { session }
      );

      await session.commitTransaction();
      return res.json({ success: true, message: "Request sent" });
    }

    // 🌍 PUBLIC ACCOUNT
    await Follow.create(
      [{ followerId, followingId }],
      { session }
    );

    await User.updateOne(
      { _id: followerId },
      { $inc: { followingCount: 1 } },
      { session }
    );

    await User.updateOne(
      { _id: followingId },
      { $inc: { followersCount: 1 } },
      { session }
    );

    await session.commitTransaction();

    res.json({ success: true, message: "Followed" });

  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

/* ---------------- UNFOLLOW ---------------- */

export const unfollowUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const followerId = req.user.id;
    const { username } = req.params;

    const targetUser = await User.findOne({ username }).session(session);
    if (!targetUser) throw new Error("User not found");

    const followingId = targetUser._id;

    const deleted = await Follow.findOneAndDelete(
      { followerId, followingId },
      { session }
    );

    if (!deleted) throw new Error("Not following");

    await User.updateOne(
      { _id: followerId },
      { $inc: { followingCount: -1 } },
      { session }
    );

    await User.updateOne(
      { _id: followingId },
      { $inc: { followersCount: -1 } },
      { session }
    );

    await session.commitTransaction();

    res.json({ success: true, message: "Unfollowed" });

  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

/* ---------------- FOLLOW STATUS ---------------- */

export const getFollowerStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid userId",
      });
    }

    const exists = await Follow.exists({
      followerId: req.user._id,
      followingId: userId,
    });

    res.json({
      success: true,
      isFollowing: !!exists,
    });

  } catch (err) {
    next(err);
  }
};

/* ---------------- FOLLOWERS LIST ---------------- */

export const getFollowers = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) throw new Error("User not found");

    const followers = await Follow.find({ followingId: user._id })
      .populate("followerId", "username avatar")
      .lean();

    res.json({ success: true, followers });

  } catch (err) {
    next(err);
  }
};

/* ---------------- REQUESTS ---------------- */

export const getFollowersRequest = async (req, res, next) => {
  try {
    const requests = await FollowRequest.find({
      receiverId: req.user.id,
    })
      .populate("senderId", "username avatar")
      .lean();

    res.json({ success: true, requests });

  } catch (err) {
    next(err);
  }
};

export const acceptRequest = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const { requestId } = req.params;

    const request = await FollowRequest.findById(requestId).session(session);
    if (!request) throw new Error("Request not found");

    await Follow.create(
      [{ followerId: request.senderId, followingId: request.receiverId }],
      { session }
    );

    await FollowRequest.deleteOne({ _id: requestId }).session(session);

    await session.commitTransaction();

    res.json({ success: true, message: "Accepted" });

  } catch (err) {
    await session.abortTransaction();
    next(err);
  } finally {
    session.endSession();
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { requestId } = req.params;

    await FollowRequest.deleteOne({ _id: requestId });

    res.json({ success: true, message: "Rejected" });

  } catch (err) {
    next(err);
  }
};