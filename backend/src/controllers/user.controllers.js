import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.accessToken = accessToken;
    user.refreshToken = refreshToken;

    user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    return next(
      new ApiError(
        400,
        "Something went wrong while generate access token and refresh token..."
      )
    );
  }
};

const signUp = asyncHandler(async (req, res, next) => {
  const { fullName, email, age, password, gender } = req.body;

  if (!fullName || !email || !age || !password || !gender)
    return next(new ApiError(200, "FullName, email,age,password required..."));

  const existingUser = await User.findOne({ email });
  if (existingUser)
    return next(
      new ApiError(
        409,
        "Unable to create Account... User Account already exists.."
      )
    );

  const user = await User.create({
    fullName,
    email,
    password,
    gender,
  });

  const createUser = await findById(user?._id).select(
    "-password, -refreshToken"
  );

  if (!user)
    return next(
      new ApiError(500, "Something went wrong... Unable to create User")
    );

  return res
    .status(200)
    .json(
      new ApiResponse(200, createUser, "User Account Created Successfully!!...")
    );
});

const login = asyncHandler(async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return next(new ApiError(400, "Credentials Required for login.."));

  const user = await User.findOne({ username }, { email });

  if (!user) return next(new ApiError(404, "User Not Found"));

  const validatePassword = await user.isPasswordCorrect(password);

  if (!validatePassword) return next(new ApiError(400, "Wrong Password..."));

  const loggedInUser = await findById(user?._id).select(
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
  await findByIdAndUpdate(
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

export { signUp, login, logout };
