import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";

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

// ROUTES

import userRoutes from "./routes/user.routes.js";
import storyRoutes from "./routes/travelStory.routes.js";
import likeRoutes from "./routes/like.routes.js";

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/travelStory", storyRoutes);
app.use("/api/v1/likes", likeRoutes);

app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.use("/static", express.static(path.join(_dirname, "public")));

app.get("*", (_, res) => {
  res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});
app.use(errorHandler);
export { app };
