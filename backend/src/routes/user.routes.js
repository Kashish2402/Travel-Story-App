import { Router } from "express";
import { login, signUp } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";

const router = Router();


router.route("/signUp").post(signUp)
router.route("/login").post(login)
router.route("/logout").post(verifyJWT,logout)


export default router;
