import { model, Schema, Types } from "mongoose";

const postSchema = new Schema(
  {
    title: {
      type: String,
      trim: true,
      maxLength: [100, "Title too long"],
      default: "",
    },

    caption: {
      type: String,
      trim: true,
      maxLength: [2200, "Caption too long"],
      default: "",
    },

    media: [
      {
        url: {
          type: String,
          required: true,
          trim: true,
        },

        publicId: {
          type: String,
          required: true,
        },

        type: {
          type: String,
          enum: ["image", "video"],
          required: true,
        },
      },
    ],

    owner: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    visibility: {
      type: String,
      enum: ["public", "followers", "private"],
      default: "public",
    },

    allowComments: {
      type: Boolean,
      default: true,
    },

    location: {
      type: String,
      trim: true,
      default: "",
      maxLength: [100, "Location too long"],
    },

    hashtags: [
      {
        type: String,
        lowercase: true,
        trim: true,
        index: true,
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    sharesCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    savesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,

    strict: "throw",

    toJSON: {
      virtuals: true,

      transform: function (doc, ret) {
        ret.id = ret._id.toString();

        delete ret._id;
        delete ret.__v;

        return ret;
      },
    },
  },
);

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

postSchema.index({ owner: 1, createdAt: -1, hashtags: 1 , visibility: 1});


/*
|--------------------------------------------------------------------------
| Virtual ID
|--------------------------------------------------------------------------
*/

postSchema.virtual("id").get(function () {
  return this._id.toString();
});

const Post = model("Post", postSchema);

export default Post;