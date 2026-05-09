import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaShieldAlt, FaArrowLeft, FaCheck } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const baseURL = "http://localhost:5000";

  // Login State
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Forgot Password State
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Email verification, Step 2: Reset password
  const [resetEmail, setResetEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  // Typing animation
  const [typedText, setTypedText] = useState("");
  const fullTitle = "Admin Portal";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedText(fullTitle.slice(0, index));
      index++;
      if (index > fullTitle.length) clearInterval(timer);
    }, 140);
    return () => clearInterval(timer);
  }, []);

  // Handle login
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await axios.post(`${baseURL}/user/login`, {
        email: form.email,
        password: form.password,
        role: "admin"
      }, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (result.data.status === true || result.data.status === "true" || result.data.success === true) {
        const token = result.data.token;
        const userId = result.data.id;
        const userName = result.data.name;

        localStorage.clear();
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("userType", "admin");
        localStorage.setItem("userName", userName);
        localStorage.setItem("userEmail", form.email);
        localStorage.setItem("isAdmin", "true");
        
        toast.success("Welcome Admin! Redirecting to dashboard...");
        
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } else {
        toast.error(result.data.message || "Invalid admin credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      let errorMessage = "Login failed. Please try again.";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 401) {
        errorMessage = "Unauthorized. Admin access only.";
      } else if (error.response?.status === 404) {
        errorMessage = "Admin account not found";
      } else if (error.code === "ERR_NETWORK") {
        errorMessage = "Cannot connect to server";
      }
      
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
        role: "admin"
      });

      if (response.data.success) {
        setEmailVerified(true);
        setStep(2);
        toast.success("Email verified! Now enter your new password.");
      } else {
        toast.error(response.data.message || "Email not found");
      }
    } catch (error) {
      console.error("Email verification error:", error);
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
    
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setResetLoading(true);
    try {
      const response = await axios.post(`${baseURL}/user/reset-password-direct`, {
        email: resetEmail,
        newPassword: newPassword,
        role: "admin"
      });

      if (response.data.success) {
        toast.success("Password reset successful! Please login with new password.");
        // Reset all states and go back to login
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
      console.error("Reset password error:", error);
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
          {/* Back button */}
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
              // Step 1: Email verification form
              <form onSubmit={handleVerifyEmail}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Admin Email
                  </label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                      placeholder="admin@example.com"
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
              // Step 2: Reset password form
              <form onSubmit={handleResetPassword}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                      placeholder="Enter new password"
                      required
                      autoFocus
                    />
                     <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                      placeholder="Confirm new password"
                      required
                    />
                     <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
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

  // Main Login UI (BLACK BACKGROUND)
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 w-full max-w-5xl gap-10">
        
        {/* LEFT SIDE - Admin Branding */}
        <div className="text-white flex flex-col justify-center md:pl-6">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center">
              <FaShieldAlt className="text-2xl text-black" />
            </div>
            <h1 className="text-4xl font-bold">
              Admin <span className="text-yellow-400">{typedText}</span>
            </h1>
          </div>
          <p className="text-gray-300 text-lg leading-relaxed">
            Secure access to manage lawyers, doctors, users, and platform analytics.
          </p>
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span>Manage user accounts</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span>Verify professional credentials</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
              <span>Platform analytics & reports</span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - Admin Login Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full bg-black text-white p-8 rounded-2xl shadow-2xl border border-yellow-500/30 focus-within:ring-4 focus-within:ring-yellow-400/40 transition-all"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold">Admin Access Only</h2>
            <p className="text-gray-400 text-sm mt-2">Enter your credentials to continue</p>
          </div>

          {/* Email Field */}
          <label className="block mb-6">
            <span className="text-sm font-medium block mb-2 text-gray-300">Email Address</span>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                placeholder="admin@curecounsel.com"
              />
            </div>
          </label>

          {/* Password Field */}
          <label className="block mb-4 relative">
            <span className="text-sm font-medium block mb-2 text-gray-300">Password</span>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full bg-gray-900 text-white pl-10 pr-12 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 border border-gray-700"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-semibold py-3 rounded-lg hover:bg-yellow-400 transition disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
          >
            {loading ? "Authenticating..." : "Login as Admin"}
          </button>

          {/* Security Note */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <p className="text-xs text-gray-600">
              This area is restricted to authorized personnel only.
              All activities are monitored and logged.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}