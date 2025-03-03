import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchStories } from "../../features/travelStorySlice";
import StoryCard from "../../components/Cards/StoryCard";

function Home() {
  const { stories } = useSelector((state) => state.story);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchStories());
  }, [dispatch]);

  console.log(stories);
  return (
    <div className="flex flex-col items-center gap-20">
      <Navbar />
      <div className="w-[80%] mx-auto h-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-20 gap-y-6">
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
            image={story.imageUrl? story.imageUrl : "./OIP.jpeg"}
          />
        ))}

      </div>
    </div>
  );
}

export default Home;
