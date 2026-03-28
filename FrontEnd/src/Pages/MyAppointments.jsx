import React, { useEffect, useState } from "react";
import { FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function MyAppointments() {
  const navigate=useNavigate()
  const [appointments, setAppointments] = useState([]);

  /* ================= FETCH (Replace with API) ================= */
  useEffect(() => {
    const dummyData = []; // [] means no appointments
    setAppointments(dummyData);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 text-white p-6">

      {/* ================= TITLE ================= */}
      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-4xl font-bold text-center mb-10 text-yellow-400"
      >
        My Appointments
      </motion.h1>

      {/* ================= EMPTY STATE ================= */}
      {appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center text-center mt-20"
        >
          <FaCalendarAlt className="text-yellow-400 text-9xl md:text-[10rem] animate-bounce" />

          <h2 className="text-xl md:text-2xl mt-6 font-semibold">
            No Appointments Yet
          </h2>

          <p className="text-gray-400 mt-2 max-w-md">
            You haven’t booked any appointments. Click below to schedule one.
          </p>

          <button onClick={()=>navigate("/lawyers")} className="mt-6 px-6 py-3 bg-yellow-400 text-black rounded-lg hover:scale-105 transition">
            Book Appointment
          </button>
        </motion.div>
      ) : (
        /* ================= APPOINTMENTS LIST ================= */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments.map((appt, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900 p-6 rounded-2xl border border-yellow-500 hover:scale-105 transition"
            >
              <h3 className="text-lg font-semibold text-yellow-400">
                {appt.name}
              </h3>

              <p className="text-gray-400 mt-2">
                {appt.type} Consultation
              </p>

              <p className="mt-2">
                <strong>Date:</strong> {appt.date}
              </p>

              <p>
                <strong>Time:</strong> {appt.time}
              </p>

              <p className="mt-2">
                <strong>Status:</strong>{" "}
                <span className="text-green-400">{appt.status}</span>
              </p>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}

export default MyAppointments;