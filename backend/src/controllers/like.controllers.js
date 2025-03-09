import mongoose, { isValidObjectId } from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const toggleLike = asyncHandler(async (req, res, next) => {
  const { storyId } = req.params;

  if (!req.user) return next(new ApiError(400, "User not logged in"));

  if (!isValidObjectId(storyId))
    return next(new ApiError(400, "Travel Story doesn't exist"));

  const like = await Like.findOne({ storyId: storyId, userId: req.user?._id });

  if (like) {
    await Like.findByIdAndDelete(like?._id);
    const totalLikes = await Like.countDocuments({ storyId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: false, totalLikes },
          "Unliked Video Successfully"
        )
      );
  } else {
    await Like.create({
      userId: req.user._id,
      storyId,
    });

    const totalLikes = await Like.countDocuments({ storyId });
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { isLiked: true, totalLikes },
          "Liked Video Successfully"
        )
      );
  }
});

const getLikedStories = asyncHandler(async (req, res, next) => {
  const likedStories = await Like.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "stories",
        localField: "storyId",
        foreignField: "_id",
        as: "storyDetails",
      },
    },
    { $unwind: "$storyDetails" },
    {
      $lookup: {
        from: "users",
        localField: "storyDetails.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $lookup: {
        from: "likes",
        localField: "storyDetails._id",
        foreignField: "storyId",
        as: "story_likes",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$story_likes" },
        isLiked: {
          $in: [new mongoose.Types.ObjectId(req.user?._id), "$story_likes.userId"],
        },
      },
    },
    {
      $project: {
        _id: "$storyDetails._id",
        title: "$storyDetails.title",
        description: "$storyDetails.description",
        imageUrl: "$storyDetails.imageUrl",
        visitedDate: "$storyDetails.visitedDate",
        createdAt: "$storyDetails.createdAt",
        updatedAt: "$storyDetails.updatedAt",
        user: {
          username: "$user.username",
          profilePic: "$user.profilePic.url",
        },
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedStories, "Liked Stories fetched Successfully")
    );
});


export { toggleLike, getLikedStories };
