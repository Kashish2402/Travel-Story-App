import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../../features/travelStorySlice";
import StoryCard from "../../components/Cards/StoryCard";
import { DayPicker } from "react-day-picker";
import { Filter, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

function Home() {
  const { stories,isStoriesFetching } = useSelector((state) => state.story);
  const dispatch = useDispatch();

  const navigate = useNavigate();
  


  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  if(isStoriesFetching) return <Loading/>
  return (
    <div className="w-full flex flex-col items-center gap-10 mb-3 relative">
      <Navbar />

      <div className="w-[90%] md:w-[80%] flex flex-col items-center justify-center gap-10 mt-66 md:mt-36 ">
        <div className="w-full flex items-center justify-between ">
          <h1 className=" w-full text-center text-white/80 text-3xl font-bold mb-5 italic font-[lobster two] ">
            Recent Posts
          </h1>

      
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-6 relative" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", boxSizing : "border-box" }}>
          {stories?.map((story) => (
            <StoryCard
              key={story._id}
              id={story._id}
              title={story.title}
              description={story.description}
              createdAt={story.createdAt}
              username={story.user?.username}
              profilePic={story.user?.profilePic}
              likes={story.likesCount}
              visitedLocations={story.visitedPlaces || []}
              vlocation={story.location}
              visitedDate={story.visitedDate}
              updatedAt={story.updatedAt}
              image={story.imageUrl ? story.imageUrl : "./OIP.jpeg"}
              isLiked={story.isLiked}
              story={story}
            />
          ))}
        </div>
      </div>

      <div className="fixed bottom-10 right-10 text-3xl bg-blue-700 p-3 text-white/60 rounded-full cursor-pointer z-999">
        <Plus size={20} onClick={() => navigate("/create-story")} />
      </div>
    </div>
  );
}

export default Home;
