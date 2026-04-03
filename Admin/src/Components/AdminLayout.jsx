// src/components/AdminLayout.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Users, 
  Scale, 
  Stethoscope, 
  LayoutDashboard,
  Shield,
  LogOut
} from "lucide-react";

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { title: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { title: "Doctors", path: "/doctors_a", icon: Stethoscope },
    { title: "Lawyers", path: "/lawyers_a", icon: Scale },
    { title: "Users", path: "/users_a", icon: Users },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="flex">
        {/* Sidebar - Always visible */}
        <div className="w-64 bg-gradient-to-b from-gray-900 to-black border-r border-yellow-500/20 min-h-screen fixed">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-yellow-500/20 rounded-xl">
                <LayoutDashboard className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-yellow-400">Admin Panel</h2>
                <p className="text-xs text-gray-500">Control Center</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {navItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.path)
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.title}</span>
                </button>
              ))}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30"
              >
                <LogOut className="w-4 h-4 text-red-400" />
                <span className="text-sm text-red-400">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area - Pushed to the right */}
        <div className="ml-64 flex-1">
          <div className="p-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}