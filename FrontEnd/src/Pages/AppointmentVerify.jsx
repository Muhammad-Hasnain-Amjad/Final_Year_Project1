// src/Pages/AppointmentVerify.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaCalendarAlt, 
  FaArrowRight,
  FaHome,
  FaRegSmile,
  FaRegFrown
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import api from "../config/api";

const AppointmentVerify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get('success');
  const appointmentId = searchParams.get('appointmentId');
  const [verifying, setVerifying] = useState(true);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate progress bar during verification
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${api}/appointments/verify-payment`,
          { appointmentId, success },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        setResult(response.data);
        setProgress(100);
        
        if (response.data.status && response.data.message === "paid") {
          toast.success("✅ Payment successful! Your appointment is confirmed.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            setVerifying(false);
            setTimeout(() => navigate('/myappointments'), 2000);
          }, 500);
        } else {
          toast.error("❌ Payment failed. Appointment cancelled.", {
            position: "top-right",
            autoClose: 5000,
          });
          setTimeout(() => {
            setVerifying(false);
            setTimeout(() => navigate('/lawyers'), 2000);
          }, 500);
        }
      } catch (error) {
        console.error('Verification error:', error);
        toast.error("Error verifying payment. Please contact support.");
        setTimeout(() => {
          setVerifying(false);
          setTimeout(() => navigate('/my-appointments'), 2000);
        }, 500);
      }
    };
    
    if (appointmentId && success) {
      verifyPayment();
    } else {
      navigate('/myappointments');
    }

    return () => clearInterval(interval);
  }, [appointmentId, success, navigate]);

  const isSuccess = result?.status && result?.message === "paid";

  // Animated background particles
  const particles = Array.from({ length: 50 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 5 + Math.random() * 10,
    delay: Math.random() * 5
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 overflow-hidden relative">
      
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-yellow-400/30 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
            animate={{
              y: [`${particle.y}%`, `${particle.y - 20}%`, `${particle.y}%`],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <AnimatePresence mode="wait">
          {verifying ? (
            // Verification Loading State
            <motion.div
              key="loading"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-md w-full"
            >
              <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-3xl p-8 border border-yellow-400/20 shadow-2xl">
                {/* Animated Logo */}
                <div className="relative flex justify-center mb-8">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1, repeat: Infinity }
                    }}
                    className="w-24 h-24 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center shadow-lg"
                  >
                    <FaSpinner className="text-black text-4xl" />
                  </motion.div>
                  <motion.div
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center"
                  >
                    <span className="text-black text-xs font-bold">💰</span>
                  </motion.div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-gray-400 mb-2">
                    <span>Verifying Payment</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.3 }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                    />
                  </div>
                </div>

                {/* Loading Messages */}
                <div className="space-y-3 text-center">
                  <motion.p
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-white font-medium"
                  >
                    Processing your payment...
                  </motion.p>
                  <p className="text-gray-400 text-sm">
                    Please wait while we confirm your transaction
                  </p>
                </div>

                {/* Animated Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-yellow-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Result State - Success or Failure
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="max-w-lg w-full"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className={`bg-gradient-to-br backdrop-blur-xl rounded-3xl p-8 border-2 shadow-2xl ${
                  isSuccess
                    ? 'from-green-900/30 to-green-800/30 border-green-500/50'
                    : 'from-red-900/30 to-red-800/30 border-red-500/50'
                }`}
              >
                {/* Animated Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    scale: { type: "spring", stiffness: 200, delay: 0.2 },
                    rotate: { duration: 0.5, delay: 0.3 }
                  }}
                  className="flex justify-center mb-6"
                >
                  <div className={`w-32 h-32 rounded-full flex items-center justify-center ${
                    isSuccess
                      ? 'bg-gradient-to-r from-green-500 to-green-600'
                      : 'bg-gradient-to-r from-red-500 to-red-600'
                  } shadow-2xl`}>
                    {isSuccess ? (
                      <FaCheckCircle className="text-white text-7xl" />
                    ) : (
                      <FaTimesCircle className="text-white text-7xl" />
                    )}
                  </div>
                </motion.div>

                {/* Confetti Effect for Success */}
                {isSuccess && (
                  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
                    {[...Array(20)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ 
                          x: Math.random() * 400 - 200,
                          y: -100,
                          opacity: 1
                        }}
                        animate={{ 
                          y: 600,
                          opacity: 0,
                          rotate: 360
                        }}
                        transition={{ 
                          duration: 2 + Math.random() * 2,
                          delay: Math.random() * 0.5,
                          repeat: Infinity
                        }}
                        className={`absolute w-3 h-3 rounded-full ${
                          ['bg-yellow-400', 'bg-green-400', 'bg-blue-400', 'bg-pink-400'][i % 4]
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Title & Message */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-center"
                >
                  <motion.h1
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className={`text-3xl md:text-4xl font-bold mb-3 ${
                      isSuccess ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-gray-300 mb-6"
                  >
                    {isSuccess
                      ? 'Your appointment has been confirmed successfully.'
                      : 'We could not process your payment. Please try again.'}
                  </motion.p>

                  {/* Animated Checkmark Animation for Success */}
                  {isSuccess && (
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="hidden"
                    />
                  )}

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
                  >
                    {isSuccess ? (
                      <>
                        <button
                          onClick={() => navigate('/my-appointments')}
                          className="group relative px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            <FaCalendarAlt /> View My Appointments <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-white"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: 0 }}
                            transition={{ duration: 0.3 }}
                          />
                        </button>
                        
                        <button
                          onClick={() => navigate('/')}
                          className="px-6 py-3 bg-gray-700/50 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaHome /> Back to Home
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => window.location.reload()}
                          className="group relative px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                        >
                          <span className="relative z-10 flex items-center gap-2">
                            Try Again <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                          </span>
                        </button>
                        
                        <button
                          onClick={() => navigate('/lawyers')}
                          className="px-6 py-3 bg-gray-700/50 text-white rounded-xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center gap-2"
                        >
                          <FaRegSmile /> Find Lawyers
                        </button>
                      </>
                    )}
                  </motion.div>

                  {/* Additional Info */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className="mt-8 pt-6 border-t border-gray-700"
                  >
                    <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                      {isSuccess ? (
                        <>
                          <FaRegSmile className="text-yellow-400" />
                          <span>You will receive a confirmation email shortly</span>
                        </>
                      ) : (
                        <>
                          <FaRegFrown className="text-yellow-400" />
                          <span>Need help? Contact our support team</span>
                        </>
                      )}
                    </div>
                  </motion.div>
                </motion.div>
              </motion.div>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/10 rounded-full blur-3xl"
              />
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-400/10 rounded-full blur-3xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AppointmentVerify;