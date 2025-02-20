import express from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware.js";
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));
app.use(cookieParser());

// ROUTES

import userRoutes from './routes/user.routes.js'
import storyRoutes from './routes/travelStory.routes.js'

app.use("api/v1/users",userRoutes)
app.use("api/v1/travelStory",storyRoutes)

app.use(errorHandler);
export { app };
