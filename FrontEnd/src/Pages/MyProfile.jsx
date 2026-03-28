import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "Muhammad Hasnain",
    gender: "Male",
    dob: "2002-01-01",
    phone: "0300-1234567",
    address: "Lahore, Pakistan",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-3xl bg-gray-900/80 backdrop-blur-md border border-yellow-500 rounded-2xl p-6 md:p-10 shadow-lg">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
            My Profile
          </h1>

          <button
            onClick={handleToggle}
            className="px-5 py-2 bg-yellow-400 text-black rounded-md font-semibold hover:scale-105 transition"
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* NAME */}
          <div>
            <label className="text-gray-400 text-sm">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70"
            />
          </div>

          {/* GENDER */}
          <div>
            <label className="text-gray-400 text-sm">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="text-gray-400 text-sm">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-gray-400 text-sm">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70"
            />
          </div>

          {/* ADDRESS (FULL WIDTH) */}
          <div className="md:col-span-2">
            <label className="text-gray-400 text-sm">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              rows="3"
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70"
            />
          </div>

        </div>

        {/* ACTION BUTTON */}
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => navigate("/myappointments")}
            className="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:scale-105 transition shadow-lg"
          >
            View My Appointments
          </button>
        </div>

      </div>
    </div>
  );
};

export default MyProfile;