import React from "react";
import Signup from "../../components/Signup";
import Login from "../../components/Login";

function Auth({ auth }) {
 
  return (
    <div className="h-screen flex items-center overflow-hidden relative">
      <div
        className={`auth h-[80%] w-[min(80%,1280px)] mx-auto flex items-center justify-center shadow-[0px 0px 5px 2px black] rounded-[50px] overflow-hidden relative`}
        style={{
          backgroundImage: "url('./Login-Background-image.jpg')",
          boxShadow: "0px 0px 15px -5px black",
          backdropFilter: "opacity(10%)",
        }}
      >
        {auth === "signup" && (
          <Signup/>
        )}
        <div className="w-1/2 h-full hidden md:flex relative overflow-hidden">
          <div className="w-full h-full absolute bottom-0 flex flex-col justify-end gap-5  bg-[linear-gradient(180deg,transparent,rgba(0,0,0,1))]">
            <h4 className="text-4xl text-[#928dab] font-black text-center font-[Lobster]">
              Capture Every Journey,
              <br />
              Relive Every Moment.
            </h4>

            <p className="text-white/60 italic  text-center mb-16">
              "Record Your Adventures, Relive the Memories <br /> – Your
              Personal Travel Journal"
            </p>
          </div>
        </div>

        {auth === "login" && (
          <Login/>
        )}
      </div>
    </div>
  );
}

export default Auth;
