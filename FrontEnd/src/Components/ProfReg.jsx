import React from "react";
import { useNavigate } from "react-router-dom";
import qazi from "../assets/qazi.png";    
import Dr from "../assets/R_Dr.png";        

const ProfReg = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-16 px-6 md:px-20">

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Join Cure & Counsel as a Professional
      </h1>

      <div className="grid grid-cols-1 gap-10">

        {/* Doctor Registration Box */}
        <div className="bg-white shadow-lg p-6 rounded-xl flex flex-row items-center justify-between hover:shadow-2xl transition-all duration-300">
           
          {/* Left Image */}
          
 <div className="w-full md:w-[60%] text-left px-4">
            <h2 className="text-2xl font-semibold mb-2">Register as Doctor</h2>
            <p className="text-gray-700 mb-4">
              Join our trusted network of medical professionals and offer your expertise 
              to thousands of patients who rely on Cure & Counsel for fast and reliable care.
            </p>

            <button
              onClick={() => navigate("/drform")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
            >
              Register Now
            </button>
          </div>
          {/* Right Text */}
         
          <div className="flex sm:w-full md:w-[40%] border border-black rounded-lg ">
            <img
              src={Dr}
              alt="Doctor"
              className="w-[100%] object-contain rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

        </div>

        {/* Lawyer Registration Box */}
        <div className="bg-black text-white shadow-lg p-6 rounded-xl flex flex-row items-center justify-between hover:shadow-2xl transition-all duration-300">

          {/* Left Image */}
          <div className="flex w-full md:w-[40%] ">
            <img
              src={qazi}
              alt="Lawyer"
              className="w-full h-full object-contain rounded-lg hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Right Text */}
          <div className="w-full md:w-[60%] text-left px-4">
            <h2 className="text-2xl font-semibold mb-2">Register as Lawyer</h2>
            <p className="text-gray-300 mb-4">
              Become part of our legal community and assist clients with family issues, 
              business disputes, property cases, and much more all through our trusted platform.
            </p>

            <button
              onClick={() => navigate("/lawyerform")}
              className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 transition-all"
            >
              Register Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProfReg;
