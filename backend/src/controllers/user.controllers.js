import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generate access token and refresh token..."
    );
  }
};

const signUp = asyncHandler(async (req, res, next) => {
  const { fullName, email, username, dateOfBirth, password, gender } = req.body;

  if (!fullName && !email && !username && !dateOfBirth && !password && !gender)
    return next(
      new ApiError(200, "FullName, email,dateOfBirth,password required!!!")
    );

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(
      new ApiError(
        409,
        "Unable to create Account... User Account already exists!!!"
      )
    );

  const user = await User.create({
    fullName,
    email,
    password,
    gender,
    dateOfBirth,
    username,
  });

  const createUser = await User.findById(user?._id).select(
    "-password, -refreshToken"
  );

  if (!user)
    return next(
      new ApiError(500, "Something went wrong... Unable to create User!!!")
    );
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, createUser, "User Account Created Successfully...")
    );
});

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password)
    return next(new ApiError(400, "Credentials Required for login!!"));

  const user = await User.findOne({ email });

  if (!user) return next(new ApiError(404, "User Not Found!!"));

  const validatePassword = await user.isPasswordCorrect(password);

  if (!validatePassword) return next(new ApiError(400, "Wrong Password!!"));

  const loggedInUser = await User.findById(user?._id).select(
    "-password, -refreshToken"
  );

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged In Successfully..."
      )
    );
});

const logout = asyncHandler(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out Successfully..."));
});

const changeUserDetails = asyncHandler(async (req, res, next) => {
  const { fullName, dateOfBirth, gender } = req.body;

  if (!fullName || !dateOfBirth || !gender)
    return next(
      new ApiError("FullName or age or gender required to update details!!!")
    );
  console.log(req?.user);
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullName,
        dateOfBirth,
        gender,
      },
    },
    {
      new: true,
    }
  ).select("-password -refreshToken");

  if (!user)
    return next(
      new ApiError(
        401,
        "Something went wrong.. Unable to update user details!!"
      )
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, User, "User Account Details Updated Successfully..")
    );
});

const updateAvatarImage = asyncHandler(async (req, res, next) => {
  const avatarImage = req.file?.path;

  if (!avatarImage) return next(new ApiError(404, "Couldn't Find File"));

  const avatar = await uploadOnCloudinary(avatarImage);

  if (!avatar)
    return next(
      new ApiError(
        401,
        "Something went wrong... while uploading file on server!!!"
      )
    );

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        profilePic: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user)
    return next(
      new ApiError(401, "Something went wrong.. while updating Avatar Image")
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, user, "Profile Picture Updated Successfully...")
    );
});

const updateCoverImage = asyncHandler(async (req, res, next) => {
  const coverImagelocalPath = req.file?.path;

  if (!coverImagelocalPath)
    return next(new ApiError(404, "Couldn't Find File"));

  const coverImage = await uploadOnCloudinary(coverImagelocalPath);

  if (!coverImage)
    return next(
      new ApiError(
        401,
        "Something went wrong... while uploading file on server!!!"
      )
    );

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImage.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  if (!user)
    return next(
      new ApiError(401, "Something went wrong.. while updating Cover Image")
    );

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Cover Image Updated Successfully..."));
});

const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!(oldPassword && newPassword && confirmNewPassword))
    return next(new ApiResponse(404, "All fields Required!!!"));

  if (newPassword !== oldPassword)
    return next(
      new ApiError(400, "New Password & Confirm New Password must be same!!!")
    );

  const user = await User.findById(req.user?._id);

  if (!user) return next(new ApiError(400, "User not found!!!"));

  const validatePassword = await user.isPasswordCorrect(oldPassword);

  if (!validatePassword)
    return next(new ApiError(400, "Wrong Old Password!!!"));

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        password: newPassword,
      },
    },
    {
      new: true,
    }
  ).select("-passsword,-refreshToken");

  res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Password changed Successfully...")
    );
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  let incomingRefreshToken =
    req.cookies.accessToken || req.body.refreshAccessToken;

  if (!incomingRefreshToken)
    return next(new ApiError(400, "UNAUTHORISED REQUEST!!"));

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN
    );
    if (!decodedToken) return next(new ApiError(400, "Unauthorised TOKEN"));

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      return next(new ApiError(401, "INVALID REFRESH TOKEN "));
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return next(new ApiError(401, "Refresh Token is expired or used"));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user?._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(200, user, "Access Token Refreshed successfully!!")
      );
  } catch (error) {
    return next(new ApiError(401, error?.message || "INVALID REFRESH TOKEN"));
  }
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Fetched Successfully!! "));
});

const googleOAuth = asyncHandler(async (req, res, next) => {
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    req.user?._id
  );

  if (!accessToken & !refreshToken)
    return next(
      new ApiError(400, "Something went wrong while generating tokens")
    );

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };
  const user = await User.findById(req.user?._id);
  if (!user) return next(new ApiError(404, "User Not found"));

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .redirect("https://travel-story-app-xxsu.onrender.com/dashboard");
});


export {
  signUp,
  login,
  logout,
  changeUserDetails,
  updateAvatarImage,
  updateCoverImage,
  changePassword,
  refreshAccessToken,
  getCurrentUser,
  googleOAuth,
};
