import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";

function ProfileInfo() {
  const { authUser } = useSelector((state) => state.auth);

  const [showMenu, setShowMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const menuRef = useRef();

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

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    navigate('/login')
  };
  return (
    <div className="flex items-center gap-2 relative">
      <p
        className="h-10 w-10 flex items-center justify-center bg-blue-700 text-white/80 rounded-full cursor-pointer overflow-hidden object-cover object-fit "
        onClick={() => setShowMenu(!showMenu)}
      >
        {authUser?.profilePic ? (
          <img src={authUser.profilePic} />
        ) : (
          authUser?.username.charAt(0)
        )}
      </p>

      {showMenu && (
        <div
          className="absolute -bottom-24 left-0 text-white/60 rounded-xl px-4 bg-gray-600 p-2 flex flex-col divide-y z-99 divide-gray-800"
          ref={menuRef}
        >
          <h1
            className="py-1 hover:bg-gray-700 cursor-pointer px-1 rounded-2xl mb-1"
            onClick={() =>
              navigate(`/profile/${authUser.username}/${authUser._id}`)
            }
          >
            View Profile
          </h1>
          <h1 className="py-1 hover:bg-gray-700 cursor-pointer px-1 rounded-2xl mb-1"
          onClick={() =>
            navigate(`/${authUser.username}/likedStories`)
          }>
            Liked Posts
          </h1>
        </div>
      )}

      <div className="flex items-center gap-4 text-white/60">
        <p className="text-sm font-medium">
          {!authUser?.fullName.lenght >= 5
            ? authUser?.fullName
            : authUser?.fullName.slice(0, 5) + "..."}
        </p>
        <button className="cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
