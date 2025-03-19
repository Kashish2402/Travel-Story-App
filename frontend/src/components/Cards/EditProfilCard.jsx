import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { formatInputDate } from "../../utils/formatDate";
import { useDispatch } from "react-redux";
import { editUserDetails } from "../../features/authSlice";


function EditProfilCard({ authUser,closeModal }) {
  const [formData, setFormData] = useState({
    fullName: "",
    dateOfBirth: "",
    gender:"",
  });

  const dispatch=useDispatch()
  // console.log(authUser)

  const handleSubmit=(e)=>{
    e.preventDefault()
    // console.log("Save Changes button clicked")
    // console.log(formData)
    dispatch(editUserDetails(formData))
    closeModal()
  }
  useEffect(()=>{
    if(authUser){
        setFormData({
            fullName:authUser.fullName || "",
            dateOfBirth:formatInputDate(authUser.dateOfBirth)|| "",
            gender:authUser.gender || ""
        })
    }
  },[authUser])
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur z-[99999]">
        <div className="bg-gray-900/70 drop-shadow-lg p-6 rounded-lg w-[400px]">
          <div className="flex justify-between items-center">
            <h2 className="text-white/70 text-lg">Edit User Profile</h2>
            <button className="text-white/70 text-lg cursor-pointer" onClick={closeModal}>
              <X />
            </button>
          </div>

          <div className="w-full border my-4 border-gray-700/70"></div>

          <form className="w-full flex flex-col items-center justify-center gap-6" onSubmit={handleSubmit}>
            <fieldset className="w-full border border-white/30 rounded-2xl py-1">
              <legend className="mx-3 text-white/60 text-[15px]">Full Name</legend>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                placeholder="John"
              />
            </fieldset>

            <fieldset className="w-full border border-white/30 rounded-2xl py-1">
              <legend className="mx-3 text-white/60 text-[15px]">Email</legend>
              <input
                type="email"
                value={authUser?.email}
                className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
                placeholder="john@example.com"
                disabled
              />
            </fieldset>

            <fieldset className="w-full border border-white/30 rounded-2xl py-1">
              <legend className="mx-3 text-white/60 text-[15px]">Date Of Birth</legend>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              />
            </fieldset>

            <div className="w-full ml-4">
              <label htmlFor="gender" className="text-white/50">
                Gender
                <span className="inline-flex gap-1 items-center justify-center ml-10">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={handleChange}
                  />
                  Male
                </span>
                <span className="inline-flex gap-1 items-center justify-center ml-5">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={handleChange}
                  />
                  Female
                </span>
              </label>
            </div>

            <button type="submit" className="w-full bg-blue-700 py-2 text-white/80 cursor-pointer rounded-xl text-sm">
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditProfilCard;
