import mongoose from "mongoose";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import FollowRequest from "../models/followRequest.model.js";

const followUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const followerId = req.user.id;
    const followerUsername = req.user.username;
    const { username: followingUsername } = req.params;

    if (followerUsername === followingUsername) {
      throw new Error("Cannot follow yourself");
    }

    // 🔍 Find target user by username (but store id)
    const targetUser = await User.findOne({
      username: followingUsername,
    }).session(session);

    if (!targetUser) {
      throw new Error("User not found");
    }

    const followingId = targetUser._id;

    // 🔁 Already following check
    const existing = await Follow.findOne({
      followerId,
      followingId,
    }).session(session);

    if (existing) {
      throw new Error("Already following");
    }

    // 🔐 PRIVATE ACCOUNT → only create request (no counts update)
    if (targetUser.isPrivate) {
      await FollowRequest.create(
        [
          {
            senderId: followerId,
            receiverId: followingId,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      return res.json({ success: true, message: "Follow request sent" });
    }

    // 🌍 PUBLIC ACCOUNT → follow + increment counts (atomic)

    await Follow.create(
      [
        {
          followerId,
          followingId,
        },
      ],
      { session },
    );

    await User.updateOne(
      { _id: followerId },
      { $inc: { followingCount: 1 } },
      { session },
    );

    await User.updateOne(
      { _id: followingId },
      { $inc: { followersCount: 1 } },
      { session },
    );

    await session.commitTransaction();

    res.json({ success: true, message: "Followed successfully" });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
};
const unfollowUser = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const followerId = req.user.id;
    console.log(req.user);
    const { username: followingUsername } = req.params;

    // 🔍 find target by username
    const targetUser = await User.findOne({
      username: followingUsername,
    }).session(session);

    if (!targetUser) throw new Error("User not found");

    const followingId = targetUser._id;

    // ❌ delete follow
    const deleted = await Follow.findOneAndDelete(
      { followerId, followingId },
      { session },
    );

    if (!deleted) throw new Error("Not following");

    // 🔢 update counts atomically
    await User.updateOne(
      { _id: followerId },
      { $inc: { followingCount: -1 } },
      { session },
    );

    await User.updateOne(
      { _id: followingId },
      { $inc: { followersCount: -1 } },
      { session },
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
const acceptRequest = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    await session.startTransaction();

    const receiverId = req.user.id;
    const { requestId } = req.params;

    const request = await FollowRequest.findById(requestId).session(session);

    if (
      !request ||
      request.receiverId.toString() !== receiverId ||
      request.status !== "pending"
    ) {
      throw new Error("Invalid request");
    }

    const senderId = request.senderId;

    //TODO Implement Block
    // // 🚫 block check
    // const isBlocked = await Block.findOne({
    //   $or: [
    //     { blockerId: receiverId, blockedId: senderId },
    //     { blockerId: senderId, blockedId: receiverId },
    //   ],
    // }).session(session);

    // if (isBlocked) {
    //   throw new Error("Action not allowed");
    // }

    // ✅ create follow (safe)
    try {
      await Follow.create([{ followerId: senderId, followingId: receiverId }], {
        session,
      });
    } catch (err) {
      if (err.code === 11000) {
        throw new Error("Already followed");
      }
      throw err;
    }

    // ✅ update counts
    await User.updateOne(
      { _id: senderId },
      { $inc: { followingCount: 1 } },
      { session },
    );

    await User.updateOne(
      { _id: receiverId },
      { $inc: { followersCount: 1 } },
      { session },
    );

    // ❌ delete request
    await request.deleteOne({ session });

    await session.commitTransaction();

    return res.json({ success: true, message: "Request accepted" });
  } catch (err) {
    await session.abortTransaction();
    return next(err);
  } finally {
    session.endSession();
  }
};
const rejectRequest = async (req, res, next) => {
  try {
    const receiverId = req.user.id;
    const { requestId } = req.params;

    const request = await FollowRequest.findById(requestId);

    if (!request || request.receiverId.toString() !== receiverId) {
      return res
        .status(404)
        .json({ success: false, error: "Request not found" });
    }

    await FollowRequest.deleteOne({ _id: requestId });

    res.json({ success: true, message: "Request rejected" });
  } catch (err) {
    next(err);
  }
};
const getFollowers = async (req, res, next) => {
  try {
    const { username } = req.params;
    const limit = 20;
    const cursor = req.query.cursor;

    // 🔍 convert username → id
    const user = await User.findOne({
      username: username.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const query = { followingId: user._id };

    if (cursor) {
      query._id = { $lt: cursor };
    }

    const followers = await Follow.find(query)
      .sort({ _id: -1 })
      .limit(limit)
      .populate("followerId", "username avatar");

    res.status(200).json({ success: true, followers });
  } catch (err) {
    next(err);
  }
};

export { followUser, unfollowUser, acceptRequest, rejectRequest, getFollowers };
