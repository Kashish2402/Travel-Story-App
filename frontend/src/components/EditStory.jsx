import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

function EditStory({ closeModal, story, handleUpdate }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    visitedLocations: [],
    visitedDate: "",
    imageUrl: null,
  });

  useEffect(() => {
    if (story) {
      setFormData({
        title: story?.title,
        description: story?.description,
        visitedLocations: story?.visitedLocations,
        visitedDate: "story?.visitedDate",
        imageUrl: story?.imageUrl,
      });
    }
  },[story]);

  const [location, setLocation] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
        setFormData({ ...formData, imageUrl: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const addLocation = () => {
    if (location.trim()) {
      setFormData((prev) => ({
        ...prev,
        visitedLocations: [...prev.visitedLocations, location.trim()],
      }));
      setLocation("");
    }
  };

  const deleteLocation = (index) => {
    setFormData((prev) => ({
      ...prev,
      visitedLocations: prev.visitedLocations.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleUpdate(formData,story?._id);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[333]">
      <div className="w-[500px] bg-gray-900/70 backdrop-blur drop-shadow-lg p-6 rounded-lg">
        <div className="flex justify-between items-center">
          <h2 className="text-white/70 text-lg">Edit Your Travel Story</h2>
          <button
            className="text-white/70 text-lg cursor-pointer"
            onClick={closeModal}
          >
            <X />
          </button>
        </div>

        <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Title"
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={8}
            className="w-full p-2 rounded bg-gray-800 text-white"
            placeholder="Description"
          />

          <fieldset className="w-full border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">
              Visited Locations
            </legend>
            {formData.visitedLocations.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2">
                {formData.visitedLocations.map((loc, index) => (
                  <div
                    key={index}
                    className="bg-gray-700 p-2 rounded-lg flex items-center gap-2 text-white"
                  >
                    {loc}
                    <button
                      type="button"
                      onClick={() => deleteLocation(index)}
                      className="text-red-400"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2 p-2">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent border-none outline-none px-3 text-white"
                placeholder="Add a location..."
              />
              <button
                type="button"
                onClick={addLocation}
                className="bg-blue-600 px-3 py-2 rounded-lg text-white"
              >
                Add
              </button>
            </div>
          </fieldset>

          <input
            type="date"
            name="visitedDate"
            value={formData.visitedDate}
            onChange={handleChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          {previewImage && (
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-40 object-cover rounded"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 rounded bg-gray-800 text-white"
          />

          <button
            type="submit"
            className="w-full p-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Update Story
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditStory;
