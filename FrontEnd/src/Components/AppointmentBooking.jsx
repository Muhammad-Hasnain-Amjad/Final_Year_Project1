import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt,
  FaClock,
  FaBriefcase,
  FaFileAlt,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";
import Confetti from "react-confetti";
import { toast } from "react-toastify";
import axios from "axios";

const AppointmentBooking = ({
  lawyerId,
  lawyerName,
  onClose,
  practiceAreas,
}) => {
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    practiceArea: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {}
  }, []);

  const timeSlots = [
    "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
    "01:00 PM","02:00 PM","03:00 PM","04:00 PM","05:00 PM"
  ];

  const generateDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const availableDates = generateDates();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      toast.warning("Please login first");
      return;
    }

    if (
      !bookingData.date ||
      !bookingData.time ||
      !bookingData.practiceArea ||
      !bookingData.description
    ) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/appointments",
        {
          lawyerId,
          date: bookingData.date,
          time: bookingData.time,
          caseType: bookingData.practiceArea,
          description: bookingData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        setShowConfetti(true);
        setShowSuccess(true);

        setTimeout(() => setShowConfetti(false), 7000);
        toast.success("Appointment request sent!");

        setTimeout(() => {
          setShowSuccess(false);
          onClose();
        }, 5000);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        toast.error("Session expired, login again");
        localStorage.removeItem("token");
      } else {
        toast.error(err.response?.data?.message || "Error");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Cute Confetti */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={400}
          recycle={false}
          gravity={0.2}
          colors={["#000000", "#facc15", "#ffffff"]}
        />
      )}

      <AnimatePresence>
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl shadow-2xl text-center border border-yellow-400"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="mx-auto w-20 h-20 flex items-center justify-center bg-yellow-100 rounded-full"
            >
              <FaCheckCircle className="text-yellow-500 text-4xl" />
            </motion.div>

            <h3 className="text-2xl font-bold text-black mt-4">
              🎉 Request Sent!
            </h3>
            <p className="text-gray-600 mt-2">
              Your request has been sent to <b>{lawyerName}</b>
            </p>
          </motion.div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-3xl shadow-xl space-y-6 border border-gray-200"
          >
            {/* DATE */}
            <div>
              <label className="text-black font-bold flex gap-2 items-center mb-2">
                <FaCalendarAlt className="text-yellow-500" /> Select Date
              </label>

              <div className="grid grid-cols-3 gap-2">
                {availableDates.map((d, i) => {
                  const value = d.toISOString().split("T")[0];
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setBookingData({ ...bookingData, date: value })
                      }
                      className={`p-2 rounded-xl text-sm font-semibold transition-all ${
                        bookingData.date === value
                          ? "bg-black text-white scale-105"
                          : "bg-gray-100 text-black hover:bg-yellow-100"
                      }`}
                    >
                      {d.toDateString().slice(0, 10)}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* TIME */}
            <div>
              <label className="text-black font-bold flex gap-2 mb-2">
                <FaClock className="text-yellow-500" /> Select Time
              </label>

              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setBookingData({ ...bookingData, time: t })
                    }
                    className={`p-2 rounded-xl text-sm font-semibold transition ${
                      bookingData.time === t
                        ? "bg-black text-white scale-105"
                        : "bg-gray-100 hover:bg-yellow-100"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* PRACTICE AREA */}
            <div>
              <label className="text-black font-bold flex gap-2 mb-2">
                <FaBriefcase className="text-yellow-500" /> Practice Area
              </label>

              <select
                value={bookingData.practiceArea}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    practiceArea: e.target.value,
                  })
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl bg-white text-black focus:border-yellow-400 outline-none"
              >
                <option value="">Select</option>
                {practiceAreas?.map((area, i) => (
                  <option key={i} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="text-black font-bold flex gap-2 mb-2">
                <FaFileAlt className="text-yellow-500" /> Description
              </label>

              <textarea
                value={bookingData.description}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    description: e.target.value,
                  })
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl text-black focus:border-yellow-400 outline-none"
                rows={3}
                placeholder="Describe your issue..."
              />
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border-2 border-gray-300 py-2 rounded-xl text-black font-semibold hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-black text-white py-2 rounded-xl font-bold flex justify-center items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Sending
                  </>
                ) : (
                  "Book Appointment"
                )}
              </button>
            </div>
          </form>
        )}
      </AnimatePresence>
    </>
  );
};

export default AppointmentBooking;