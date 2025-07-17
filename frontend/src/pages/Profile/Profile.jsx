import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { Dot, Edit, Loader2Icon, X } from "lucide-react";
import { formatDateOfBirth } from "../../utils/formatDate";
import { getUserStories } from "../../features/travelStorySlice";
import { getLikedStories } from "../../features/likeSlice";
import UserPosts from "../../components/UserPosts";
import LikePosts from "../../components/LikePosts";
import EditProfilCard from "../../components/Cards/EditProfilCard";
import { updateAvatarImage, updateCoverImage } from "../../features/authSlice";

function Profile() {
  const [tab, setTab] = useState("your-posts");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { authUser, isUpdatingImage } = useSelector((state) => state.auth);

  const [cover, setCover] = useState(authUser?.coverImage || "/OIP.jpeg");
  const [avatar, setAvatar] = useState(authUser?.profilePic);

  useEffect(() => {
    if (authUser) {
      if (authUser.coverImage) {
        setCover(authUser.coverImage);
      } else {
        setCover("/OIP.jpeg");
      }

      if (authUser.profilePic) {
        setAvatar(authUser.profilePic);
      }
    } else {
      setCover("/OIP.jpeg");
    }
  }, [authUser]);

  const { yourStories } = useSelector((state) => state.story);
  const { likedStories } = useSelector((state) => state.like);

  const dispatch = useDispatch();

  const handleCoverChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCover(imageUrl);
      const data = new FormData();
      data.append("coverImagelocalPath", file);

      dispatch(updateCoverImage(data));
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatar(imageUrl);
      const data = new FormData();
      data.append("avatarImage", file);

      dispatch(updateAvatarImage(data));
    }
  };

  useEffect(() => {
    dispatch(getUserStories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getLikedStories());
  }, [dispatch]);

  const handleEdit = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
    <div>
      <Navbar />
      <div className="w-[70%] mx-auto flex flex-col items-center justify-center pt-26">
        <div className="relative w-full h-full mb-24">
          <div className="w-full h-56 shadow-2xl relative">
            {
              <label className="absolute inset-0 cursor-pointer">
                <img
                  src={cover}
                  alt="Cover"
                  className="w-full h-full object-center object-cover"
                />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleCoverChange}
                />
              </label>
            }
          </div>

          <div className="absolute -bottom-20 left-1/2 -translate-x-1/2">
            {!isUpdatingImage ? (
              <label
                htmlFor="avatarImage"
                className="cursor-pointer block w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-md"
              >
                {authUser?.profilePic ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white text-4xl font-bold">
                    {authUser?.username?.charAt(0).toUpperCase()}
                  </div>
                )}
                <input
                  type="file"
                  id="avatarImage"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            ) : (
              <div className="w-44 h-44 flex items-center justify-center rounded-full bg-gray-500">
                <Loader2Icon size={24} className="animate-spin text-white" />
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

      {isModalOpen && (
        <EditProfilCard authUser={authUser} closeModal={handleEdit} />
      )}
    </div>
  );
}

export default Profile;
