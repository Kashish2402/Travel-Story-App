import React, { useState, useRef, useEffect } from "react";
import axios from 'axios';

function LocationAutoComplete({ onSelect }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  const handleChange = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) return setSuggestions([]);

    try {
      const res = await axios.get(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(value)}&limit=5`
      );
      setSuggestions(res.data.features || []);
    } catch (err) {
      console.error("Error fetching suggestions:", err.message);
    }
  };

  const handleSelect = (place) => {
    const location = `${place.properties.name}, ${place.properties.city || ""}, ${place.properties.country || ""}`.trim();
    const coordinates = {
      lat: place.geometry.coordinates[1],
      lng: place.geometry.coordinates[0],
    };

    setQuery(location);
    setSuggestions([]);
    onSelect({ location, coordinates });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Search locations..."
        className="overflow-hidden w-full bg-transparent border-none outline-none px-3 py-2 text-white/50"
      />

      {suggestions.length > 0 && (
        <ul className="absolute ml-3 mt-2 p-3 flex flex-col bg-gray-500/80 w-full rounded-xl z-99 text-white/80 divide-y divide-gray-800/70">
          {suggestions.map((place, index) => (
            <li
              key={index}
              className="px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-xl"
              onClick={() => handleSelect(place)}
            >
              {place.properties.name}, {place.properties.city}, {place.properties.country}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LocationAutoComplete;
