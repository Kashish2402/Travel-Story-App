import { Story } from "../models/travelStory.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const addStory = asyncHandler(async (req, res, next) => {
  const { title, description, visitedLocations, visitedDate } = req.body;

  const imageUrl = req.file?.path;

  if (!title || !description || !visitedLocations || !imageUrl || !visitedDate)
    return next(new ApiError(400, "Fields Required"));

  const newVisitedDate = new Date(parseInt(visitedDate));

  const image = await uploadOnCloudinary(imageUrl);

  if (!image)
    return next(
      new ApiError(
        400,
        "Something went wrong... unable to upload image on server!!"
      )
    );

  const travelStory = await Story.create({
    title,
    description,
    visitedLocations,
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
  const stories=await Story.find()
  return res.status(200).json(new ApiResponse(200,stories,"All Stories fetched succcessfully"))
});

const getUserStories = asyncHandler(async (req, res, next) => {
  const stories = await Story.find({ userId: req.user?._id }).sort({
    isFavourite: -1,
  });

  if (!stories) return next(new ApiError(400, "Unable to fetch Stories!"));
  //  console.log(stories)
  return res
    .status(200)
    .json(new ApiResponse(200, stories, "All Stories fetched successfully..."));
});

const editStory = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { title, description, visitedLocations, imageUrl, visitedDate } =
    req.body;

  let updateFields = {};

  if (title) updateFields.title = title;
  if (description) updateFields.description = description;
  if (visitedLocations) updateFields.visitedLocations = visitedLocations;
  if (visitedDate) updateFields.visitedDate = new Date(parseInt(visitedDate));

  if (imageUrl) {
    const image = await uploadOnCloudinary(imageUrl);
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
  const { query } = req.query;

  if (!query) return next(new ApiError(404, "Query Required"));

  const searchResult = await Story.find({
    userId: req.user?._id,
    $or: [
      {
        title: { $regex: query, $options: "i" },
      },
      {
        description: { $regex: query, $options: "i" },
      },
      {
        visitedLocations: { $regex: query, $options: "i" },
      },
    ],
  }).sort({ isFavourite: -1 });

  if (!searchResult)
    return next(new ApiError(404, "Unable to find your intrest"));

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        searchResult,
        "Serch Results fetched successfully..."
      )
    );
});

const filterStories = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const start = new Date(parseInt(startDate));
  const end = new Date(parseInt(endDate));

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
