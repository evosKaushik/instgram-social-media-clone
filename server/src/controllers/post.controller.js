import cloudinary from "../config/cloudinary.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

import fs from "fs/promises";
import { createPostSchema } from "../validators/post.validator.js";
import mongoose from "mongoose";

const createPost = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one media file is required",
    });
  }

  let uploadedPublicIds = [];

  try {
    const validation = createPostSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        success: false,

        errors: validation.error.flatten().fieldErrors,
      });
    }

    const data = validation.data;

    const uploadedMedia = await Promise.all(
      req.files.map(async (file) => {
        try {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "instagram/posts",

            resource_type: "auto",
          });

          uploadedPublicIds.push(result.public_id);

          return {
            url: result.secure_url,

            publicId: result.public_id,

            type: result.resource_type,
          };
        } finally {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            console.error("Temp file delete failed:", unlinkError);
          }
        }
      }),
    );

    const post = await Post.create({
      title: data.title || "",

      caption: data.caption || "",

      media: uploadedMedia,

      owner: req.user.id,

      visibility: data.visibility || "public",

      allowComments:
        data.allowComments !== undefined ? data.allowComments : true,

      location: data.location || "",

      hashtags: data.hashtags || [],
    });

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        postsCount: 1,
      },
    });

    return res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    if (uploadedPublicIds.length > 0) {
      await Promise.allSettled(
        uploadedPublicIds.map((publicId) =>
          cloudinary.uploader.destroy(publicId, {
            resource_type: "auto",
          }),
        ),
      );
    }

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create post",
    });
  }
};

const getPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "owner",
      "name username avatar isBlueTick",
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    return res.json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getFeedPosts = async (req, res, next) => {
  try {
    let {
      limit = 10,
      cursor,
      hashtag,
      type,
      visibility = "public",
    } = req.query;

    limit = Number(limit);

    if (Number.isNaN(limit) || limit < 1) {
      limit = 10;
    }

    limit = Math.min(limit, 50);

    const query = {
      visibility,
    };

    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor)) {
        return res.status(400).json({
          success: false,
          message: "Invalid cursor",
        });
      }

      query._id = {
        $lt: cursor,
      };
    }

    if (hashtag) {
      query.hashtags = hashtag.trim().toLowerCase();
    }

    if (type && ["image", "video"].includes(type)) {
      query["media.type"] = type;
    }

    const posts = await Post.find(query)
      .sort({ _id: -1 })
      .limit(limit + 1)
      .populate("owner", "name username avatar isBlueTick")
      .select(
        `
          title
          caption
          media
          visibility
          hashtags
          location
          likesCount
          commentsCount
          sharesCount
          savesCount
          createdAt
          owner
        `,
      )
      .lean();

    let nextCursor = null;

    if (posts.length > limit) {
      const nextItem = posts.pop();

      nextCursor = nextItem._id.toString();
    }

    const transformedPosts = posts.map((post) => ({
      id: post._id.toString(),

      title: post.title,

      caption: post.caption,

      visibility: post.visibility,

      hashtags: post.hashtags,

      location: post.location,

      likesCount: post.likesCount,

      commentsCount: post.commentsCount,

      sharesCount: post.sharesCount,

      savesCount: post.savesCount,

      createdAt: post.createdAt,

      media: post.media.map((item) => ({
        id: item._id?.toString?.(),

        url: item.url,

        type: item.type,
      })),

      owner: {
        id: post.owner._id.toString(),

        name: post.owner.name,

        username: post.owner.username,

        avatar: post.owner.avatar,

        isBlueTick: post.owner.isBlueTick,
      },
    }));

    return res.status(200).json({
      success: true,

      posts: transformedPosts,

      pagination: {
        limit,

        nextCursor,

        hasMore: Boolean(nextCursor),
      },
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    post.caption = req.body.caption || post.caption;

    await post.save();

    return res.json({
      success: true,
      post,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post id",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (post.media.length > 0) {
      await Promise.allSettled(
        post.media.map((item) =>
          cloudinary.uploader.destroy(item.publicId, {
            resource_type: item.type,
          }),
        ),
      );
    }

    await post.deleteOne();

    await User.findByIdAndUpdate(req.user.id, {
      $inc: {
        postsCount: -1,
      },
    });

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete post",
    });
  }
};

export { createPost, getPost, getFeedPosts, updatePost, deletePost };
