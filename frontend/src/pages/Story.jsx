import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../features/travelStorySlice";
import { formatDate, formatDateOfBirth } from "../utils/formatDate";
import { toggleLike } from "../features/likeSlice";
import { BiLike, BiSolidLike } from "react-icons/bi";

function Story() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  const navigate = useNavigate();
  const { stories } = useSelector((state) => state.story);
  let storyDetails = stories.filter((story) => id === story._id);

  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);


  const handleLike = async () => {
    try {
      const response = await dispatch(toggleLike(storyDetails[0]?._id)).unwrap();
      setLiked(response.isLiked);
      setTotalLikes(response.totalLikes);
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  console.log("Story detail: ", storyDetails);

  return (
    <div className="h-full w-full">
      <Navbar />

      <div className="pt-26 w-full flex flex-col gap-4">
        {/* STORY IMAGE */}
        <div className="h-70 w-full overflow-hidden ">
          <img
            src={storyDetails[0]?.imageUrl || "/OIP.jpeg"}
            alt="storyImage"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* USER DETAILS */}

        <div className="md:w-[70%] w-full  mx-auto bg-gray-600/80 backdrop-blur-2xl rounded-3xl p-3 flex gap-3 items-center -mt-26">
          <div className="w-14 h-14 rounded-full overflow-hidden">
            {storyDetails[0]?.user?.profilePic ? (
              <img src={storyDetails[0]?.user?.profilePic} />
            ) : (
              <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white">
                {storyDetails[0]?.user?.username?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-white">{storyDetails[0]?.user?.username}</h1>
          </div>
        </div>

        {/* STORY DETAILS */}

        <div className="md:w-[70%] w-full  mx-auto bg-gray-600/20 px-5 py-8 flex flex-col rounded-3xl items-center gap-8 ">
          <div className="w-full flex gap-3 items-center flex-wrap">
            {storyDetails[0]?.visitedLocations.map((location) => (
              <div
                key={location}
                className="bg-gray-600/60 rounded-2xl p-1 text-sm text-white/50"
              >
                # {location}
              </div>
            ))}
          </div>
          <div className="w-full h-full">
            <h1 className="text-4xl font-bold text-white/60 italic">
              {storyDetails[0]?.title}
            </h1>
          </div>

          <div className="w-full h-full">
            <p className="text-white/50 tracking-tight italic">
              {storyDetails[0]?.description}
            </p>
          </div>

          <div className="w-full h-full">
            <span className="text-white font-semibold">
              Visited Locations : &#91;
            </span>
            {storyDetails[0]?.visitedLocations.map((location, index, arr) => (
              <span key={location} className="text-sm text-white/70">
                {location}
                {index !== arr.length - 1 ? ", " : ""}{" "}
              </span>
            ))}
            <span className="text-white font-semibold">&#93;</span>
          </div>

          <div className="w-full h-full">
            <span className="text-white font-semibold">Visited Date : </span>
            <span className="text-sm text-white/70">
              {formatDateOfBirth(storyDetails[0]?.visitedDate)}
            </span>
          </div>

          <div className="w-full h-full flex items-center justify-between">
            <div className="flex items-center justify-center gap-2">
              <div
                className="text-white/60 text-2xl cursor-pointer"
                onClick={handleLike}
              >
                {liked ? <BiSolidLike /> : <BiLike />}
              </div>
              <div className="text-white">{totalLikes}</div>
            </div>

            <div className="text-white/40 text-sm">
              {!storyDetails[0]?.updatedAt
                ? "Created on " + formatDate(storyDetails[0]?.createdAt)
                : "Last Updated on " + formatDate(storyDetails[0]?.updatedAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Story;
