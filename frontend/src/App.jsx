import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Auth from "./pages/Auth/Auth";
import { Toaster } from "react-hot-toast";
import ChangePassword from "./pages/Auth/ChangePassword";
import { getUser } from "./features/authSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateStory from "./pages/CreateStory";
import Login from "./components/Login";
import Story from "./pages/Story";
import Profile from "./pages/Profile/Profile";
import { fetchStories } from "./features/travelStorySlice";
import { getLikedStories } from "./features/likeSlice";
import LikePage from "./pages/LikePage";

function App() {
  const { authUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLikedStories());
  }, [dispatch]);

  return (
    <>
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={authUser ? <Home /> : <Auth auth="login" />}
          ></Route>
          <Route path="/login" element={<Auth auth="login" />}></Route>
          <Route path="/signup" element={<Auth auth="signup" />}></Route>
          <Route path="/change-password" element={<ChangePassword />}></Route>
          <Route
            path="/create-story"
            element={authUser ? <CreateStory /> : <Auth auth="login" />}
          ></Route>
          <Route path="/story/:id" element={<Story />}></Route>
          <Route
            path="/profile/:authUser/:id"
            element={authUser ? <Profile /> : <Auth auth="login" />}
          ></Route>
          <Route
            path="/:authUser/likedStories"
            element={authUser ? <LikePage /> : <Auth auth="login" />}
          ></Route>
        </Routes>
      </Router>
      <Toaster reverseOrder={false} />
    </>
  );
}

export default App;
