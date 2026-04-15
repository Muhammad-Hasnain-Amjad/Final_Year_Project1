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
  const [role, setRole] = useState("user");
  // Password toggle
  const [showPassword, setShowPassword] = useState(false);
  // Alert state
  const [alert, setAlert] = useState({ show: false, type: "error", message: "" });
  // Loading state
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setAlert({ show: false, type: "error", message: "" });

    try {
      // Decide API based on role
      let url = "";

      if (role === "lawyer") {
        url = "http://localhost:5000/lawyer/login";
      } 
      else if (role === "doctor") {
        url = "http://localhost:5000/doctor/login";
      } 
      else {
        url = "http://localhost:5000/user/login";
      }

      console.log("Sending to:", url);
      console.log("Data:", { email: form.email, password: form.password });

      const result = await axios.post(url, {
        email: form.email,
        password: form.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log("Response:", result.data);

      // Check if login was successful
      if (result.data.status === true || result.data.status === "true") {
        
        const token = result.data.usertoken || result.data.token;
        const name = result.data.name || result.data.fullName;
        const id = result.data.id || result.data._id;

        // Store tokens with role-specific names
        if (role === "lawyer") {
          localStorage.setItem("lawyertoken", token);
          localStorage.setItem("lawyerName", name);
          localStorage.setItem("lawyerId", id);
          localStorage.setItem("userType", "Lawyer");
          console.log("Lawyer token stored:", token);
        } 
        else if (role === "doctor") {
          localStorage.setItem("doctortoken", token);
          localStorage.setItem("doctorName", name);
          localStorage.setItem("doctorId", id);
          localStorage.setItem("userType", "doctor");
          console.log("Doctor token stored:", token);
        } 
        else {
          localStorage.setItem("token", token);
          localStorage.setItem("name", name);
          localStorage.setItem("userId", id);
          localStorage.setItem("userType", "User");
          console.log("User token stored:", token);
        }
        
        setForm({ email: "", password: "" });
        toast.success(result.data.message || "Login Successfully!");

        // Navigate based on role
        if (role === "lawyer") {
          navigate(`/lawyer/${id}`);
        } else if (role === "doctor") {
          navigate(`/doctor/${id}`);
        } else {
          navigate("/");
        }

      } else {
        // Login failed
        const errorMsg = result.data.message || "Invalid email or password";
        setAlert({ show: true, type: "error", message: errorMsg });
        toast.error(errorMsg);
      }

    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = `${role.charAt(0).toUpperCase() + role.slice(1)} not found`;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid password";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server. Please check if backend is running.";
      }
      
      setAlert({ show: true, type: "error", message: errorMessage });
      toast.error(errorMessage);
      
    } finally {
      setLoading(false);
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

          {/* Role Selection */}
          <div className="flex flex-col gap-2 mb-6">
            <label className="font-semibold text-yellow-400">
              Login As
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="lawyer"
                  checked={role === "lawyer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-yellow-400"
                />
                <span className="text-gray-300">Lawyer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="doctor"
                  checked={role === "doctor"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-yellow-400"
                />
                <span className="text-gray-300">Doctor</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === "user"}
                  onChange={(e) => setRole(e.target.value)}
                  className="accent-yellow-400"
                />
                <span className="text-gray-300">User</span>
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md hover:bg-yellow-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          <p className="mt-6 text-center text-sm text-gray-300">
            Don't have an account?{" "}
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