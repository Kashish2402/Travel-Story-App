import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../../features/travelStorySlice";
import StoryCard from "../../components/Cards/StoryCard";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const { stories } = useSelector((state) => state.story);

  const navigate = useNavigate();

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  console.log(stories);
  return (
    <div className="w-full h-full relative">
      <div className="w-full flex flex-col items-center gap-10 mb-3">
        <Navbar />

        <div className="w-full flex flex-col items-center justify-center gap-10 ">
          <h1 className="text-center text-white/80 text-3xl font-bold mb-5 italic font-[lobster two]">
            Recent Posts
          </h1>
          <div className="w-[80%] mx-auto">
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-6 relative -z-100">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                title={story.title}
                description={story.description}
                createdAt={story.createdAt}
                user={story.userId}
                visiteLocations={story.visiteLocations}
                visitedDate={story.visitedDate}
                updatedAt={story.UpdatedAt}
                image={story.imageUrl ? story.imageUrl : "./OIP.jpeg"}
              />
            ))}
          </div>
          </div>
          
        </div>

        <div className="fixed bottom-10 right-10 text-3xl bg-blue-700 p-3 text-white/60 rounded-full cursor-pointer">
          <Plus size={20} onClick={() => navigate("/create-story")} />
        </div>
      </div>
    </div>
  );
}

export default Home;
