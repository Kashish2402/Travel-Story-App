import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";

function ProfileInfo() {
  const { authUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
  };
  return (
    <div className="flex items-center gap-2">
      <p className="h-10 w-10 flex items-center justify-center bg-blue-700 text-white/80 rounded-full cursor-pointer overflow-hidden object-cover object-fit">
        {authUser.profilepic || authUser.username.charAt(0)}
      </p>

      <div className="flex items-center gap-4 text-white/60">
        <p className="text-sm font-medium">
          {authUser.fullName.slice(0, 5) + "..."}
        </p>
        <button className="cursor-pointer" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default ProfileInfo;
