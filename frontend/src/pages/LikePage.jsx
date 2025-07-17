import React from "react";
import Navbar from "../components/Navbar";
import LikePosts from "../components/LikePosts";

function LikePage() {
  return (
    <div className="">
      <Navbar />

      <div className="pt-40 w-3/4 mx-auto">
      <h1 className="text-white/70 text-3xl font-bold text-center">Liked Posts</h1>
        <LikePosts className="lg:grid-cols-3"/>
      </div>
    </div>
  );
}

export default LikePage;
