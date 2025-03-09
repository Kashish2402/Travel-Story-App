import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { Dot, Edit, X } from "lucide-react";
import { formatDateOfBirth } from "../../utils/formatDate";
import { getUserStories } from "../../features/travelStorySlice";
import { getLikedStories } from "../../features/likeSlice";
import UserPosts from "../../components/UserPosts";
import LikePosts from "../../components/LikePosts";

function Profile() {
  const [tab, setTab] = useState("your-posts");
  const { authUser } = useSelector((state) => state.auth);
 
  const { yourStories } = useSelector((state) => state.story);
  const { likedStories } = useSelector((state) => state.like);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserStories());
  }, [dispatch]);

  useEffect(()=>{
    dispatch(getLikedStories())
  },[dispatch])

 

  const handleEdit = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <Navbar />
      <div className="w-[70%] mx-auto flex flex-col items-center justify-center pt-26">
        <div className="relative w-full h-full mb-24">
          <div className="w-full h-56 shadow-2xl">
            <img
              src={authUser?.coverImage || "/OIP.jpeg"}
              alt="Cover"
              className="w-full h-full object-center object-cover"
            />
          </div>

          <div className="h-44 w-44 bg-blue-700 rounded-full absolute -bottom-20 left-1/2 -translate-x-1/2 flex items-center justify-center">
            {authUser?.profilePic ? (
              <img
                src={authUser?.profilePic}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className="text-6xl font-bold text-white/70">
                {authUser?.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center">
          <span className="text-2xl text-white/80 font-bold">
            {authUser?.fullName}
          </span>
          <span className="text-white/50 font-bold">
            <Dot size={30} />
          </span>
          <span className="text-white/30">{authUser?.username}</span>
        </div>

        <div className="w-3/4 mt-10 flex flex-col divide-y divide-gray-500/50 gap-4 relative">
          <button
            className="absolute -top-10 text-white/70 right-0 cursor-pointer"
            onClick={handleEdit}
          >
            <Edit />
          </button>
          <div className="flex items-center justify-between pb-4">
            <span className="text-white/60">Email Address</span>

            <span className="text-white/40">{authUser?.email}</span>
          </div>

          <div className="flex items-center justify-between pb-4">
            <span className="text-white/60">D.O.B.</span>

            <span className="text-white/40">
              {formatDateOfBirth(authUser?.dateOfBirth)}
            </span>
          </div>

          <div className="flex items-center justify-between pb-4">
            <span className="text-white/60">Gender</span>

            <span className="text-white/40">{authUser?.gender}</span>
          </div>
        </div>

        <div className="w-[90%] mt-10 mx-auto divide-y-2 divide-gray-500/50 gap-2">
          <div className="w-full flex text-white">
            <div
              className={`w-1/2 text-center border-b-4  ${
                tab === "your-posts" ? "border-gray-400" : "border-transparent"
              } cursor-pointer`}
              onClick={() => setTab("your-posts")}
            >
              Your Posts
            </div>
            <div
              className={`w-1/2 text-center border-b-4 ${
                tab === "liked-posts" ? "border-gray-400" : "border-transparent"
              } cursor-pointer`}
              onClick={() => setTab("liked-posts")}
            >
              Liked Posts
            </div>
          </div>

          {tab === "your-posts" && yourStories?.length > 0 && <UserPosts />}

          {tab === "your-posts" && yourStories.length === 0 && (
            <div className="text-lg tracking-wide text-white/40 w-full text-center pt-20">
              No Posts By User Available
            </div>
          )}

          {tab === "liked-posts" && likedStories?.length > 0 && <LikePosts />}
          {tab === "liked-posts" && likedStories.length === 0 && (
            <div className="text-lg tracking-wide text-white/40 w-full text-center pt-20">
              No Liked Posts Available
            </div>
          )}
        </div>
      </div>

      
    </div>
  );
}

export default Profile;
