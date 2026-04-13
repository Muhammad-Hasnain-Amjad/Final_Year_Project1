import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import emailjs from "@emailjs/browser";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaTimes, FaEnvelope, FaUser, FaComment } from "react-icons/fa";

export default function Contactus() {
  const publickey = "RB4NfXrUersV92FRZ";
  const serviceId = "service_5yr61j2";
  const templateId = "template_earfujd";

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .send(
        serviceId,
        templateId,
        {
          user_name: form.name,
          user_email: form.email,
          user_message: form.message,
        },
        publickey
      )
      .then(() => {
        console.log("Email sent successfully");
        setSubmittedData({ ...form });
        setShowSuccessModal(true);
        // Clear form
        setForm({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Email failed:", error);
        alert("Failed to send message. Please try again.");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const closeModal = () => {
    setShowSuccessModal(false);
    setSubmittedData(null);
  };

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide">
      <NavBar />

      <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={sendEmail}
          className="w-full max-w-lg bg-black text-white p-8 rounded-2xl
                     shadow-[0_80px_400px_rgba(250,204,21,0.20)]
                     focus-within:ring-4 focus-within:ring-yellow-400/40 transition-all"
        >
          <h1 className="text-3xl font-semibold text-center mb-2 bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Contact Us
          </h1>
          <p className="text-gray-400 text-center mb-6 text-sm">
            We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          {/* Name */}
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block text-gray-300 flex items-center gap-2">
              <FaUser className="text-yellow-400" /> Full Name
            </span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Email */}
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block text-gray-300 flex items-center gap-2">
              <FaEnvelope className="text-yellow-400" /> Email
            </span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Message */}
          <label className="block mb-6">
            <span className="text-sm font-medium mb-2 block text-gray-300 flex items-center gap-2">
              <FaComment className="text-yellow-400" /> Message
            </span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="4"
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black font-semibold py-3 rounded-md
                       hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-yellow-400
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </span>
            ) : (
              "Send Message"
            )}
          </button>
        </motion.form>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-yellow-500/30 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition"
              >
                <FaTimes className="w-5 h-5" />
              </button>

              {/* Success Icon */}
              <div className="flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-4"
                >
                  <FaCheckCircle className="w-10 h-10 text-green-500" />
                </motion.div>

                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-yellow-400 mb-2"
                >
                  Thank You! 🎉
                </motion.h2>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-300 mb-4"
                >
                  Your message has been sent successfully to our team.
                </motion.p>

                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-800/50 rounded-xl p-4 w-full mb-4 text-left"
                >
                  <p className="text-gray-400 text-sm mb-2">📋 Message Summary:</p>
                  <p className="text-white text-sm mb-1">
                    <span className="text-yellow-400">Name:</span> {submittedData?.name}
                  </p>
                  <p className="text-white text-sm mb-1">
                    <span className="text-yellow-400">Email:</span> {submittedData?.email}
                  </p>
                  <p className="text-white text-sm">
                    <span className="text-yellow-400">Message:</span> {submittedData?.message?.substring(0, 100)}...
                  </p>
                </motion.div>

                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-gray-500 text-xs mb-4"
                >
                  Our team will get back to you within 24-48 hours.
                </motion.p>

                <motion.button
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  onClick={closeModal}
                  className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl font-semibold hover:scale-105 transition-all"
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}