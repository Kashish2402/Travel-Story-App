import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import  jwt  from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token)
      return next(
        new ApiError(401, "UNAUTHORISED REQUEST - NO TOKEN PROVIDED")
      );

    const decodedTokenInformation = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedTokenInformation?._id).select(
      "-password,-refreshToken"
    );

    if (!user) return next(new ApiError(401, "INVALID ACCESS TOKEN"));

    req.user = user;

    next();
  } catch (error) {
    return next(new ApiError(400, error?.message || "INVALID ACCESS TOKEN"));
  }
});
