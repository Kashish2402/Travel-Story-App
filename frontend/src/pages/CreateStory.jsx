import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { RxCross2 } from "react-icons/rx";

function CreateStory() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visitedLocations: [],
    visitedDate: "",
    imageUrl: "",
  });

  const [location, setLocation] = useState("");

  const addLocation = () => {
    if (location.trim()) {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newFormData=new FormData()
    newFormData.append("title",formData.title)
    newFormData.append("description",formData.description)
    newFormData.append("visitedDate",formData.visitedDate)
    newFormData.append("visitedLocations",formData.visitedLocations)
    newFormData.append("image",formData.imageUrl)

  };

  return (
    <div>
      <Navbar />
      <div className="w-full h-[85vh] flex items-center justify-between">
        <div className="w-full md:w-[80%] mx-auto border p-6 rounded-2xl border-gray-600 drop-shadow-lg bg-gray-500/10 flex flex-col gap-6">
          <div className="w-full text-center">
            <h1 className="text-3xl text-white/50 font-bold mb-2">
              Create your own travel story
            </h1>
            <p className="text-gray-600 tracking-tighter italic text-sm">
              Share your adventerous, exciting & loving travel story with people
              across your world...
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
                    type="text"
                    value={formData.description}
                    rows={8}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                    placeholder="I've gone to manali..."
                    required
                  ></textarea>
                </fieldset>
              </div>
              <div className="w-full h-full px-3 md:w-1/2 flex flex-col justify-center items-center gap-3">
                <fieldset className="w-full border border-white/30 rounded-2xl py-1">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Visited Date
                  </legend>
                  <input
                    type="date"
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                  />
                </fieldset>
                <fieldset className="w-full border border-white/30 rounded-2xl py-1 relative">
                  <legend className="mx-3 text-white/60 text-[15px]">
                    Visited Locations
                  </legend>
                  {formData.visitedLocations.length > 0 && (
                    <div className="flex items-center ">
                      {formData.visitedLocations.map((location, index) => {
                        return (
                          <div
                            key={index}
                            className="w-fit p-2 mx-2 bg-gray-500/50 text-white/80 flex items-center gap-2 rounded-xl text-sm"
                          >
                            {location}
                            <button onClick={() => deleteLocation(index)}>
                              <RxCross2 />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Visited Locations..."
                    className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50 relative"
                    required
                  />
                  <button
                    type="button"
                    onClick={addLocation}
                    className="absolute bottom-2 right-2 bg-blue-700 px-2 py-1 rounded-xl cursor-pointer text-white "
                    disabled={!location.trim()}
                  >
                    Add
                  </button>
                </fieldset>
                <div className="w-full mx-3 flex flex-col mt-3">
                  <label htmlFor="file" className=" text-white/60 text-[15px]">
                    Image
                    <br />
                    <input
                      name="file"
                      type="file"
                      className="mt-2 text-white/60 cursor-pointer"
                      accept="image/*, video/*"
                      value={formData.imageUrl}
                      onChange={() =>
                        setFormData({ ...formData, imageUrl: e.target.value })
                      }
                    />
                  </label>
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
