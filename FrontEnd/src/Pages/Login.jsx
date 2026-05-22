import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Alert from "../Components/Alert";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import api from "../config/api";

export default function Login() {
  const navigate = useNavigate();
  const baseURL = `${api}`;

  // Login State
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: "error", message: "" });
  const [loading, setLoading] = useState(false);
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email verification, Step 2: Reset password
  const [resetEmail, setResetEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

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

  // Handle login input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle login submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: "error", message: "" });

    try {
      let url = "";
      if (role === "lawyer") {
        url = `${baseURL}/lawyer/login`;
      } else {
        url = `${baseURL}/user/login`;
      }

      const result = await axios.post(url, {
        email: form.email,
        password: form.password,
        role: role
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (result.data.status === true) {
        const token =result.data.token;
        let userId = "";
        let userName = "";
        
        if (role === "lawyer") {
          userId = result.data.id;
          userName = result.data.name;
          
          localStorage.clear();
          localStorage.setItem("userType", "Lawyer");
          localStorage.setItem("token", token);
          localStorage.setItem("lawyerId", userId);
          localStorage.setItem("lawyerName", userName);
        } else {
          userId = result.data.id || result.data._id;
          userName = result.data.name || result.data.fullName;
          
          localStorage.clear();
          localStorage.setItem("token", token);
          localStorage.setItem("userId", userId);
          localStorage.setItem("userType", "User");
          localStorage.setItem("userName", userName);
          localStorage.setItem("userEmail", form.email);
        }
        
        toast.success(result.data.message || "Login Successfully!");
        
        setTimeout(() => {
          if (role === "lawyer") {
            window.location.href = `/lawyer/${userId}`;
          } else {
            window.location.href = "/";
          }
        }, 500);
      } else {
        const errorMsg = result.data.message || "Invalid email or password";
        setAlert({ show: true, type: "error", message: errorMsg });
        toast.error(errorMsg);
      }
    } catch (error) {
      let errorMessage = "Login failed. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 404) {
        errorMessage = `${role.charAt(0).toUpperCase() + role.slice(1)} not found`;
      } else if (error.response?.status === 400) {
        errorMessage = "Invalid password";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server.";
      }
      setAlert({ show: true, type: "error", message: errorMessage });
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 1: Verify email exists
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      toast.error("Please enter your email address");
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${baseURL}/user/verify-email`, {
        email: resetEmail,
        role: role
      });

      if (response.data.success) {
        setEmailVerified(true);
        setStep(2);
        toast.success("Email verified! Now enter your new password.");
      } else {
        toast.error(response.data.message || "Email not found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Email not found. Please check and try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // Step 2: Reset password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${baseURL}/user/reset-password-direct`, {
        email: resetEmail,
        newPassword: newPassword,
        role: role
      });

      if (response.data.success) {
        toast.success("Password reset successful! Please login with new password.");
        setTimeout(() => {
          setShowForgotPassword(false);
          setStep(1);
          setResetEmail("");
          setNewPassword("");
          setConfirmPassword("");
          setEmailVerified(false);
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setResetLoading(false);
    }
  };

  // Forgot Password Modal
  if (showForgotPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-6 py-10">
        <div className="w-full max-w-md">
          <button
            onClick={() => {
              setShowForgotPassword(false);
              setStep(1);
              setResetEmail("");
              setNewPassword("");
              setConfirmPassword("");
              setEmailVerified(false);
            }}
            className="mb-4 flex items-center gap-2 text-gray-400 hover:text-yellow-400 transition"
          >
            <FaArrowLeft /> Back to Login
          </button>

          <div className="bg-black rounded-2xl shadow-2xl p-8 border border-yellow-500/30">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/20 mb-4">
                {step === 1 ? <FaEnvelope className="text-4xl text-yellow-400" /> : <FaLock className="text-4xl text-yellow-400" />}
              </div>
              <h2 className="text-2xl font-bold text-white">
                {step === 1 ? "Forgot Password?" : "Reset Password"}
              </h2>
              <p className="text-gray-400 mt-2 text-sm">
                {step === 1 
                  ? "Enter your email to verify your account" 
                  : `Reset password for ${resetEmail}`}
              </p>
            </div>

            {step === 1 ? (
              <form onSubmit={handleVerifyEmail}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                      placeholder="you@example.com"
                      required
                      autoFocus
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {resetLoading ? "Verifying..." : "Verify Email"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showResetPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                      placeholder="Enter new password (min. 8 characters)"
                      required
                      autoFocus
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showResetPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                      placeholder="Confirm new password"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50"
                >
                  {resetLoading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Main Login UI
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
          <label className="block mb-4 relative">
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

          {/* Forgot Password Link */}
          <div className="text-right mb-6">
            <button
              type="button"
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-yellow-400 hover:text-yellow-300 hover:underline transition"
            >
              Forgot Password?
            </button>
          </div>

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