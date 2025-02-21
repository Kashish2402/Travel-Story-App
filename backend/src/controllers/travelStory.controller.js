import { Story } from "../models/travelStory.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const addStory = asyncHandler(async (req, res, next) => {
  const { title, description, visitedLocation, imageUrl, visitedDate } =
    req.body;

  if (!title || !description || !visitedLocation || !imageUrl || !visitedDate)
    return next(new ApiError(400, "Fields Required"));

  visitedDate = new Date(parseInt(visitedDate));

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
    visitedLocation,
    visitedDate,
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
  const stories = await Story.find({ userId: req.user?._id }).sort({
    isFavourite: -1,
  });

  if (!stories) return next(new ApiError(400, "Unable to fetch Stories!"));

  return res
    .status(200)
    .json(200, stories, "All Stories fetched successfully...");
});

const editStory = asyncHandler(async (req, res, next) => {
  const { postId } = req.params;
  const { title, description, visitedLocation, imageUrl, visitedDate } =
    req.body;

  if (!title || !description || !visitedLocation || !imageUrl || !visitedDate)
    return next(new ApiError(400, "Fields Required"));

  if (visitedDate) visitedDate = new Date(parseInt(visitedDate));

  let image;

  if (imageUrl) {
    image = await uploadOnCloudinary(imageUrl);
    if (!image)
      return next(
        new ApiError(
          400,
          "Something went wrong... unable to upload image on server!!"
        )
      );
  }

  const story = await Story.findByIdAndUpdate(
    postId,
    {
      $set: {
        title,
        description,
        visitedLocation,
        visitedDate,
        imageUrl: image?.url,
      },
    },
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

export { addStory, getAllStories, editStory, deleteStory, updateIsFavourite };
