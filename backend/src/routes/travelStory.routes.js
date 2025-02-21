import { Router } from "express";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import {
  addStory,
  deleteStory,
  editStory,
  getAllStories,
  updateIsFavourite,
} from "../controllers/travelStory.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.use(verifyJWT);

router.route("/create-travel-story").post(upload.single("imageUrl"), addStory);
router.route("/fetch-all-stories").get(getAllStories);
router
  .route("/update-story/:postId")
  .patch(upload.single("imageUrl"), editStory);
router.route("/delete/:postId").delete(deleteStory);
router.route("/updateIsFavourite/:postId").patch(updateIsFavourite);

export default router;
