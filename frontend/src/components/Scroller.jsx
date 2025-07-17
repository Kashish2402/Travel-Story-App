import React, { useEffect } from "react";
import { ChevronLeft, ChevronRight, Dot, Minus } from "lucide-react";
import { useRef } from "react";
import { useState } from "react";

function Scroller({ images, height }) {
  const scrollRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (scrollRef.current && images.length > 0) {
      scrollRef.current.scrollTo({
        left: currentImage * scrollRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentImage, images.length]);

  const scrollLeft = () => {
    if (currentImage === 0) {
      setCurrentImage(images.length - 1);
    } else {
      setCurrentImage((prev) => prev - 1);
    }
  };
  const scrollRight = () => {
    if (currentImage === images.length - 1) {
      setCurrentImage(0);
    } else {
      setCurrentImage((prev) => prev + 1);
    }
  };
  return (
    <div className={`${height} w-full relative`}>
      {/* LEFT ARROW */}
      {images?.length > 1 && (
        <>
          {/* LEFT ARROW */}
          <div
            className={`absolute z-100 left-4 text-white px-2 flex items-center justify-center ${height}`}
          >
            <button className="h-3/4 hover:bg-gray-500/40 cursor-pointer flex items-center justify-center rounded">
              <ChevronLeft size={30} onClick={scrollLeft} />
            </button>
          </div>

          {/* RIGHT ARROW */}
          <div
            className={`absolute z-100 right-4 text-white ${height} px-2 flex items-center justify-center`}
          >
            <button className="h-3/4 hover:bg-gray-500/40 cursor-pointer flex items-center justify-center rounded">
              <ChevronRight size={30} onClick={scrollRight} />
            </button>
          </div>
        </>
      )}

      {/* Image */}
      <div
        className="h-full w-full overflow-x-auto snap-smooth snap-x snap-mandatory transition duration-500"
        ref={scrollRef}
      >
        <div className="h-full w-full flex">
          {images &&
            images.map((image, index) => (
              <div
                key={index}
                className="min-w-full h-full snap-start flex-shrink-0"
              >
                <img
                  src={image}
                  alt="Story-image"
                  className="w-full h-full object-cover opacity-50"
                />
              </div>
            ))}
        </div>
      </div>
      {images?.length > 1 && (
        <div className="absolute -bottom-4 left-1/2 -translate-1/2 flex items-center justify-center gap-1 z-[1000] cursor-pointer">
          {images?.map((_, index) => (
            <button
              key={index}
              className={`cursor-pointer transition-colors duration-200 ${
                index === currentImage
                  ? "text-blue-900 shadow-2xl shadow-blue-900"
                  : "text-white"
              }`}
              onClick={() => setCurrentImage(index)}
            >
              <Minus size={40} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default Scroller;
