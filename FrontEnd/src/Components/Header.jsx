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
   <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto text-white">

  {/* 1️⃣ Trusted Badge */}
  <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gray-900 border border-yellow-400 text-sm mb-6">
    <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
    <span className="text-gray-300">Trusted by Experts</span>
  </div>

  {/* 2️⃣ Main Heading (Italic) */}
  <h1 className="italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
    <span className="text-white">Professional Advice.</span>{" "}
    <span className="text-yellow-400">Simplified.</span>
  </h1>

  {/* 3️⃣ Paragraph */}
  <p className="mt-6 text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
    Connect with trusted lawyers and doctors instantly. Book consultations,
    get expert guidance, and manage everything in one seamless platform.
  </p>

  {/* 4️⃣ Find Buttons */}
  <div className="mt-8 flex flex-col sm:flex-row gap-4">
    <button
      onClick={() => navigate("/doctors")}
      className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-md hover:bg-yellow-500 transition hover:scale-105"
    >
      Find a Doctor
    </button>

    <button
      onClick={() => navigate("/lawyers")}
      className="px-6 py-3 bg-black border border-gray-600 text-white rounded-md 
      hover:border-yellow-400 hover:text-yellow-400 transition hover:scale-105"
    >
      Find a Lawyer
    </button>
  </div>

  {/* 5️⃣ Stats Section (Smaller on Mobile) */}
  <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl">

    <div className="bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-700 
      hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.25)] transition">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">4.8/5</h2>
      <p className="text-gray-400 text-xs sm:text-sm mt-1">Reviews</p>
    </div>

    <div className="bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-700 
      hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.25)] transition">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">100+</h2>
      <p className="text-gray-400 text-xs sm:text-sm mt-1">Experts</p>
    </div>

    <div className="bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-700 
      hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.25)] transition">
      <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">24/7</h2>
      <p className="text-gray-400 text-xs sm:text-sm mt-1">Support</p>
    </div>

  </div>

</div>
    </div>
  );
};

export default Header;
    