import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope, 
  FaBriefcase, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaVideo, FaComments, FaFileAlt, FaSearch, FaFilter,
  FaArrowLeft, FaArrowRight, FaEye, FaClock as FaPending
} from "react-icons/fa";
import { toast } from "react-toastify";

const LawyerAppointments = () => {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // FIXED: Get lawyer ID from correct localStorage key
  const lawyerId = localStorage.getItem("lawyerId") || localStorage.getItem("userId");
  const token = localStorage.getItem("lawyertoken") || localStorage.getItem("token");

  console.log("Lawyer ID:", lawyerId);
  console.log("Token exists:", !!token);

  // Fetch appointments for this lawyer
  const { data: appointments, isLoading, error, refetch } = useQuery({
    queryKey: ["lawyer-appointments", lawyerId],
    queryFn: async () => {
      if (!lawyerId) {
        console.error("No lawyer ID found");
        toast.error("Lawyer ID not found. Please login again.");
        return [];
      }
      
      if (!token) {
        console.error("No token found");
        toast.error("Please login again");
        return [];
      }
      
      console.log("Fetching appointments for lawyer:", lawyerId);
      
      try {
        const response = await axios.get(
          `http://localhost:5000/appointments/lawyer/${lawyerId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        console.log("API Response:", response.data);
        return response.data.data || [];
      } catch (err) {
        console.error("API Error:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to fetch appointments");
        return [];
      }
    },
    enabled: !!lawyerId && !!token
  });

  // Update appointment status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, meetingLink }) => {
      const response = await axios.patch(
        `http://localhost:5000/appointments/${id}/status`,
        { status, meetingLink },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      return response.data.data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["lawyer-appointments", lawyerId]);
      toast.success(`Appointment ${variables.status} successfully!`);
      setSelectedAppointment(null);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast.error(error.response?.data?.message || "Failed to update appointment status");
    }
  });

  // Filter appointments
  const filteredAppointments = appointments?.filter(apt => {
    if (filterStatus !== "all" && apt.status !== filterStatus) return false;
    if (searchTerm) {
      const userName = apt.userId?.fullName?.toLowerCase() || "";
      const caseType = apt.caseType?.toLowerCase() || "";
      return userName.includes(searchTerm.toLowerCase()) || 
             caseType.includes(searchTerm.toLowerCase());
    }
    return true;
  });

  // Pagination
  const totalPages = Math.ceil((filteredAppointments?.length || 0) / itemsPerPage);
  const paginatedAppointments = filteredAppointments?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      pending: { color: "yellow", icon: FaPending, text: "Pending", bg: "bg-yellow-500/20", textColor: "text-yellow-400" },
      accepted: { color: "green", icon: FaCheckCircle, text: "Accepted", bg: "bg-green-500/20", textColor: "text-green-400" },
      ongoing: { color: "blue", icon: FaVideo, text: "Ongoing", bg: "bg-blue-500/20", textColor: "text-blue-400" },
      completed: { color: "gray", icon: FaCheckCircle, text: "Completed", bg: "bg-gray-500/20", textColor: "text-gray-400" },
      cancelled: { color: "red", icon: FaTimesCircle, text: "Cancelled", bg: "bg-red-500/20", textColor: "text-red-400" }
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.textColor}`}>
        <Icon className="w-3 h-3" />
        {config.text}
      </span>
    );
  };

  // Appointment Card Component
  const AppointmentCard = ({ appointment, onClick }) => {
    const user = appointment.userId;
    const date = new Date(appointment.date);
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        onClick={() => onClick(appointment)}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 cursor-pointer hover:border-yellow-400/50 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-full flex items-center justify-center">
              {user?.profilePic?.url ? (
                <img src={user.profilePic.url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <FaUser className="w-6 h-6 text-yellow-400" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{user?.name || "Anonymous"}</h3>
              <div className="flex items-center gap-2 mt-1">
                <FaCalendarAlt className="w-3 h-3 text-yellow-400" />
                <span className="text-xs text-gray-400">{date.toLocaleDateString()}</span>
                <FaClock className="w-3 h-3 text-yellow-400 ml-2" />
                <span className="text-xs text-gray-400">{appointment.time}</span>
              </div>
            </div>
          </div>
          <StatusBadge status={appointment.status} />
        </div>
        
        <div className="mt-3">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaBriefcase className="w-3 h-3 text-yellow-400" />
            <span>{appointment.caseType}</span>
          </div>
          <p className="text-gray-500 text-xs mt-2 line-clamp-2">
            {appointment.description}
          </p>
        </div>
        
        <div className="mt-3 pt-3 border-t border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FaPhone className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">{user?.phoneNumber || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaEnvelope className="w-3 h-3 text-gray-500" />
            <span className="text-xs text-gray-500">{user?.email || "N/A"}</span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Stats Cards
  const stats = [
    { title: "Total Appointments", value: appointments?.length || 0, icon: FaCalendarAlt, color: "yellow" },
    { title: "Pending", value: appointments?.filter(a => a.status === "pending").length || 0, icon: FaPending, color: "yellow" },
    { title: "Accepted", value: appointments?.filter(a => a.status === "accepted").length || 0, icon: FaCheckCircle, color: "green" },
    { title: "Completed", value: appointments?.filter(a => a.status === "completed").length || 0, icon: FaCheckCircle, color: "gray" },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Appointments Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage and track all your client appointments</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{stat.title}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 bg-${stat.color}-500/20 rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by client name or case type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-400 outline-none text-white"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "accepted", "ongoing", "completed", "cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${
                  filterStatus === status
                    ? "bg-yellow-500 text-black"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Appointments Grid */}
        {paginatedAppointments?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700"
          >
            <FaCalendarAlt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No appointments found</p>
            <p className="text-gray-500 text-sm mt-1">Appointments will appear here once clients book with you</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <AnimatePresence>
                {paginatedAppointments?.map((appointment) => (
                  <AppointmentCard
                    key={appointment._id}
                    appointment={appointment}
                    onClick={setSelectedAppointment}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowLeft />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-yellow-500 text-black"
                        : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Appointment Details Modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAppointment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-yellow-400">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {/* Client Info */}
              <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-xl mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-full flex items-center justify-center">
                  {selectedAppointment.userId?.profilePic?.url ? (
                    <img src={selectedAppointment.userId.profilePic.url} alt="" className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <FaUser className="w-8 h-8 text-yellow-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">{selectedAppointment.userId?.name || "Anonymous"}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <FaPhone className="w-3 h-3" />
                      {selectedAppointment.userId?.phone || "N/A"}
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <FaEnvelope className="w-3 h-3" />
                      {selectedAppointment.userId?.email || "N/A"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-500 text-xs">Date</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <FaCalendarAlt className="text-yellow-400" />
                    {new Date(selectedAppointment.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-500 text-xs">Time</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <FaClock className="text-yellow-400" />
                    {selectedAppointment.time}
                  </p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-500 text-xs">Case Type</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <FaBriefcase className="text-yellow-400" />
                    {selectedAppointment.caseType}
                  </p>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-xl">
                  <p className="text-gray-500 text-xs">Status</p>
                  <StatusBadge status={selectedAppointment.status} />
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-gray-800/50 rounded-xl mb-6">
                <p className="text-gray-500 text-xs mb-2 flex items-center gap-2">
                  <FaFileAlt className="text-yellow-400" /> Case Description
                </p>
                <p className="text-white">{selectedAppointment.description}</p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                {selectedAppointment.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatusMutation.mutate({ 
                        id: selectedAppointment._id, 
                        status: "accepted" 
                      })}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl font-semibold hover:bg-green-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaCheckCircle /> Accept Appointment
                    </button>
                    <button
                      onClick={() => updateStatusMutation.mutate({ 
                        id: selectedAppointment._id, 
                        status: "cancelled" 
                      })}
                      disabled={updateStatusMutation.isPending}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <FaTimesCircle /> Reject
                    </button>
                  </>
                )}
                
                {selectedAppointment.status === "accepted" && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ 
                      id: selectedAppointment._id, 
                      status: "ongoing" 
                    })}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-xl font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaVideo /> Start Session
                  </button>
                )}
                
                {selectedAppointment.status === "ongoing" && (
                  <button
                    onClick={() => updateStatusMutation.mutate({ 
                      id: selectedAppointment._id, 
                      status: "completed" 
                    })}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 bg-yellow-500 text-black py-2 rounded-xl font-semibold hover:bg-yellow-600 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaCheckCircle /> Mark Complete
                  </button>
                )}
                
                <button
                  onClick={() => {
                    window.location.href = `tel:${selectedAppointment.userId?.phone}`;
                  }}
                  className="flex-1 bg-gray-700 text-white py-2 rounded-xl font-semibold hover:bg-gray-600 transition flex items-center justify-center gap-2"
                >
                  <FaPhone /> Call Client
                </button>
              </div>

              {updateStatusMutation.isPending && (
                <div className="flex justify-center mt-4">
                  <FaSpinner className="animate-spin text-yellow-400" />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawyerAppointments;