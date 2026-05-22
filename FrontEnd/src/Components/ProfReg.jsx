import React from "react";
import { useNavigate } from "react-router-dom";
import qazi from "../assets/qazi.png";    

const ProfReg = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full mt-8 sm:mt-12 md:mt-16 px-4 sm:px-6 md:px-10 lg:px-20">
      
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-10 md:mb-12">
        Join Cure & Counsel as a Professional
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-10">
        
        {/* Lawyer Registration Box - Fully Responsive */}
        <div className="bg-black text-white shadow-lg p-4 sm:p-6 rounded-xl hover:shadow-2xl transition-all duration-300">
          
          {/* Responsive Layout: Stack on mobile, row on tablet+ */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            
            {/* Left Image */}
            <div className="w-full md:w-[40%] lg:w-[35%]">
              <img
                src={qazi}
                alt="Lawyer"
                className="w-full h-auto max-h-64 md:max-h-80 object-contain rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Right Text */}
            <div className="w-full md:w-[60%] lg:w-[65%] text-center md:text-left px-2 sm:px-4">
              <h2 className="text-xl sm:text-2xl font-semibold mb-2">
                Register as Lawyer
              </h2>
              
              <p className="text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
                Become part of our legal community and assist clients with family issues, 
                business disputes, property cases, and much more all through our trusted platform.
              </p>

              <button
                onClick={() => navigate("/lawyerform")}
                className="bg-yellow-500 text-black px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-yellow-600 transition-all text-sm sm:text-base font-semibold w-full sm:w-auto"
              >
                Register Now
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfReg;