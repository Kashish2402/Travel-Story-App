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
  changeUserDetails,
  googleOAuth,
} from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import passport from "passport";

const router = Router();

// ROUTES FOR GOOGLE O AUTH
router.route("/google").get(passport.authenticate("google", { scope: ["profile", "email"] }))

router.route("/google/callback").get(passport.authenticate("google", {
  failureRedirect: "https://travel-story-app-xxsu.onrender.com/login",
  session: false,
}), googleOAuth
)
// ROUTES
router.route("/signUp").post(signUp);
router.route("/login").post(login);
router.route("/logout").post(verifyJWT, logout);
router.route("/get-current-user").get(verifyJWT, getCurrentUser);
router.route("/edit-user-details").patch(verifyJWT, changeUserDetails)
router
  .route("/update-profilePic")
  .patch(verifyJWT, upload.single("avatarImage"), updateAvatarImage);
router
  .route("/update-coverImage")
  .patch(verifyJWT, upload.single("coverImagelocalPath"), updateCoverImage);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/refresh-token").patch(verifyJWT, refreshAccessToken);
export default router;
