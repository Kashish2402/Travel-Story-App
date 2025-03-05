import { BiLike, BiSolidLike } from "react-icons/bi";
import React, { useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function StoryCard({
  title,
  description,
  user,
  image,
  visitedLocations,
  visitedDate,
  createdAt,
  updatedAt,
}) {
  const { authUser } = useSelector((state) => state.auth);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  const [showMenu, setShowMenu] = useState(false);

  const handleLikeButon = () => {
    if (isLiked) {
      setTotalLikes((prev) => prev - 1);
    } else {
      setTotalLikes((prev) => prev + 1);
    }
    setIsLiked(!isLiked);
  };
  return (
    <div className="min-w-[350px] max-w-[450px] p-3 rounded-xl border-1 border-gray-500/10 flex flex-col items-center gap-4 bg-gray-700/20 drop-shadow-md relative z-10">
      <div className="w-full flex justify-between items-center text-white/70">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden ">
            <img
              src={image}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p>{user}</p>
        </div>

        <div className="flex items-center gap-2 ">
          {/* <button
              className="text-2xl w-6  cursor-pointer"
              onClick={handleLikeButon}
            >
              {!isLiked ? <BiLike /> : <BiSolidLike />}
            </button>
            <span className="w-2">{totalLikes}</span> */}

          <button type="button"
            onClick={() =>{
              setShowMenu(!showMenu);
            }}
          >
            <EllipsisVertical className="cursor-pointer relative" />
          </button>

          {showMenu && (
            <div
              
              className=" w-30 absolute  py-2 px-3 bg-gray-400/50 rounded-xl text-white/80 text-sm flex flex-col items-center divide-y-1 divide-gray-400 "
            >
              <h1 className="py-2 w-full text-center cursor-pointer hover:bg-slate-800/50 rounded-xl">
                View Story
              </h1>
              {authUser._id === user && (
                <h1 className="py-2 w-full text-center cursor-pointer hover:bg-slate-800/50 rounded-xl">
                  Edit Story
                </h1>
              )}
              {authUser._id === user && (
                <h1 className="py-2 w-full text-center cursor-pointer hover:bg-slate-800/50 rounded-xl">
                  Delete Story
                </h1>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full h-30 rounded relative z-0">
        <img
          src={image}
          className="w-full h-full object-cover object-center z-0"
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-3">
          <h1 className="text-2xl tracking-wide text-white/70">{title}</h1>
          <p className="tracking-tight text-sm text-gray-500/80">
            {description.length <= 200
              ? description
              : description.slice(0, 200) + "...."}{" "}
            <Link className="text-xs text-blue-600 hover:underline">
              View More &gt;&gt;
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
