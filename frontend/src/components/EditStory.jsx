import { X } from "lucide-react";
import React, { useState } from "react";
import { formatInputDate } from "../utils/formatDate";

function EditStory({ closeModal, story, handleUpdate }) {
  const [loc, setLoc] = useState("");
  const [imagePreview, setImagePreview] = useState(story.imageUrl);
  const [formData, setFormData] = useState({
    title: story.title,
    description: story.description,
    visitedLocations: story.visitedLocations,
    visitedDate: formatInputDate(story.visitedDate),
    imageUrl: story.imageUrl,
  });

  const deleteLocation = (index) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      visitedLocations: prevFormData.visitedLocations.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const addLocation = (e) => {
    if (loc.trim()) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        visitedLocations: [...prevFormData.visitedLocations, loc.trim()],
      }));
    }

    setLoc("");
  };

  const removeImage = () => {
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    console.log("File: ", file);
    
    if (file) {
      const image = URL.createObjectURL(file);
      setImagePreview(image);
      setFormData({ ...formData, imageUrl: image });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Story Id: ",story._id)
    handleUpdate(story._id, formData);
  };
  return (
    <div className="h-full w-full fixed inset-0 bg-black/80 backdrop-blur-sm/30 z-99 flex items-center justify-center">
      <div className="w-[500px] bg-gray-800/50 p-6 rounded-xl flex flex-col drop-shadow-2xl overflow-y-scroll mt-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl text-white/60">Edit Story</h2>

          <button className="text-xl text-white/70" onClick={closeModal}>
            <X />
          </button>
        </div>

        <div className="border mt-2 border-gray-700/50"></div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <fieldset className="border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">Title</legend>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              placeholder="Title..."
            />
          </fieldset>

          <fieldset className="border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">
              Description
            </legend>
            <textarea
              type="text"
              rows={7}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              placeholder="description..."
            />
          </fieldset>

          <fieldset className="border border-white/30 rounded-2xl py-1 relative">
            <legend className="mx-3 text-white/60 text-[15px]">
              Visited Locations
            </legend>
            {formData.visitedLocations.length > 0 && (
              <div className="h-[4vh] flex items-center flex-wrap overflow-scroll">
                {formData.visitedLocations.map((location, index) => {
                  return (
                    <div
                      key={index}
                      className="w-fit p-2 mx-2 bg-gray-500/50 text-white/80 flex items-center gap-2 rounded-xl text-sm"
                    >
                      {location}
                      <button type="button" onClick={() => deleteLocation(index)}>
                        <X />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            <input
              type="text"
              value={loc}
              onChange={(e) => setLoc(e.target.value)}
              className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pt-6 pb-1 text-white/50"
            />
            <button
            type="button"
              onClick={()=>addLocation()}
              className="absolute right-3 bottom-2 bg-blue-700 text-white/70 p-2 px-4 rounded cursor-pointer"
            >
              Add
            </button>
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

          {imagePreview && (
            <div className="flex items-center text-white/70 gap-5 relative w-fit">
              Preview
              <div className="h-12 w-12 rounded-xl overflow-hidden">
                <img
                  src={formData.imageUrl}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <button className="absolute -top-2 -right-1 bg-gray-500 rounded-full">
                <X size={15} onClick={removeImage} />
              </button>
            </div>
          )}
          <fieldset className="w-full border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">Image</legend>
            <input
              type="file"
              className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              onChange={handleImageChange}
              accept="image/*"
            />
          </fieldset>

          <button type="submit" className="bg-blue-700 p-2 text-white/80">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditStory;
