import React from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

function SearchBar({ value, onChange, searchTerms }) {
  // console.log(searchTerms);
  const navigate = useNavigate();

  return (
    <div className="w-[90%] md:w-[45%]">
      <div className="bg-gray-600/30 p-2 rounded-xl  relative">
        <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder="Search..."
          className="text-white/60 text-sm w-full outline-none"
        />
        <button className="absolute right-2  text-white/70 p-1 rounded-full cursor-pointer">
          <Search size={18} />
        </button>
      </div>
      {searchTerms && searchTerms.length > 0 && (
        <div className="absolute ml-3 mt-2 p-3 flex flex-col bg-gray-400/80 w-[70%] md:w-[45%] rounded-xl z-99 text-white/80 divide-y divide-gray-800/70">
          {searchTerms.map((term, index) => (
            <div
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-xl"
              onClick={() => navigate(`/story/${term._id}`)}
            >
              <h1 className="text-md">{term.title}</h1>
              <p className="text-sm">{term.description.slice(0, 40)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
