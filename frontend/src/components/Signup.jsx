import React, { useState } from "react";
import Password from "./Password";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../features/authSlice";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);
  const [showError, setShowError] = useState(error);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    dateOfBirth: "",
    gender: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };

  const handleSignup = (e) => {
    e.preventDefault();

    // console.log("Signup Data:", formData);

    dispatch(signUp(formData));
    setFormData({
      fullName: "",
      username: "",
      email: "",
      password: "",
      dateOfBirth: "",
      gender: "",
    });
    navigate("/dashboard")
  };

  return (
    <div className="w-full h-full md:w-1/2 flex flex-col items-center justify-center gap-10 bg-black/85 p-3 overflow-y-scroll py-2">
      <div className="w-full flex flex-col gap-3 items-center">
        <div className="text-[#928dab] text-3xl font-semibold">
          Create your Account
        </div>
        <form
          onSubmit={(e) => handleSignup(e)}
          className="w-full flex flex-col items-center justify-center gap-6"
        >
          <fieldset className="w-3/4 border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">
              Full Name
            </legend>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              placeholder="john doe"
            />
          </fieldset>

          <fieldset className="w-3/4 border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">username</legend>
            <input
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              type="text"
              className="w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              placeholder="john22"
            />
          </fieldset>
          <fieldset className="w-3/4 border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">Email</legend>
            <input
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              type="email"
              className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              placeholder="john@example.com"
            />
          </fieldset>
          <Password
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />

          <div className="w-full flex flex-col items-center gap-2">
            <fieldset className="w-3/4 border border-white/30 rounded-2xl py-1">
              <legend className="mx-3 text-white/60 text-[15px]">Date of Birth</legend>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className="overflow-hidden w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
              />
            </fieldset>
            <div className=" w-3/4 flex gap-8 text-white/60">
              <label htmlFor="gender" className="text-white/50">
                Gender
              </label>
              <span>
                <input
                  type="radio"
                  id="male"
                  value={"male"}
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                Male
              </span>
              <span>
                <input
                  type="radio"
                  id="female"
                  value={"female"}
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                Female
              </span>
            </div>
          </div>
          {showError && <p className="text-red-700 text-xs">{showError}</p>}
          <button
            type="submit"
            className="bg-[#928dab] text-[#1f1c2c] w-3/4 py-2 rounded-2xl font-bold border-2 border-transparent cursor-pointer hover:border-[#928dab] hover:text-[#928dab] hover:bg-transparent transition-all duration-200 ease-in-out"
          >
            Create your Account
          </button>
          <div className="w-full flex flex-col items-center gap-4">
            <div className="w-full flex items-center justify-center px-5">
              <div className="w-[40%] border border-gray-700"></div>
              <div className="text-white/70 w-fit mx-2">or</div>
              <div className="w-[40%] border border-gray-700"></div>
            </div>

           
          </div>
        </form>

        <button
              className="bg-[#928dab] w-3/4 py-2 rounded-2xl font-bold border-2 text-[#1f1c2c] border-transparent cursor-pointer hover:border-[#928dab] hover:text-[#928dab] hover:bg-transparent transition-all duration-200 ease-in-out"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
      </div>
    </div>
  );
}

export default Signup;
