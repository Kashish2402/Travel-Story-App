import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./Cards/ProfileInfo";

function Navbar() {
  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);
  return (
    <div className="px-9 py-8 flex items-center justify-between">
      <div
        className={`logo font-["Lobster"] italic text-blue-400/60 font-semibold tracking-wide text-3xl cursor-pointer`}
        onClick={() => navigate("/dashboard")}
      >
        Travel <span className="tracking-wider text-white/60">story</span>
      </div>

      <ProfileInfo/>
    </div>
  );
}

export default Navbar;
