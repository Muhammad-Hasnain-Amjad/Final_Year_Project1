import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, FaClock, FaVideo, FaMapMarkerAlt,
  FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaPlayCircle,
  FaArrowLeft, FaFilter, FaStar, FaUserCheck, FaPhoneAlt
} from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const MyAppointments = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Fetch appointments from backend
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to view appointments");
        navigate("/login");
        return [];
      }
      
      try {
        const response = await axios.get("http://localhost:5000/appointments/user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        return response.data.data || [];
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error(error.response?.data?.message || "Failed to load appointments");
        return [];
      }
    }
  });

  // Status configuration with colors and icons
  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        label: "Pending Confirmation",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
        border: "border-yellow-500/30",
        icon: FaHourglassHalf,
        badge: "bg-yellow-500",
        progressColor: "from-yellow-400 to-yellow-500"
      },
      accepted: {
        label: "Confirmed",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        icon: FaCheckCircle,
        badge: "bg-blue-500",
        progressColor: "from-blue-400 to-blue-500"
      },
      ongoing: {
        label: "In Progress",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        icon: FaPlayCircle,
        badge: "bg-purple-500",
        progressColor: "from-purple-400 to-purple-500"
      },
      completed: {
        label: "Completed",
        color: "text-green-400",
        bg: "bg-green-500/10",
        border: "border-green-500/30",
        icon: FaCheckCircle,
        badge: "bg-green-500",
        progressColor: "from-green-400 to-green-500"
      },
      cancelled: {
        label: "Cancelled",
        color: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/30",
        icon: FaTimesCircle,
        badge: "bg-red-500",
        progressColor: "from-red-400 to-red-500"
      }
    };
    return configs[status] || configs.pending;
  };

  // Filter appointments
  const filteredAppointments = appointments?.filter(app => 
    selectedFilter === "all" ? true : app.status === selectedFilter
  ) || [];

  // Stats
  const stats = {
    total: appointments?.length || 0,
    pending: appointments?.filter(a => a.status === "pending").length || 0,
    accepted: appointments?.filter(a => a.status === "accepted").length || 0,
    ongoing: appointments?.filter(a => a.status === "ongoing").length || 0,
    completed: appointments?.filter(a => a.status === "completed").length || 0,
    cancelled: appointments?.filter(a => a.status === "cancelled").length || 0
  };

  const filterOptions = [
    { value: "all", label: "All", count: stats.total, color: "white" },
    { value: "pending", label: "Pending", count: stats.pending, color: "yellow" },
    { value: "accepted", label: "Confirmed", count: stats.accepted, color: "blue" },
    { value: "ongoing", label: "In Progress", count: stats.ongoing, color: "purple" },
    { value: "completed", label: "Completed", count: stats.completed, color: "green" },
    { value: "cancelled", label: "Cancelled", count: stats.cancelled, color: "red" }
  ];

  const getProgressWidth = (status) => {
    switch(status) {
      case "pending": return "25%";
      case "accepted": return "50%";
      case "ongoing": return "75%";
      case "completed": return "100%";
      default: return "0%";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      
      {/* Header Section */}
      <div className="bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 border-b border-yellow-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-4 transition-colors"
              >
                <FaArrowLeft /> Back
              </button>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                My Appointments
              </h1>
              <p className="text-gray-400 mt-2">Track and manage your legal consultations</p>
            </div>
            
            <button
              onClick={() => navigate("/lawyers")}
              className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2 shadow-lg"
            >
              <FaCalendarAlt /> Book New Appointment
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          {filterOptions.map((filter, idx) => (
            <motion.button
              key={filter.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              onClick={() => setSelectedFilter(filter.value)}
              className={`p-4 rounded-xl border transition-all duration-300 ${
                selectedFilter === filter.value
                  ? `bg-${filter.color}-500/20 border-${filter.color}-400 shadow-lg`
                  : 'bg-gray-900/50 border-gray-700 hover:border-yellow-400/50'
              }`}
            >
              <p className={`text-2xl font-bold ${selectedFilter === filter.value ? `text-${filter.color}-400` : 'text-white'}`}>
                {filter.count}
              </p>
              <p className="text-gray-400 text-sm">{filter.label}</p>
            </motion.button>
          ))}
        </div>

        {/* Filter Bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <FaFilter className="text-yellow-400" />
            <span className="text-gray-400 text-sm">
              Showing {filteredAppointments.length} of {appointments?.length || 0} appointments
            </span>
          </div>
          
          <button
            onClick={() => refetch()}
            className="text-yellow-400 hover:text-yellow-300 text-sm transition"
          >
            Refresh
          </button>
        </div>

        {/* Appointments Grid */}
        {filteredAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center py-20"
          >
            <div className="relative">
              <div className="w-32 h-32 bg-yellow-500/10 rounded-full flex items-center justify-center animate-pulse">
                <FaCalendarAlt className="text-yellow-400 text-6xl" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center animate-bounce">
                <span className="text-black text-xs">!</span>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white mt-6">No Appointments Found</h2>
            <p className="text-gray-400 mt-2 max-w-md">
              {selectedFilter !== "all" 
                ? `You don't have any ${selectedFilter} appointments. Try a different filter.`
                : "You haven't booked any appointments yet. Schedule your first consultation now!"}
            </p>
            
            {selectedFilter !== "all" ? (
              <button
                onClick={() => setSelectedFilter("all")}
                className="mt-6 px-6 py-3 bg-gray-800 text-white rounded-xl hover:bg-gray-700 transition"
              >
                View All Appointments
              </button>
            ) : (
              <button
                onClick={() => navigate("/lawyers")}
                className="mt-6 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black rounded-xl font-semibold hover:scale-105 transition-all flex items-center gap-2"
              >
                <FaCalendarAlt /> Book Your First Appointment
              </button>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredAppointments.map((appointment, index) => {
                const statusConfig = getStatusConfig(appointment.status);
                const StatusIcon = statusConfig.icon;
                const lawyer = appointment.lawyerId;
                const appointmentDate = new Date(appointment.date);
                const progressWidth = getProgressWidth(appointment.status);
                
                return (
                  <motion.div
                    key={appointment._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="group relative bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 overflow-hidden"
                  >
                    {/* Status Badge - Large and Prominent */}
                  

                    {/* Content */}
                    <div className="p-6">
                      {/* Lawyer Info */}
                      <div className="flex items-start gap-4 mb-5">
                        <div className="relative">
                          <img
                            src={lawyer?.registration?.profilePic?.url || "https://via.placeholder.com/70"}
                            alt={lawyer?.registration?.fullName}
                            className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 shadow-lg"
                          />
                          {appointment.status === "ongoing" && (
                            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full animate-pulse ring-2 ring-black" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-white text-lg group-hover:text-yellow-400 transition">
                            {lawyer?.registration?.fullName || "Lawyer Name"}
                          </h3>
                          <p className="text-gray-400 text-sm mt-0.5">{appointment.caseType}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex items-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <FaStar key={i} className="w-3 h-3 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-gray-500 text-xs">(4.9)</span>
                          </div>
                        </div>
                      </div>

                      {/* Appointment Details */}
                      <div className="space-y-2.5 mb-5">
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <FaCalendarAlt className="text-yellow-400 w-4 h-4" />
                          <span>{appointmentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          <FaClock className="text-yellow-400 w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-400 text-sm">
                          {appointment.meetingLink ? (
                            <>
                              <FaVideo className="text-yellow-400 w-4 h-4" />
                              <span>Video Consultation</span>
                            </>
                          ) : (
                            <>
                              <FaMapMarkerAlt className="text-yellow-400 w-4 h-4" />
                              <span className="truncate">{lawyer?.registration?.officeAddress || "In Person"}</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar for Appointment Timeline */}
                      {appointment.status !== "cancelled" && (
                        <div className="mb-4">
                          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
                            <span>Booked</span>
                            <span>Confirmed</span>
                            <span>In Progress</span>
                            <span>Completed</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: progressWidth }}
                              transition={{ duration: 0.5 }}
                              className={`h-full rounded-full bg-gradient-to-r ${statusConfig.progressColor}`}
                            />
                          </div>
                        </div>
                      )}

                      {/* Description */}
                      {appointment.description && (
                        <div className="mb-4 p-3 bg-gray-800/30 rounded-lg">
                          <p className="text-gray-400 text-xs line-clamp-2">
                            <span className="text-yellow-400">Note:</span> {appointment.description}
                          </p>
                        </div>
                      )}

                      {/* Action Button based on status */}
                      <div className="pt-3 border-t border-gray-800">
                        {appointment.status === "pending" && (
                          <div className="flex items-center justify-center gap-2 text-yellow-400 text-sm">
                            <FaHourglassHalf className="animate-pulse" />
                            <span>Waiting for lawyer confirmation...</span>
                          </div>
                        )}
                        
                        {appointment.status === "accepted" && (
                          <button
                            onClick={() => window.location.href = `tel:${lawyer?.registration?.phoneNumber}`}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                          >
                            <FaPhoneAlt /> Contact Lawyer
                          </button>
                        )}
                        
                        {appointment.status === "ongoing" && appointment.meetingLink && (
                          <a
                            href={appointment.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-semibold hover:scale-105 transition-all flex items-center justify-center gap-2"
                          >
                            <FaVideo /> Join Video Call
                          </a>
                        )}
                        
                        {appointment.status === "completed" && (
                          <div className="flex items-center justify-center gap-2 text-green-400 text-sm">
                            <FaCheckCircle />
                            <span>Consultation completed successfully</span>
                          </div>
                        )}
                        
                        {appointment.status === "cancelled" && (
                          <div className="flex items-center justify-center gap-2 text-red-400 text-sm">
                            <FaTimesCircle />
                            <span>Appointment cancelled</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Animated border for ongoing */}
                    {appointment.status === "ongoing" && (
                      <div className="absolute inset-0 border-2 border-purple-500/30 rounded-2xl pointer-events-none animate-pulse" />
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;