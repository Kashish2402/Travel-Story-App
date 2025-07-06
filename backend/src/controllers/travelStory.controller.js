import { Story } from "../models/travelStory.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const addStory = asyncHandler(async (req, res, next) => {
  const { title, description, location, coordinates,visitedLocations, visitedDate } = req.body;

  const imageUrl = req.file?.path;

  if (!title || !description || !visitedLocations || !imageUrl || !visitedDate ||!coordinates || !location)
    return next(new ApiError(400, "Fields Required"));

  const newVisitedDate = new Date(visitedDate);

  const image = await uploadOnCloudinary(imageUrl);

  if (!image)
    return next(
      new ApiError(
        400,
        "Something went wrong... unable to upload image on server!!"
      )
    );

  let parsedVisitedLocations;
  if (typeof visitedLocations === "string") {
    try {
      parsedVisitedLocations = JSON.parse(visitedLocations);
    } catch (error) {
      return next(new ApiError(400, "Invalid visitedLocations JSON format."));
    }
  } else {
    parsedVisitedLocations = visitedLocations;
  }

  if (!Array.isArray(parsedVisitedLocations)) {
    return next(new ApiError(400, "visitedLocations must be an array."));
  }

  const travelStory = await Story.create({
    title,
    description,
    location,
    coordinates,
    visitedLocations: parsedVisitedLocations,
    visitedDate: newVisitedDate,
    imageUrl: image.url,
    userId: req.user?._id,
  });

  if (!travelStory)
    return next(
      new ApiError(400, "Something went wrong... Unable to create travel Story")
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, travelStory, "Travel story created successfully..")
    );
});

const getAllStories = asyncHandler(async (req, res, next) => {
  const stories = await Story.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "story_user_details",
      },
    },
    {
      $unwind: "$story_user_details",
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "storyId",
        as: "stories_likes",
      },
    },
    {
      $addFields: {
        likesCount: {
          $size: "$stories_likes",
        },
        isLiked: {
          $in: [req.user?._id, "$stories_likes.userId"],
        },
      },
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        visitedDate: 1,
        visitedLocations: 1,
        imageUrl: 1,
        createdAt: 1,
        updatedAt: 1,
        user: {
          username: "$story_user_details.username",
          profilePic: "$story_user_details.profilePic",
        },
        likesCount: 1,
        isLiked: 1,
      },
    },
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, stories, "All Stories fetched succcessfully"));
});

const getUserStories = asyncHandler(async (req, res, next) => {
  const stories = await Story.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        imageUrl: 1,
        visitedDate: 1,
        createdAt: 1,
        updatedAt: 1,
        user: {
          username: "$user.username",
          profilePic: "$user.profilePic",
        },
      },
    },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "storyId",
        as: "liked_stories",
      },
    },
    {
      $addFields: {
        likesCount: { $size: "$liked_stories" },
        likedUserIds: {
          $map: { input: "$liked_stories", as: "like", in: "$$like.userId" },
        },
      },
    },
    {
      $addFields: {
        isLiked: {
          $in: [new mongoose.Types.ObjectId(req.user?._id), "$likedUserIds"],
        },
      },
    },
    {
      $project: {
        liked_stories: 0,
      },
    },
  ]);

  if (!stories) return next(new ApiError(400, "Unable to fetch Stories!"));
  //  console.log(stories)
  return res
    .status(200)
    .json(new ApiResponse(200, stories, "All Stories fetched successfully..."));
});

const editStory = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { title, description,location,coordinates, visitedLocations, visitedDate } = req.body;

  let updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if(location){
   try {
     updateFields.location=location;
     updateFields.coordinates=coordinates;
   } catch (error) {
    return next(
        new ApiError(
          400,
          "Invalid location, unable to detect coordinates"
      )
   }
  }
  if (visitedLocations) {
    try {
      updateFields.visitedLocations = JSON.parse(visitedLocations);
    } catch (error) {
      return next(
        new ApiError(
          400,
          "Invalid visitedLocations format. Must be a valid JSON array."
        )
      );
    }
  }
  if (visitedDate) updateFields.visitedDate = new Date(visitedDate);

  if (req.file) {
    const imageUrl = req.file;
    const image = await uploadOnCloudinary(imageUrl.path);
    if (!image)
      return next(
        new ApiError(
          400,
          "Something went wrong... unable to upload image on server!!"
        )
      );
    updateFields.imageUrl = image.url;
  }

  const story = await Story.findByIdAndUpdate(
    postId,
    { $set: updateFields },
    { new: true }
  );

  if (!story)
    return next(
      new ApiError(400, "Something went wrong... Unable to update story")
    );

  return res
    .status(200)
    .json(new ApiResponse(200, story, "Story Updated Successfully.."));
});

const deleteStory = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const del = await Story.findByIdAndDelete(postId);

  if (!del)
    return next(
      new ApiError(400, "Something went wrong... Unable to delete story")
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, {}, "Your Travel Story Deleted Successfully...")
    );
});

const updateIsFavourite = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { isFavourite } = req.body;

  const travelStory = await Story.findOne({
    _id: IdleDeadline,
    userId: req.user?._id,
  });

  if (!travelStory) return next(new ApiError(404, "Travel Story not found"));

  travelStory.isFavourite = isFavourite;
  await travelStory.save();

  res
    .status(200)
    .json(
      new ApiResponse(200, travelStory, "IsFavourite Updated Successfully...")
    );
});

const searchStory = asyncHandler(async (req, res, next) => {
  const { query } = req?.query;

  if (!query) return next(new ApiError(400, "Query is required"));

  const searchFields = ["title", "description", "visitedLocations"];

  const searchConditions = searchFields.map((field) => ({
    [field]: { $regex: query, $options: "i" },
  }));

  const searchResult = await Story.find(
    { userId: req.user?._id, $or: searchConditions },
    "title description visitedLocations createdAt isFavourite"
  ).sort({ isFavourite: -1 });

  if (!searchResult.length)
    return next(new ApiError(404, "No matching stories found"));

  return res
    .status(200)
    .json(
      new ApiResponse(200, searchResult, "Search results fetched successfully")
    );
});

const filterStories = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(new ApiError(400, "Start date and end date are required!"));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start) || isNaN(end)) {
    return next(new ApiError(400, "Invalid date format!"));
  }

  end.setHours(23, 59, 59, 999);
  
  const filteredStories = await Story.find({
    userId: req.user?._id,
    visitedDate: { $gte: start, $lte: end },
  }).sort({ isFavourite: -1 });

  if (!filterStories)
    return next(
      new ApiError(400, "Something went wrong... Unable to filter Stories!!!")
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, filteredStories, "Fitered Stories Successfully...")
    );
});

export {
  addStory,
  getAllStories,
  editStory,
  deleteStory,
  updateIsFavourite,
  searchStory,
  getUserStories,
  filterStories,
};
