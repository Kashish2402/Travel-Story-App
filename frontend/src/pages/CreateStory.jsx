import React, { useState, useEffect, useRef, useCallback } from "react";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { RxCross2 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { addStory } from "../features/travelStorySlice";
import LocationAutocomplete from "../components/LocationAutoComplete";
import axios from "axios";
import { Cross } from "lucide-react";

function CreateStory() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wrapperRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    coordinates: { lat: "", lng: "" },
    visitedLocations: [],
    visitedDate: "",
    imageUrl: [],
  });

  const [location, setLocation] = useState("");
  const [suggestedPlaces, setSuggestedPlaces] = useState([]);
  const API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;
  const [cache, setCache] = useState({});

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setSuggestedPlaces([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (placeName) => {
    if (
      placeName.trim() &&
      formData.coordinates.lat &&
      formData.coordinates.lng
    ) {
      try {
        const res = await axios.get(
          "https://api.opentripmap.com/0.1/en/places/radius",
          {
            params: {
              apikey: API_KEY,
              radius: 20000,
              lon: formData.coordinates.lng,
              lat: formData.coordinates.lat,
              format: "json",
              limit: 20,
            },
          }
        );

        const matched = res.data
          .filter((p) =>
            p.name?.toLowerCase().includes(placeName.trim().toLowerCase())
          )
          .slice(0, 6)
          .map((place) => ({
            name: place.name,
            xid: place.xid,
            kinds: place.kinds || "unknown",
          }));

        setSuggestedPlaces(matched);
      } catch (err) {
        console.error("Error fetching places:", err.message);
      }
    }
  };

  const handleLocationChange = async (e) => {
    const placeName = e.target.value;
    setLocation(placeName);

    const lat = formData.coordinates.lat;
    const lng = formData.coordinates.lng;

    if (!placeName.trim() || !lat || !lng) return;

    const cacheKey = `${placeName}_${lat}_${lng}`;
    if (cache[cacheKey]) {
      setSuggestedPlaces(cache[cacheKey]);
      return;
    }

    try {
      const res = await axios.get(
        "https://api.opentripmap.com/0.1/en/places/radius",
        {
          params: {
            apikey: API_KEY,
            radius: 20000,
            lon: lng,
            lat: lat,
            format: "json",
            limit: 20,
          },
        }
      );

      const matched = res.data
        .filter((p) =>
          p.name?.toLowerCase().includes(placeName.trim().toLowerCase())
        )
        .slice(0, 6);

      setSuggestedPlaces(matched);
      setCache((prevCache) => ({
        ...prevCache,
        [cacheKey]: matched,
      }));
    } catch (err) {
      console.error("Error fetching places:", err.message);
    }
  };

  const handleSuggestionClick = (name) => {
    setLocation(name);
    setSuggestedPlaces([]);
  };

  const addLocation = () => {
    if (
      location.trim() &&
      !formData.visitedLocations.includes(location.trim())
    ) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        visitedLocations: [...prevFormData.visitedLocations, location.trim()],
      }));
    }
    setLocation("");
  };

  const deleteLocation = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      visitedLocations: prevFormData.visitedLocations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleFileChange = (e) => {
    const file = Array.from(e.target.files);
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        imageUrl: [...prevFormData.imageUrl, ...file],
      }));
    }
  };
  const deleteImage = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      imageUrl: prevFormData.imageUrl.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFormData = new FormData();
    newFormData.append("title", formData.title);
    newFormData.append("description", formData.description);
    newFormData.append("visitedDate", formData.visitedDate);
    newFormData.append("location", formData.location);
    newFormData.append("coordinates", JSON.stringify(formData.coordinates));
    newFormData.append(
      "visitedPlaces",
      JSON.stringify(formData.visitedLocations)
    );
    if (formData.imageUrl)
      formData.imageUrl.forEach((img, index) => {
        newFormData.append("imageUrl", img);
      });

      for (let pair of newFormData.entries()) {
  console.log(`${pair[0]}: ${pair[1]}`);
}


    dispatch(addStory(newFormData));

    setFormData({
      title: "",
      description: "",
      location: "",
      coordinates: { lat: "", lng: "" },
      visitedLocations: [],
      visitedDate: "",
      imageUrl: [],
    });

    navigate("/dashboard");
  };
  const highlightMatch = (text, query) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;

    return (
      <>
        {text.substring(0, index)}
        <span className="font-bold underline text-white">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <div>
      <Navbar />
      <div className="w-full h-[85vh] flex items-center justify-between">
        <div className="w-full md:w-[80%] mx-auto border p-6 rounded-2xl border-gray-600 drop-shadow-lg bg-gray-500/10 flex flex-col gap-6 mt-[500px] md:mt-60">
          <div className="w-full text-center">
            <h1 className="text-3xl text-white/50 font-bold mb-2">
              Create your own travel story
            </h1>
            <p className="text-gray-600 tracking-tighter italic text-sm">
              Share your adventurous, exciting & loving travel story with people
              across the world...
            </p>
          </div>

          <form className="w-full flex flex-col gap-8" onSubmit={handleSubmit}>
            <div className="w-full flex flex-col gap-3 md:flex-row md:divide-x md:divide-gray-500/40">
              <div className="w-full flex flex-col gap-3 px-3 md:w-1/2">
                <fieldset className="w-full border border-white/30 rounded-2xl py-1">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Title
                  </legend>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                    placeholder="Visited Manali..."
                    required
                  />
                </fieldset>

                <fieldset className="w-full border border-white/30 rounded-2xl py-1">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Description
                  </legend>
                  <textarea
                    value={formData.description}
                    rows={8}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                    placeholder="I've gone to Manali..."
                    required
                  />
                </fieldset>

                <fieldset className="w-full border border-white/30 rounded-2xl py-1">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Visited Date
                  </legend>
                  <input
                    type="date"
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                    value={formData.visitedDate}
                    onChange={(e) =>
                      setFormData({ ...formData, visitedDate: e.target.value })
                    }
                  />
                </fieldset>
              </div>

              <div className="w-full h-full px-3 md:w-1/2 flex flex-col justify-center items-center gap-3">
                <fieldset className="w-full border border-white/30 rounded-2xl py-1">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Main Location
                  </legend>
                  <LocationAutocomplete
                    onSelect={({ location, coordinates }) =>
                      setFormData((prev) => ({
                        ...prev,
                        location,
                        coordinates,
                      }))
                    }
                  />
                </fieldset>

                <fieldset className="w-full border border-white/30 rounded-2xl py-1">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Coordinates
                  </legend>
                  <input
                    type="text"
                    value={`Latitude: ${formData.coordinates.lat}, Longitude: ${formData.coordinates.lng}`}
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                    readOnly
                    required
                  />
                </fieldset>

                <fieldset className="w-full border border-white/30 rounded-2xl py-1 relative">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Visited Places
                  </legend>
                  {formData.visitedLocations.length > 0 && (
                    <div
                      ref={wrapperRef}
                      className="h-[4vh] flex items-center flex-wrap overflow-scroll"
                    >
                      {formData.visitedLocations.map((location, index) => (
                        <div
                          key={index}
                          className="w-fit p-2 mx-2 bg-gray-500/50 text-white/80 flex items-center gap-2 rounded-xl text-sm"
                        >
                          {location}
                          <button onClick={() => deleteLocation(index)}>
                            <RxCross2 />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <input
                    type="text"
                    value={location}
                    onChange={handleLocationChange}
                    placeholder="Visited Locations..."
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 py-2 text-white/50 relative"
                  />

                  {suggestedPlaces.length > 0 && (
                    <ul className="absolute mt-2 p-3 flex flex-col bg-gray-500/80 w-full rounded-xl z-99 text-white/80 divide-y divide-gray-800/70">
                      {suggestedPlaces.map((place) => (
                        <li
                          key={place.xid}
                          className="px-3 py-2 cursor-pointer hover:bg-gray-700 rounded-xl"
                          onClick={() => handleSuggestionClick(place.name)}
                        >
                          <span className="font-medium">
                            {highlightMatch(place.name, location)}
                          </span>
                          <span className="text-xs text-gray-300 italic">
                            {place.kinds}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <button
                    type="button"
                    onClick={addLocation}
                    className="absolute bottom-2 right-2 bg-blue-700 px-3 py-2 rounded-xl cursor-pointer text-white"
                    disabled={!location.trim()}
                  >
                    Add
                  </button>
                </fieldset>

                <div className="w-full mx-3 flex flex-col mt-3">
                  <label htmlFor="file" className="text-white/60 text-[15px]">
                    Image
                    <br />
                    <input
                      name="file"
                      type="file"
                      multiple
                      className="mt-2 text-white/60 cursor-pointer"
                      accept="image/*, video/*"
                      onChange={handleFileChange}
                    />
                  </label>

                  {formData.imageUrl.length > 0 && (
                    <div className="w-full bg-gray-500/30 border border-white rounded-2xl p-3">
                      <h1 className="ml-2 text-white font-semibold">Preview</h1>
                      <div className="flex overflow-x-auto scroll-smooth gap-4 pb-2">
                        {formData.imageUrl.map((img, index) => (
                          <div
                            key={index}
                            className="relative w-20 aspect-square snap-center rounded-xl overflow-hidden shadow-md shrink-0"
                          >
                            <img
                              src={URL.createObjectURL(img)}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              onClick={() => deleteImage(index)}
                              className="absolute top-1 right-1 bg-black/60 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                            >
                              x
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-blue-700 text-white/70 py-2 rounded-2xl cursor-pointer w-full"
            >
              Create Story
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateStory;
