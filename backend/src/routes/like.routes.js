import {Router} from "express"
import { verifyJWT } from "../middlewares/authentication.middleware.js"
import { getLikedStories, toggleLike } from "../controllers/like.controllers.js"

const router=Router()

router.use(verifyJWT)

router.route("/like/:storyId").post(toggleLike)
router.route("/get-liked-stories").get(getLikedStories)

export default router