import { Router } from "express";
import {
  changePassword,
  getCurrentUser,
  login,
  logout,
  refreshAccessToken,
  signUp,
  updateCoverImage,
  updateAvatarImage,
  changeUserDetails
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/edit-user-details").patch(verifyJWT,changeUserDetails)
router
  .route("/update-profilePic")
  .patch(verifyJWT, upload.single("avatarImage"), updateAvatarImage);
router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImagelocalPath"), updateCoverImage);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/refresh-token").patch(verifyJWT, refreshAccessToken);
export default router;
