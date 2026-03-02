import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Alert from "../Components/Alert";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:5000/user";

  // Single state for email and password
  const [form, setForm] = useState({ email: "", password: "" });

  // Password toggle
  const [showPassword, setShowPassword] = useState(false);

  // Alert state
  const [alert, setAlert] = useState({ show: false, type: "error", message: "" });

  // Typing animation
  const [typedText, setTypedText] = useState("");
  const fullTitle = "Cure & Counsel";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullTitle.slice(0, index));
      index++;
      if (index > fullTitle.length) clearInterval(timer);
    }, 140);
    return () => clearInterval(timer);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await axios.post(baseURL + "/login", form);

      if (!result.data.status) {
        setAlert({ show: true, type: "error", message: result.data.message });
      } else {
        const token = result.data.usertoken;
        const name = result.data.name;
        localStorage.setItem("token", token);
        localStorage.setItem("name", name);

        setForm({ email: "", password: "" });
        toast.success("Login Successfully!");
        navigate("/"); // Redirect to home after login
      }
    } catch (e) {
      setAlert({ show: true, type: "error", message: e.toString() });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl gap-10">

        {/* LEFT — Typing Text */}
        <div className="text-white flex flex-col justify-center md:pl-6">
          <h1 className="text-4xl font-bold mb-6">
            Welcome back to <span className="text-yellow-400">{typedText}</span>
          </h1>
          <p className="mt-6 text-gray-400">
            Experience seamless appointments, professional guidance, and 24/7 availability.
          </p>
        </div>

        {/* RIGHT — LOGIN FORM */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-black text-white p-8 rounded-2xl
            shadow-[0_80px_400px_rgba(250,204,21,0.20)]
            focus-within:ring-4 focus-within:ring-yellow-400/40
            transition-all"
        >
          <h1 className="text-2xl md:text-3xl font-semibold mb-6 text-center">
            Login to Continue
          </h1>

          {alert.show && (
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert({ ...alert, show: false })}
              duration={2000}
            />
          )}

          {/* Email */}
          <label className="block mb-4">
            <span className="text-sm font-medium block mb-2">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md
                focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="you@example.com"
            />
          </label>

          {/* Password */}
          <label className="block mb-6 relative">
            <span className="text-sm font-medium block mb-2">Password</span>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md
                focus:outline-none focus:ring-2 focus:ring-yellow-400 pr-12"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-3 top-9 text-sm text-gray-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </label>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-500 transition"
          >
            Log In
          </button>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-yellow-300 hover:underline"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </p>
          <p className="mt-6 text-center text-gray-400">
            Want to visit the platform?{" "}
            <Link to="/" className="text-yellow-400 hover:underline">
              Go to Home
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
