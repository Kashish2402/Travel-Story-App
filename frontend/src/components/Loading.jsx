import React, { useEffect, useState } from "react";

const text = "LOADING...";

function Loading() {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 150); 

      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <div className="font-black text-transparent text-4xl bg-gradient-to-bl from-indigo-500 via-purple-500 to-pink-500 bg-clip-text">
        {displayedText}
      </div>
    </div>
  );
}

export default Loading;
