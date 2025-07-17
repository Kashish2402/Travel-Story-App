import React from "react";
import StoryCard from "./Cards/StoryCard";
import { useSelector } from "react-redux";

function LikePosts({className=""}) {
  const { likedStories } = useSelector((state) => state.like);
  return (
    <div className={`w-full grid grid-cols-1 lg:grid-cols-2 gap-x-40 gap-y-6 mt-10`}>
      {likedStories.map((story) => (
        <StoryCard
          key={story._id}
          id={story._id}
          title={story.title}
          description={story.description}
          vlocation={story.Location}
          createdAt={story.createdAt}
          username={story.user.username}
          profilePic={story.user.profilePic}
          likes={story.likesCount}
          visitedLocations={story.visitedPlaces || []}
          visitedDate={story.visitedDate}
          updatedAt={story.UpdatedAt}
          image={story.imageUrl ? story.imageUrl : "./OIP.jpeg"}
          isLiked={true}
        />
      ))}
    </div>
  );
}

export default LikePosts;
