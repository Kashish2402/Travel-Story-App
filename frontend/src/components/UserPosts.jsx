import React from "react";
import StoryCard from "./Cards/StoryCard";
import { useSelector } from "react-redux";

function UserPosts() {
    const {yourStories}=useSelector(state=>state.story)
  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-x-40 gap-y-6 mt-10 overflow-x-hidden">
      {yourStories.map((story) => (
        <StoryCard
          className="min-w-[350px] max-w-[450px]"
          key={story._id}
          id={story._id}
          title={story.title}
          description={story.description}
          createdAt={story.createdAt}
          username={story.user.username}
          profilePic={story.user.profilePic}
          likes={story.likesCount}
          vlocation={story.location}
          visitedLocations={story.visitedPlaces || []}
          visitedDate={story.visitedDate}
          updatedAt={story.UpdatedAt}
          image={story.imageUrl ? story.imageUrl : "./OIP.jpeg"}
          isLiked={story.isLiked}
        />
      ))}
    </div>
  );
}

export default UserPosts;
