import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/logo.jpeg";
import profilepic from "../assets/profile_icon.png";

const NavBar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    toast.success("Logout Successfully!");
    navigate("/"); // redirect to home after logout
  };

  return (
    <div className="w-full flex justify-center text-white shadow-lg sticky top-0 z-50
        bg-gradient-to-r from-black via-gray-900 to-black">

      <div className="w-full max-w-[1400px] flex justify-between items-center py-4 px-6">

        {/* Logo */}
        <div className="cursor-pointer flex items-center gap-3" onClick={() => navigate("/")}>
          <img src={logo} alt="logo" className="w-36 h-16 object-contain  " />
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex gap-10 text-white/90 font-medium">
          {["/", "/doctors", "/lawyers", "/about", "/contactus"].map((link, idx) => (
            <NavLink
              key={idx}
              to={link}
              className={({ isActive }) =>
                `hover:text-yellow-400 transition ${isActive ? "text-yellow-400 font-semibold" : ""}`
              }
            >
              {["Home", "Doctors", "Lawyers", "About", "Contact"][idx]}
            </NavLink>
          ))}
        </div>

        {/* Profile / Account */}
        <div className="flex items-center gap-4 relative">
         {token ? (
  <div className="group relative cursor-pointer flex items-center gap-2">
    
    <img
      src={profilepic}
      alt="profile"
      className="w-8 h-8 rounded-full border border-yellow-400 shadow-md"
    />

    {/* Dropdown */}
    <div className="absolute right-0 top-full mt-2 hidden group-hover:block bg-black/90 backdrop-blur-md border border-yellow-500/40 text-white rounded-lg shadow-xl w-44 z-50">
      <ul className="py-2">
        <li className="px-4 py-2 hover:bg-yellow-400/20 cursor-pointer">
          <span >
      Hi! <span className="font-semibold text-orange-600">{name}</span>
    </span>
        </li>
        <li
          onClick={() => navigate("/myprofile")}
          className="px-4 py-2 hover:bg-yellow-400/20 cursor-pointer"
        >
          Profile
        </li>
        <li
          onClick={() => navigate("/myappointments")}
          className="px-4 py-2 hover:bg-yellow-400/20 cursor-pointer"
        >
          Appointments
        </li>
        <li
          onClick={handleLogout}
          className="px-4 py-2 hover:bg-yellow-400/20 cursor-pointer"
        >
          Logout
        </li>
      </ul>
    </div>
  </div>
)
 : (
            <button
              onClick={() => navigate("/login")}
              className="bg-yellow-400 hover:bg-yellow-500 text-black px-5 py-2 rounded-md font-semibold shadow-md transition"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
