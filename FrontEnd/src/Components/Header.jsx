import React from "react";
import bgvideo from "../assets/bg_video.mp4";
import { useNavigate } from "react-router-dom";
const Header = () => {
  const navigate=useNavigate()
  const token=localStorage.getItem("token")
  return (
    <div className="relative w-full h-[80vh] flex items-center justify-center">

      {/* Background Video */}
      <video
        src={bgvideo}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay for shade */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Cure & Counsel
        </h1>

        <p className="mt-4 text-lg md:text-xl text-gray-200 leading-relaxed">
          Your trusted platform to connect with expert lawyers & doctors.  
          Book legal consultations quickly, easily, and confidently.
        </p>
{
  !token&& <button
          onClick={() => navigate("/signup")}
          className="mt-8 px-8 py-3 bg-yellow-400 hover:bg-yellow-500 
            text-black font-semibold text-lg rounded-md shadow-lg transition"
        >
          Register Now
        </button>
}
       
      </div>
    </div>
  );
};

export default Header;
    