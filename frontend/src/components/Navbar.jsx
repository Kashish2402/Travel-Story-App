import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProfileInfo from "./Cards/ProfileInfo";
import SearchBar from "./SearchBar";
import { searchStories } from "../features/travelStorySlice";

function Navbar() {
  const navigate = useNavigate();

  const { authUser } = useSelector((state) => state.auth);
  const { searchResults } = useSelector((state) => state.story);
  const dispatch = useDispatch();

  const [query, setQuery] = useState("");
  const [searchTerms, setSearchTerms] = useState(searchResults);

  useEffect(() => {
    if (!query.trim()) {
      setSearchTerms([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const response = await dispatch(searchStories(query)).unwrap();
        setSearchTerms(response);

        
      } catch (error) {
        console.log("Search Failed: ", error);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [dispatch, query]);

  const handleSearch = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="px-9 py-8 w-full flex flex-col gap-5 md:flex-row items-center justify-between fixed shadow-2xl z-99 bg-[#1f1c2c]">
      <div
        className={`logo font-["Lobster"] italic text-blue-400/60 font-semibold tracking-wide  text-3xl cursor-pointer`}
        onClick={() => navigate("/dashboard")}
      >
        Travel <span className="tracking-wider text-white/60">story</span>
      </div>

      <SearchBar
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        handleSubmit={handleSearch}
        searchTerms={searchTerms}
      />

      <ProfileInfo />
    </div>
  );
}

export default Navbar;
