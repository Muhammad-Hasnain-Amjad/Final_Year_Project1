import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Alert from '../Components/Alert';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Signup() {
  const baseURL = "http://localhost:5000/user";
  const navigate = useNavigate();

  // -----------------------------
  // STATES
  // -----------------------------
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({ show: false, type: "error", message: "" });

  // -----------------------------
  // TYPING ANIMATION
  // -----------------------------
  const titleText = "Welcome to Cure & Counsel";
  const descText =
    "We are excited to have you join a platform built for comfort, trust, and professional care. Create your account today and access expert doctors, verified lawyers, and reliable guidance all in one trusted place.";

  const [typedTitle, setTypedTitle] = useState("");
  const [typedDesc, setTypedDesc] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= titleText.length) {
        setTypedTitle(titleText.slice(0, i));
        i++;
      } else clearInterval(interval);
    }, 120);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let j = 0;
    const interval = setInterval(() => {
      if (j <= descText.length) {
        setTypedDesc(descText.slice(0, j));
        j++;
      } else clearInterval(interval);
    }, 35);
    return () => clearInterval(interval);
  }, []);

  // -----------------------------
  // FORM HANDLERS
  // -----------------------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(`${baseURL}/register`, form);

      if (!result.data.status) {
        setAlert({ show: true, type: "error", message: result.data.message });
      } else {
        setForm({ name: "", email: "", password: "" });
        setAlert({ show: true, type: "success", message: "Registered Successfully!" });
        toast.success("Registered Successfully!");
        navigate("/login");
      }
    } catch (e) {
      setAlert({
        show: true,
        type: "error",
        message: e.response?.data?.message || e.message,
      });
    }
  };

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-12">

        {/* LEFT — Welcome Text */}
        <div className="text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6 text-yellow-400">
            {typedTitle}
            <span className="animate-pulse">|</span>
          </h1>

          <p className="text-gray-300 text-lg leading-relaxed min-h-[120px]">
            {typedDesc}
            <span className="animate-pulse">|</span>
          </p>

          <p className="mt-6 text-gray-400">
            Join thousands of users who trust Cure & Counsel for fast access to professionals.
          </p>
        </div>

        {/* RIGHT — SIGNUP FORM */}
        <form
          onSubmit={handleSubmit}
          className="
            w-full bg-black text-white p-8 rounded-2xl
            shadow-[0_80px_400px_rgba(250,204,21,0.20)]
            focus-within:ring-4 focus-within:ring-yellow-400/40
            transition-all
          "
        >
          <h1 className="text-3xl font-semibold text-center mb-6">
            Create Your Account
          </h1>

          {/* ALERT */}
          {alert.show && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
              duration={2000}
            />
          )}

          {/* Name */}
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full bg-white text-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Email */}
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full bg-white text-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Password */}
          <label className="block mb-6 relative">
            <span className="text-sm font-medium mb-2 block">Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
              className="w-full bg-white text-black px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
            />
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-500 transition"
          >
            Sign Up
          </button>

          {/* Already have account */}
          <p className="mt-6 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <button
              className="text-yellow-300 hover:underline"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
          </p>

          <p className="mt-6 text-center text-gray-400">
            Want to visit the platform?{" "}
            <Link
              to="/"
              className="text-yellow-400 hover:underline"
            >
              Go to Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
