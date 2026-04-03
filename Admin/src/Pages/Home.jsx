// src/Pages/Home.jsx
import React from "react";
import { motion } from "framer-motion";
import OverviewCards from "../Components/OverviewCards";
import SystemHealth from "../Components/SystemHealth";

export default function Home() {
  return (
    <>
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Welcome back, Admin
        </h1>
        <p className="text-gray-500 mt-2">Here's what's happening with your platform today.</p>
      </motion.div>

      {/* Overview Cards on Top */}
      <OverviewCards />

      {/* System Health Component */}
      <SystemHealth />
    </>
  );
}