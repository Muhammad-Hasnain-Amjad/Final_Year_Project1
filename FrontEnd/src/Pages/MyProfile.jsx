import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    gender: "",
    dob: "",
    phone: "",
    address: "",
  });

  // Get token from localStorage
  const getToken = () => {
    return localStorage.getItem("token");
  };

  const getUserId = () => {
    return localStorage.getItem("userId");
  };

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.get(`http://localhost:5000/user/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        const data = response.data.data;
        setFormData({
          name: data.name || "",
          email: data.email || "",
          gender: data.gender || "",
          dob: data.dob || "",
          phone: data.phone || "",
          address: data.address || "",
        });
      } else {
        toast.error(response.data.message || "Failed to load profile");
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error(error.response?.data?.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async () => {
    try {
      setSaving(true);
      const token = getToken();
      const userId = getUserId();

      if (!token || !userId) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const response = await axios.patch(`http://localhost:5000/user/profile/${userId}`, 
        {
          name: formData.name,
          gender: formData.gender,
          dob: formData.dob,
          phone: formData.phone,
          address: formData.address,
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success("Profile updated successfully!");
        
        // Update localStorage name if changed
        localStorage.setItem("userName", formData.name);
        
        setIsEditing(false);
      } else {
        toast.error(response.data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = () => {
    if (isEditing) {
      updateProfile();
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-yellow-900 flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading profile...</div>
      </div>
    );
  }

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
            disabled={saving}
            className="px-5 py-2 bg-yellow-400 text-black rounded-md font-semibold hover:scale-105 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : (isEditing ? "Save" : "Edit")}
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

          {/* EMAIL (Read-only) */}
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={true}
              className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 text-gray-400 cursor-not-allowed"
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
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
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
              type="tel"
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