import React from "react";
import bgvideo from "../assets/bg_video.mp4";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // ✅ Added token retrieval

  // Scroll animation props
  const scrollAnim = (delay = 0) => ({
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: false, amount: 0.3 },
    transition: { duration: 0.8, delay }
  });

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

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto text-white">

        {/* Trusted Badge */}
        <motion.div className="flex items-center gap-2 px-4 py-1 rounded-full bg-gray-900 border border-yellow-400 text-sm mb-6"
          {...scrollAnim(0)}
          whileHover={{ scale: 1.05 }}
        >
          <span className="w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
          <span className="text-gray-300">Trusted by Experts</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 className="italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
          {...scrollAnim(0.2)}
        >
          <span className="text-white">Professional Advice.</span>{" "}
          <span className="text-yellow-400">Simplified.</span>
        </motion.h1>

        {/* Paragraph */}
        <motion.p className="mt-6 text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed"
          {...scrollAnim(0.4)}
        >
          Connect with trusted lawyers and doctors instantly. Book consultations,
          get expert guidance, and manage everything in one seamless platform.
        </motion.p>

        {/* Buttons */}
        <motion.div className="mt-8 flex flex-col sm:flex-row gap-4"
          {...scrollAnim(0.6)}
        >
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
        </motion.div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 md:gap-6 w-full max-w-2xl">
          {[
            { value: "4.8/5", label: "Reviews" },
            { value: "100+", label: "Experts" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              className="bg-gray-900 p-3 sm:p-4 md:p-6 rounded-lg md:rounded-xl border border-gray-700 
                hover:border-yellow-400 hover:shadow-[0_0_15px_rgba(250,204,21,0.25)] transition"
              {...scrollAnim(0.2 + index * 0.2)}
              whileHover={{ scale: 1.05 }}
            >
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-yellow-400">{stat.value}</h2>
              <p className="text-gray-400 text-xs sm:text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Header;