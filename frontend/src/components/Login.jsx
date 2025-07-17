import React, { useState } from "react";
import Password from "./Password";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/authSlice";
import { MailIcon } from "lucide-react";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { error } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showError, setshowError] = useState(error);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return regex.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // console.log("Login Data: ", formData);
    if (!validateEmail(formData.email)) {
      setshowError("Please enter a valid Email address!!!");
      return;
    }

    if (!formData.password) {
      setshowError("Please enter password!!!");
      return;
    }

    const result = await dispatch(login(formData));
    if (login.fulfilled.match(result)) {
      navigate("/dashboard");
      setFormData({ email: "", password: "" });
      setshowError("");
    } else {
      setshowError(result.payload || "Login failed!");
    }
  }


  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/users/google`
  }


  return (
    <div className="w-full md:w-1/2 h-full flex flex-col items-center justify-center gap-10 bg-black/85 p-3">
      <div className="text-[#928dab] text-3xl font-semibold text-center">
        Login to your journal
      </div>
      <div className="w-full flex flex-col gap-8">
        <form
          onSubmit={handleLogin}
          className="w-full flex flex-col items-center justify-center gap-6"
        >
          <fieldset className="w-3/4 border border-white/30 rounded-2xl py-1">
            <legend className="mx-3 text-white/60 text-[15px]">Email</legend>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
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

          {showError && <p className="text-red-800 text-sm">{showError}</p>}

          <button
            type="submit"
            className="bg-[#928dab] text-[#1f1c2c] w-3/4 py-2 rounded-2xl font-bold border-2 border-transparent cursor-pointer hover:border-[#928dab] hover:text-[#928dab] hover:bg-transparent transition-all duration-200 ease-in-out"
          >
            Login
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
          className="bg-[#928dab] w-3/4 py-2 rounded-2xl font-bold border-2 text-[#1f1c2c] border-transparent mx-auto cursor-pointer hover:border-[#928dab] hover:text-[#928dab] hover:bg-transparent transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <MailIcon /> Continue with Google
        </button>
        <button
          className="bg-[#928dab] w-3/4 py-2 rounded-2xl font-bold border-2 text-[#1f1c2c] border-transparent mx-auto cursor-pointer hover:border-[#928dab] hover:text-[#928dab] hover:bg-transparent transition-all duration-200 ease-in-out"
          onClick={() => navigate("/signup")}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}

export default Login;
