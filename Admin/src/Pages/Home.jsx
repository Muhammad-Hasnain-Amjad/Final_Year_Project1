import React from "react";
import { useNavigate } from "react-router-dom";
import OverviewCards from "../Components/OverviewCards";
import SystemHealth from "../Components/SystemHealth";

export default function Home() {
  const navigate = useNavigate();

  // Navigation buttons with your paths
  const navItems = [
    { title: "Doctors", path: "/doctors_a" },
    { title: "Lawyers", path: "/lawyers_a" },
    { title: "Users", path: "/users_a" }, // add Users page route
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">

      {/* LEFT — Navigation Panel */}
      <div className="w-full md:w-1/4 bg-black border-r border-yellow-400/30 p-6 flex flex-col gap-4">
        <h2 className="text-yellow-400 text-2xl font-bold mb-6">
          Admin Panel
        </h2>

        {navItems.map((item, index) => (
          <button
            key={index}
            onClick={() => navigate(item.path)}
            className="w-full text-left px-4 py-3 rounded-xl bg-yellow-400/20 text-yellow-400 hover:bg-yellow-400/40 transition font-medium"
          >
            {item.title}
          </button>
        ))}
      </div>

      {/* RIGHT — Dashboard Area */}
      <div className="w-full md:w-3/4 p-6 flex flex-col gap-6">
        {/* Overview Cards on Top */}
        <OverviewCards />

        {/* System Health Component */}
        <SystemHealth />
      </div>
    </div>
  );
}
