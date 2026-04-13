import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaHome, FaArrowLeft, FaSearch } from 'react-icons/fa';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated 404 Number */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
          className="relative"
        >
          <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
            404
          </div>
          <motion.div
            animate={{ 
              y: [0, -10, 0],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            className="absolute -top-10 -right-5 md:-top-12 md:-right-8 text-4xl md:text-5xl"
          >
            🔍
          </motion.div>
        </motion.div>

        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-gray-500 text-sm">
            Please check the URL or navigate back to safety.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          
          
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <FaHome className="w-4 h-4" />
            Back to Home
          </button>
        </motion.div>

        {/* Helpful Links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 pt-8 border-t border-gray-800"
        >
         
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute bottom-10 left-10 opacity-10">
          <FaSearch className="w-24 h-24 text-yellow-400" />
        </div>
        <div className="absolute top-20 right-10 opacity-10">
          <div className="w-16 h-16 border-4 border-yellow-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;