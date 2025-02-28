import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function Password({ value, onChange,placeholder="*****" ,title="Password"}) {
  const [showPassword, SetShowPassword] = useState(false);

  const toggleButton = () => {
    SetShowPassword(!showPassword);
  };

  return (
    <fieldset className="w-3/4 border border-white/30 rounded-2xl py-1 relative">
      <legend className="mx-3 text-white/60 text-[15px]">{title}</legend>
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        className="w-full bg-transparent border-none outline-none px-3 pb-1 text-white/50"
        placeholder={placeholder}
      />

      <button
        type="button"
        className="cursor-pointer absolute right-2 top-1"
        onClick={toggleButton}
      >
        {showPassword ? (
          <Eye size={20} className=" text-white" />
        ) : (
          <EyeOff size={20} className=" text-white" />
        )}
      </button>
    </fieldset>
  );
}

export default Password;
