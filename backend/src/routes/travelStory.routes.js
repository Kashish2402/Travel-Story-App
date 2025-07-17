import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import {
  addStory,
  deleteStory,
  editStory,
  filterStories,
  getAllStories,
  getUserStories,
  searchStory,
  updateIsFavourite,
} from "../controllers/travelStory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-travel-story").post(upload.fields([{ name: "imageUrl", maxCount: 10 }]), addStory);
router.route("/fetch-all-stories").get(getAllStories);
router.route("/fetch-user-stories").get(getUserStories);
router
  .route("/update-story/:postId")
  .patch(upload.fields([{ name: "imageUrl", maxCount: 10 }]), editStory);
router.route("/delete/:postId").delete(deleteStory);
router.route("/updateIsFavourite/:postId").patch(updateIsFavourite);

router.route("/search").get(searchStory);
router.route("/filter").get(filterStories);

export default router;
