import { BiLike, BiSolidLike } from "react-icons/bi";
import React, { useRef, useState, useEffect } from "react";
import { EllipsisVertical } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/formatDate";
import { getLikedStories, toggleLike } from "../../features/likeSlice";

function StoryCard({
  id,
  className = "max-w-[450px] min-w-[350px]",
  profilePic,
  title,
  description,
  username,
  image,
  visitedLocations,
  visitedDate,
  createdAt,
  updatedAt,
  likes,
  isLiked,
  story
}) {
  const { authUser } = useSelector((state) => state.auth);
  const {stories}=useSelector(state=>state.story)
  const navigate = useNavigate();
  const [totalLikes, setTotalLikes] = useState(likes);
  const [showMenu, setShowMenu] = useState(false);
  const [liked,setLiked]=useState(isLiked)
  const menuRef = useRef(null);
  const dispatch = useDispatch();


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLikeButon = async (id) => {
    try {
      const response = await dispatch(toggleLike(id)).unwrap();
     setLiked(response.isLiked)
      setTotalLikes(response.totalLikes);
    } catch (error) {
      console.error("Like toggle failed:", error);
    }
  };

  
  return (
    <div
      className={` p-3 rounded-xl border-1 border-gray-500/10 flex flex-col items-center justify-between gap-4 bg-gray-700/20 drop-shadow-md relative z-20 ${className}`}
    >
      <div className="w-full flex justify-between items-center text-white/70 py-1">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full overflow-hidden ">
            <img
              src={profilePic || "/OIP.jpeg"}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <p className="text-lg">{username}</p>
        </div>

        <div className="flex items-center gap-2 relative">
          <EllipsisVertical
            className="cursor-pointer "
            onClick={() => setShowMenu(!showMenu)}
          />

          {showMenu && (
            <div
              ref={menuRef}
              onClick={() => setShowMenu(!showMenu)}
              className=" w-30 absolute top-8 -right-3 py-2 px-3 bg-gray-600 rounded-xl text-white/80 text-sm flex flex-col items-center divide-y-1 divide-gray-400 z-100"
            >
              <h1
                className="py-2 w-full text-center cursor-pointer hover:bg-slate-800/50 rounded-xl"
                onClick={() => navigate(`../story/${id}`)}
              >
                View Story
              </h1>
              {authUser.username === username && (
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
          className="w-full h-full object-cover object-center "
        />
      </div>

      <div className="w-full flex gap-2 overflow-auto">
        {visitedLocations.length > 0 &&
          visitedLocations.map((location) => (
            <div
              key={location}
              className="bg-gray-500/50 p-1 text-nowrap rounded-xl text-sm text-slate-900"
            >
              #{location}
            </div>
          ))}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 px-3">
          <h1 className="text-2xl tracking-wide text-white/70">
            {title.length <= 26 ? title : title.slice(0, 26) + "..."}
          </h1>
          <p className="tracking-tight text-sm text-gray-500/80">
            {description.length <= 200
              ? description
              : description.slice(0, 200) + "...."}{" "}
            <Link
              className="text-xs text-blue-600 hover:underline"
              to={`/story/${id}`}
            >
              View More &gt;&gt;
            </Link>
          </p>
        </div>

        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2 text-white/60">
            <button
              className="text-2xl w-6  cursor-pointer"
              onClick={() => handleLikeButon(id)}
            >
              {!liked ? <BiLike /> : <BiSolidLike />}
            </button>
            <span className="w-2">{totalLikes}</span>
          </div>
          <p className="text-sm text-gray-400/50">
            {!updatedAt
              ? ` ${formatDate(createdAt)}`
              : `Last Updated on ${formatDate(updatedAt)}`}
          </p>
        </div>
      </div>
    </div>
  );
}

export default StoryCard;
