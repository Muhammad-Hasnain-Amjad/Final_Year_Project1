import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiMenu, FiX, FiMessageCircle, FiHome, FiUsers, FiBriefcase, FiInfo, FiPhone, FiUser, FiLogOut, FiCalendar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/logo.jpeg";
import profilepic from "../assets/profile_icon.png";

const NavBar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu') && !event.target.closest('.hamburger-btn')) {
        setIsMenuOpen(false);
      }
      if (isProfileOpen && !event.target.closest('.profile-dropdown')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMenuOpen, isProfileOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("name");
    localStorage.removeItem("user");
    toast.success("Logout Successfully!");
    navigate("/");
    setIsProfileOpen(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { path: "/", name: "Home", icon: FiHome },
    { path: "/doctors", name: "Doctors", icon: FiUsers },
    { path: "/lawyers", name: "Lawyers", icon: FiBriefcase },
    { path: "/about", name: "About", icon: FiInfo },
    { path: "/contactus", name: "Contact", icon: FiPhone },
  ];

  const menuVariants = {
    hidden: { opacity: 0, x: -300 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, staggerChildren: 0.05 } },
    exit: { opacity: 0, x: -300, transition: { duration: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  };

  const toggleMenu = (e) => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <div className={`w-full flex justify-center text-white shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-black via-gray-900 to-black py-2" 
          : "bg-gradient-to-r from-black via-gray-900 to-black py-3"
      }`}>
        <div className="w-full max-w-[1400px] flex justify-between items-center px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="cursor-pointer flex items-center gap-3 flex-shrink-0"
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="logo" className="w-32 sm:w-36 h-14 sm:h-16 object-contain" />
          </motion.div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex gap-8 lg:gap-10 text-white/90 font-medium">
            {navLinks.map((link, idx) => (
              <NavLink
                key={idx}
                to={link.path}
                className={({ isActive }) =>
                  `group relative px-1 py-2 transition-all duration-300 ${
                    isActive 
                      ? "text-yellow-400 font-semibold" 
                      : "text-white/80 hover:text-yellow-400"
                  }`
                }
              >
                <span className="flex items-center gap-2">
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-500 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </NavLink>
            ))}
          </div>

          {/* Right Section - Chat Icon & Profile */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* Chat Icon with Glowing Effect */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/chats")}
              className="relative group hidden sm:flex"
            >
              <div className={`relative p-2 rounded-full transition-all duration-300 ${
                hasUnreadMessages 
                  ? "bg-yellow-500/20 animate-pulse" 
                  : "hover:bg-white/10"
              }`}>
                <FiMessageCircle className={`w-5 h-5 transition-all duration-300 ${
                  hasUnreadMessages 
                    ? "text-yellow-400 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]" 
                    : "text-white/80 group-hover:text-yellow-400"
                }`} />
                
                <div className={`absolute inset-0 rounded-full ${
                  hasUnreadMessages 
                    ? "animate-ping bg-yellow-400/30" 
                    : "opacity-0"
                }`} />
                
                {hasUnreadMessages && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs bg-black/90 text-yellow-400 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                Messages
              </span>
            </motion.button>

            {/* Profile / Account */}
            {token ? (
              <div className="relative profile-dropdown">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="group relative flex items-center gap-2 focus:outline-none"
                >
                  <div className="relative">
                    <img
                      src={profilepic}
                      alt="profile"
                      className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-yellow-400 shadow-md cursor-pointer transition-all duration-300 group-hover:border-yellow-300"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 bg-black/95 backdrop-blur-md border border-yellow-500/30 rounded-xl shadow-2xl w-56 z-50 overflow-hidden"
                    >
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-yellow-500/20">
                          <p className="text-xs text-gray-400">Signed in as</p>
                          <p className="font-semibold text-yellow-400 truncate">
                            {name || "User"}
                          </p>
                        </div>
                        
                        <button
                          onClick={() => {
                            navigate("/myprofile");
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-yellow-400/10 hover:text-yellow-400 transition flex items-center gap-3"
                        >
                          <FiUser className="w-4 h-4" />
                          My Profile
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate("/myappointments");
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-yellow-400/10 hover:text-yellow-400 transition flex items-center gap-3"
                        >
                          <FiCalendar className="w-4 h-4" />
                          Appointments
                        </button>
                        
                        <button
                          onClick={() => {
                            navigate("/chats");
                            setIsProfileOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left text-sm text-white/80 hover:bg-yellow-400/10 hover:text-yellow-400 transition flex items-center gap-3 relative"
                        >
                          <FiMessageCircle className="w-4 h-4" />
                          Messages
                          {hasUnreadMessages && (
                            <span className="ml-auto w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          )}
                        </button>
                        
                        <div className="border-t border-yellow-500/20 my-1" />
                        
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition flex items-center gap-3"
                        >
                          <FiLogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/login")}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 sm:px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-300 text-sm sm:text-base"
              >
                Sign In
              </motion.button>
            )}

            {/* Hamburger Menu Button (Mobile) - FIXED */}
            <button
              onClick={toggleMenu}
              className="hamburger-btn md:hidden p-2 rounded-lg hover:bg-white/10 transition-all duration-300 focus:outline-none relative z-50"
              style={{ cursor: 'pointer' }}
            >
              {isMenuOpen ? (
                <FiX className="w-6 h-6 text-white" />
              ) : (
                <FiMenu className="w-6 h-6 text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay - FIXED */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Mobile Menu Panel */}
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="fixed top-0 left-0 bottom-0 w-80 bg-gradient-to-b from-gray-900 to-black shadow-2xl z-40 md:hidden mobile-menu overflow-y-auto"
            >
              {/* Menu Header */}
              <div className="p-6 border-b border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="logo" className="w-32 h-14 object-contain" />
                </div>
                <p className="text-gray-400 text-sm mt-3">Navigate through the platform</p>
              </div>

              <div className="py-4">
                {navLinks.map((link, idx) => (
                  <motion.div key={idx} variants={itemVariants}>
                    <NavLink
                      to={link.path}
                      onClick={() => setIsMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-6 py-4 transition-all duration-300 ${
                          isActive 
                            ? "bg-yellow-400/10 text-yellow-400 border-l-4 border-yellow-400" 
                            : "text-white/80 hover:bg-white/5 hover:text-yellow-400"
                        }`
                      }
                    >
                      <link.icon className="w-5 h-5" />
                      <span className="font-medium text-base">{link.name}</span>
                    </NavLink>
                  </motion.div>
                ))}
                
                <div className="border-t border-yellow-500/20 my-3 mx-6" />
                
                {/* Chat Link in Mobile Menu */}
                <motion.div variants={itemVariants}>
                  <button
                    onClick={() => {
                      navigate("/chats");
                      setIsMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-6 py-4 text-white/80 hover:bg-white/5 hover:text-yellow-400 transition-all duration-300"
                  >
                    <FiMessageCircle className="w-5 h-5" />
                    <span className="font-medium text-base">Messages</span>
                    {hasUnreadMessages && (
                      <span className="ml-auto w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </button>
                </motion.div>
              </div>

              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-yellow-500/20">
                <p className="text-gray-500 text-xs text-center">
                  © 2024 Legal Platform. All rights reserved.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavBar;