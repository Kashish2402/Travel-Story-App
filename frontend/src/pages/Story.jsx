import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories, updateStory } from "../features/travelStorySlice";
import {
  formatDate,
  formatDateOfBirth,
  formatLocation,
} from "../utils/formatDate";
import { toggleLike } from "../features/likeSlice";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { LoaderCircleIcon } from "lucide-react";
import EditStory from "../components/EditStory";
import Scroller from "../components/Scroller";
import Loading from "../components/Loading";

function Story() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { stories } = useSelector((state) => state.story);
  const { authUser } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [storyDetails, setStoryDetails] = useState([]);
  const [liked, setLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    dispatch(fetchStories()).then(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!loading && stories) {
      setStoryDetails(stories.filter((story) => id === story._id));
    }
  }, [stories, id, loading]);

  useEffect(() => {
    if (storyDetails[0]) {
      setLiked(storyDetails[0].isLiked);
      setTotalLikes(storyDetails[0].likesCount);
    }
  }, [storyDetails]);

  const handleLike = async () => {
    try {
      const response = await dispatch(
        toggleLike(storyDetails[0]?._id)
      ).unwrap();
      setLiked(response.isLiked);
      setTotalLikes(response.totalLikes);
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  const images = storyDetails[0]?.imageUrl;

  const handleEdit = () => {
    setModal(!modal);
  };

  const editStory = (id, formData) => {
    const formDataToSend = new FormData();

    formDataToSend.append("title", formData.get("title"));
    formDataToSend.append("description", formData.get("description"));
    formDataToSend.append("visitedDate", formData.get("visitedDate"));

    const visitedPlacesRaw = formData.get("visitedPlaces");

    try {
      const parsed = JSON.parse(visitedPlacesRaw);
      if (Array.isArray(parsed)) {
        formDataToSend.append("visitedPlaces", visitedPlacesRaw);
      } else {
        console.error("visitedPlaces is not an array");
        formDataToSend.append("visitedPlaces", JSON.stringify([]));
      }
    } catch (err) {
      console.error("visitedPlaces is not valid JSON");
      formDataToSend.append("visitedPlaces", JSON.stringify([]));
    }

    const imageUrls = formData.getAll("imageUrl");

    if (imageUrls.length > 0) {
      imageUrls.forEach((file) => {
        if (file instanceof File) {
          formDataToSend.append("imageUrl", file);
        } else if (typeof file === "string") {
          formDataToSend.append("existingImages[]", file);
        }
      });
    }
    dispatch(updateStory({ formData: formDataToSend, storyId: id }));
  };

  if (loading) {
    return (
      <Loading/>
    );
  }



  return (
    <div className="h-full w-full">
      <Navbar />
      {storyDetails[0] && (
        <div className="pt-26 w-full flex flex-col gap-4 relative">
          {/* STORY IMAGE */}
          <Scroller images={images}  height="h-120"/>
          {/* USER DETAILS */}
          <div className="md:w-[70%] w-full mx-auto bg-gray-600/80 backdrop-blur-2xl rounded-3xl p-3 flex gap-3 items-center -mt-26">
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full overflow-hidden">
                  {storyDetails[0]?.user?.profilePic ? (
                    <img
                      src={storyDetails[0]?.user?.profilePic}
                      alt="profile"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-700 flex items-center justify-center text-white">
                      {storyDetails[0]?.user?.username
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h1 className="text-white">
                    {storyDetails[0]?.user?.username}
                  </h1>
                  <h1 className="text-white">
                    {formatLocation(storyDetails[0]?.location)}
                  </h1>
                </div>
              </div>
              {authUser?.username === storyDetails[0]?.user?.username && (
                <button
                  className="bg-blue-700 text-white px-4 py-2 rounded-xl text-sm cursor-pointer"
                  onClick={handleEdit}
                >
                  Edit Story
                </button>
              )}
            </div>
          </div>
          {/* STORY DETAILS */}
          <div className="md:w-[70%] w-full mx-auto bg-gray-600/20 px-5 py-8 flex flex-col rounded-3xl items-center gap-8 ">
            <div className="w-full flex gap-3 items-center flex-wrap">
              {storyDetails[0]?.visitedPlaces.map((location) => (
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
              {storyDetails[0]?.visitedPlaces?.map((location, index, arr) => (
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
      )}

      {modal && (
        <EditStory
          story={storyDetails[0]}
          closeModal={handleEdit}
          handleUpdate={editStory}
        />
      )}
    </div>
  );
}

export default Story;
