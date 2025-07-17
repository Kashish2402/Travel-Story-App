import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs"
import session from "express-session"
import "./utils/Passport.js";

const app = express();

const _dirname = path.resolve();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
// app.use(express.static("public"));
app.use(cookieParser());

app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))

app.use(passport.initialize())
app.use(passport.session())

// ROUTES

import userRoutes from "./routes/user.routes.js";
import storyRoutes from "./routes/travelStory.routes.js";
import likeRoutes from "./routes/like.routes.js";
import passport from "passport";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/travelStory", storyRoutes);
app.use("/api/v1/likes", likeRoutes);

const tempDir = path.join(process.cwd(), "public/temp"); 
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.use("/static", express.static(path.join(_dirname, "public")));

app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
app.use(errorHandler);
export { app };
