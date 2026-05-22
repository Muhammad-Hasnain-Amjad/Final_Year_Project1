// src/Lawyers_files/LawyerAppointments.jsx
import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCalendarAlt, FaClock, FaUser, FaPhone, FaEnvelope,
  FaBriefcase, FaCheckCircle, FaTimesCircle, FaSpinner,
  FaVideo, FaFileAlt, FaArrowLeft, FaArrowRight,
  FaMoneyBillWave, FaWallet, FaQuestionCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import api from "../config/api";

const LawyerAppointments = () => {
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentAppointment, setPaymentAppointment] = useState(null);
  const itemsPerPage = 6;

  // ✅ ONLY lawyer token - NO fallback to user token
  const lawyerId = localStorage.getItem("lawyerId");
  const token = localStorage.getItem("lawyertoken");

  // ── Fetch appointments ─────────────────────────────────
  const { data: appointments = [], isLoading, refetch } = useQuery({
    queryKey: ["lawyer-appointments", lawyerId],
    queryFn: async () => {
      if (!lawyerId || !token) return [];
      try {
        const res = await axios.get(
          `${api}/appointments/lawyer/${lawyerId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        return res.data.data || [];
      } catch (err) {
        toast.error("Failed to fetch appointments");
        return [];
      }
    },
    enabled: !!lawyerId && !!token
  });

  // ── Mark Payment as Paid
  const markPaymentPaidMutation = useMutation({
    mutationFn: async ({ id }) => {
      const res = await axios.patch(
        `${api}/appointments/${id}/payment`,
        { isPaid: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["lawyer-appointments", lawyerId]);
      toast.success("✅ Payment marked as received! Appointment confirmed.");
      setShowConfirmModal(false);
      setPaymentAppointment(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to mark payment");
      setShowConfirmModal(false);
      setPaymentAppointment(null);
    },
  });

  // ── Update appointment status
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axios.patch(
        `${api}/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(["lawyer-appointments", lawyerId]);
      toast.success(`Appointment ${variables.status} successfully!`);
      setSelectedAppointment(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update status");
    },
  });

  const handlePaymentClick = (appointment) => {
    setSelectedAppointment(null);
    setPaymentAppointment(appointment);
    setTimeout(() => setShowConfirmModal(true), 150);
  };

  const confirmPayment = () => {
    if (paymentAppointment) {
      markPaymentPaidMutation.mutate({ id: paymentAppointment._id });
    }
  };

  const cancelConfirm = () => {
    setShowConfirmModal(false);
    setPaymentAppointment(null);
  };

  // ── Filters + pagination ───────────────────────────────
  const filtered = appointments.filter(
    (a) => filterStatus === "all" || a.status === filterStatus
  );
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ── Badge components ───────────────────────────────────
  const StatusBadge = ({ status, isPaid }) => {
    if (status === "accepted" && !isPaid) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
          <FaWallet className="w-3 h-3" /> Payment Pending
        </span>
      );
    }
    const cfg = {
      pending:   { text: "Pending",   cls: "bg-yellow-500/20 text-yellow-400" },
      accepted:  { text: "Confirmed", cls: "bg-green-500/20 text-green-400"   },
      ongoing:   { text: "Ongoing",   cls: "bg-blue-500/20 text-blue-400"     },
      completed: { text: "Completed", cls: "bg-gray-500/20 text-gray-400"     },
      cancelled: { text: "Cancelled", cls: "bg-red-500/20 text-red-400"       },
    }[status] || { text: status, cls: "bg-gray-500/20 text-gray-400" };
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${cfg.cls}`}>
        {cfg.text}
      </span>
    );
  };

  const PaymentBadge = ({ isPaid }) =>
    isPaid ? (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
        <FaCheckCircle className="w-3 h-3" /> Paid
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-orange-500/20 text-orange-400">
        <FaWallet className="w-3 h-3" /> Unpaid
      </span>
    );

  // ── Appointment card ───────────────────────────────────
  const AppointmentCard = ({ apt }) => {
    const user = apt.userId;
    const date = new Date(apt.date);
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -4 }}
        onClick={() => setSelectedAppointment(apt)}
        className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-5 cursor-pointer hover:border-yellow-400/50 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400/10 rounded-full flex items-center justify-center overflow-hidden">
              {user?.profilePic?.url
                ? <img src={user.profilePic.url} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                : <FaUser className="w-6 h-6 text-yellow-400" />}
            </div>
            <div>
              <h3 className="font-semibold text-white">{user?.name || user?.fullName || "Anonymous"}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                <FaCalendarAlt className="w-3 h-3 text-yellow-400" />
                {date.toLocaleDateString()}
                <FaClock className="w-3 h-3 text-yellow-400 ml-1" />
                {apt.time}
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={apt.status} isPaid={apt.isPaid} />
            <PaymentBadge isPaid={apt.isPaid} />
          </div>
        </div>

        <div className="mt-3 space-y-1">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaBriefcase className="w-3 h-3 text-yellow-400" /> {apt.caseType}
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <FaMoneyBillWave className="w-3 h-3 text-yellow-400" /> Fee: PKR {apt.fee || apt.amount || 5000}
          </div>
          <p className="text-gray-500 text-xs mt-1 line-clamp-2">{apt.description || apt.notes}</p>
        </div>

        {/* Quick action buttons on card */}
        <div className="mt-3 pt-3 border-t border-gray-700 flex gap-2">
          {apt.status === "pending" && (
            <>
              <button onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: apt._id, status: "accepted" }); }}
                className="flex-1 bg-green-500/20 text-green-400 py-2 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition flex items-center justify-center gap-1">
                <FaCheckCircle /> Accept
              </button>
              <button onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: apt._id, status: "cancelled" }); }}
                className="flex-1 bg-red-500/20 text-red-400 py-2 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition flex items-center justify-center gap-1">
                <FaTimesCircle /> Reject
              </button>
            </>
          )}
          {apt.status === "accepted" && !apt.isPaid && (
            <button onClick={(e) => { e.stopPropagation(); handlePaymentClick(apt); }}
              className="w-full bg-orange-500/20 text-orange-400 py-2 rounded-lg text-sm font-semibold hover:bg-orange-500/30 transition flex items-center justify-center gap-2">
              <FaMoneyBillWave /> Cash on Meeting — Mark Paid
            </button>
          )}
          {apt.status === "accepted" && apt.isPaid && (
            <button onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: apt._id, status: "ongoing" }); }}
              className="w-full bg-blue-500/20 text-blue-400 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition flex items-center justify-center gap-2">
              <FaVideo /> Start Session
            </button>
          )}
          {apt.status === "ongoing" && (
            <button onClick={(e) => { e.stopPropagation(); updateStatusMutation.mutate({ id: apt._id, status: "completed" }); }}
              className="w-full bg-yellow-500/20 text-yellow-400 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-500/30 transition flex items-center justify-center gap-2">
              <FaCheckCircle /> Mark Complete
            </button>
          )}
        </div>
      </motion.div>
    );
  };

  // ── Stats ──────────────────────────────────────────────
  const stats = [
    { title: "Total",     value: appointments.length,                                             icon: FaCalendarAlt },
    { title: "Pending",   value: appointments.filter((a) => a.status === "pending").length,       icon: FaClock       },
    { title: "Confirmed", value: appointments.filter((a) => a.status === "accepted").length,      icon: FaCheckCircle },
    { title: "Completed", value: appointments.filter((a) => a.status === "completed").length,     icon: FaCheckCircle },
    { title: "Unpaid",    value: appointments.filter((a) => !a.isPaid && a.status !== "cancelled").length, icon: FaWallet },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-yellow-600 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
            Appointments Dashboard
          </h1>
          <p className="text-gray-400 mt-2">Manage and track all your client appointments</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {stats.map((s, idx) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
              className="bg-gray-800/50 rounded-2xl border border-gray-700 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs">{s.title}</p>
                  <p className="text-2xl font-bold text-white">{s.value}</p>
                </div>
                <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                  <s.icon className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            {["all", "pending", "accepted", "ongoing", "completed", "cancelled"].map((s) => (
              <button key={s} onClick={() => { setFilterStatus(s); setCurrentPage(1); }}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${filterStatus === s ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                {s === "all" ? "All" : s}
              </button>
            ))}
          </div>
          <button onClick={() => refetch()} className="text-yellow-400 hover:text-yellow-300 text-sm transition">
            ↻ Refresh
          </button>
        </div>

        {/* Grid */}
        {paginated.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-gray-700">
            <FaCalendarAlt className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No appointments found</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-6">
              <AnimatePresence>
                {paginated.map((apt) => <AppointmentCard key={apt._id} apt={apt} />)}
              </AnimatePresence>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50">
                  <FaArrowLeft />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${currentPage === i + 1 ? "bg-yellow-500 text-black" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                    {i + 1}
                  </button>
                ))}
                <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-gray-800 text-gray-400 hover:bg-gray-700 disabled:opacity-50">
                  <FaArrowRight />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================================ */}
      {/* APPOINTMENT DETAILS MODAL - REDESIGNED WITH 2 DIVS */}
      {/* ============================================================ */}
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
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-gradient-to-br from-gray-900 to-black rounded-t-2xl border-b border-gray-700 p-5 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-yellow-400">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-white text-2xl transition"
                >
                  ×
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* ========== DIV 1: CLIENT & APPOINTMENT INFO GRID ========== */}
                <div className="space-y-5">
                  {/* Client Info Section */}
                  <div className="flex items-center gap-4 p-4 bg-gray-800/40 rounded-xl border border-gray-700">
                    <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center overflow-hidden">
                      {selectedAppointment.userId?.profilePic?.url ? (
                        <img 
                          src={selectedAppointment.userId.profilePic.url} 
                          alt="" 
                          className="w-16 h-16 rounded-full object-cover" 
                        />
                      ) : (
                        <FaUser className="w-8 h-8 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white">
                        {selectedAppointment.userId?.name || selectedAppointment.userId?.fullName || "Anonymous"}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 mt-1 text-gray-400 text-sm">
                        <span className="flex items-center gap-1">
                          <FaPhone className="w-3 h-3 text-yellow-400" />
                          {selectedAppointment.userId?.phoneNumber || "N/A"}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaEnvelope className="w-3 h-3 text-yellow-400" />
                          {selectedAppointment.userId?.email || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info Grid - Clean 2 Column Layout */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3 text-yellow-400" /> Date
                      </p>
                      <p className="text-white font-semibold">
                        {new Date(selectedAppointment.date).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <FaClock className="w-3 h-3 text-yellow-400" /> Time
                      </p>
                      <p className="text-white font-semibold">{selectedAppointment.time}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <FaBriefcase className="w-3 h-3 text-yellow-400" /> Case Type
                      </p>
                      <p className="text-white font-semibold">{selectedAppointment.caseType}</p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                      <p className="text-gray-500 text-xs mb-1 flex items-center gap-1">
                        <FaMoneyBillWave className="w-3 h-3 text-yellow-400" /> Fee
                      </p>
                      <p className="text-white font-semibold">
                        PKR {selectedAppointment.fee || selectedAppointment.amount || 5000}
                      </p>
                    </div>
                    
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                      <p className="text-gray-500 text-xs mb-1">Status</p>
                      <StatusBadge status={selectedAppointment.status} isPaid={selectedAppointment.isPaid} />
                    </div>
                    
                    <div className="p-3 bg-gray-800/40 rounded-xl border border-gray-700">
                      <p className="text-gray-500 text-xs mb-1">Payment</p>
                      <PaymentBadge isPaid={selectedAppointment.isPaid} />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-4 bg-gray-800/40 rounded-xl border border-gray-700">
                    <p className="text-gray-500 text-xs mb-2 flex items-center gap-1">
                      <FaFileAlt className="w-3 h-3 text-yellow-400" /> Case Description
                    </p>
                    <p className="text-white leading-relaxed">
                      {selectedAppointment.description || selectedAppointment.notes || "No description provided."}
                    </p>
                  </div>
                </div>

                {/* ========== DIV 2: ACTION BUTTONS SECTION ========== */}
                <div className="border-t border-gray-700 pt-5">
                  <div className="flex flex-col gap-3">
                    {/* Pending Actions */}
                    {selectedAppointment.status === "pending" && (
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => updateStatusMutation.mutate({ 
                            id: selectedAppointment._id, 
                            status: "accepted" 
                          })}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle /> Accept Appointment
                        </button>
                        <button
                          onClick={() => updateStatusMutation.mutate({ 
                            id: selectedAppointment._id, 
                            status: "cancelled" 
                          })}
                          disabled={updateStatusMutation.isPending}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                        >
                          <FaTimesCircle /> Reject
                        </button>
                      </div>
                    )}

                    {/* Cash on Meeting - Mark Paid Button */}
                    {selectedAppointment.status === "accepted" && !selectedAppointment.isPaid && (
                      <button
                        onClick={() => handlePaymentClick(selectedAppointment)}
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg"
                      >
                        <FaMoneyBillWave className="text-xl" /> Cash on Meeting — Mark Paid
                      </button>
                    )}

                    {/* Start Session Button */}
                    {selectedAppointment.status === "accepted" && selectedAppointment.isPaid && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ 
                          id: selectedAppointment._id, 
                          status: "ongoing" 
                        })}
                        disabled={updateStatusMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg"
                      >
                        <FaVideo className="text-xl" /> Start Video Session
                      </button>
                    )}

                    {/* Mark Complete Button */}
                    {selectedAppointment.status === "ongoing" && (
                      <button
                        onClick={() => updateStatusMutation.mutate({ 
                          id: selectedAppointment._id, 
                          status: "completed" 
                        })}
                        disabled={updateStatusMutation.isPending}
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-semibold transition flex items-center justify-center gap-2 text-lg"
                      >
                        <FaCheckCircle className="text-xl" /> Mark Appointment Complete
                      </button>
                    )}

                    {/* Loading Indicator */}
                    {(updateStatusMutation.isPending || markPaymentPaidMutation.isPending) && (
                      <div className="flex justify-center py-3">
                        <FaSpinner className="animate-spin text-yellow-400 text-2xl" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRM PAYMENT MODAL */}
      <AnimatePresence>
        {showConfirmModal && paymentAppointment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center p-4"
            onClick={cancelConfirm}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-orange-500/50 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaQuestionCircle className="text-orange-400 text-5xl" />
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Confirm Payment</h2>
                <p className="text-gray-400 mb-4">
                  Are you sure you want to mark this appointment as{" "}
                  <span className="text-orange-400 font-semibold">PAID</span>?
                </p>

                <div className="bg-gray-800/60 rounded-xl p-4 mb-6 text-left space-y-1">
                  <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Appointment Details</p>
                  <p className="text-white font-semibold">
                    {paymentAppointment.userId?.name || paymentAppointment.userId?.fullName || "Client"}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(paymentAppointment.date).toLocaleDateString()} at {paymentAppointment.time}
                  </p>
                  <p className="text-gray-400 text-sm">{paymentAppointment.caseType}</p>
                  <p className="text-orange-400 font-bold text-lg mt-1">
                    Amount: PKR {paymentAppointment.fee || paymentAppointment.amount || 5000}
                  </p>
                </div>

                <p className="text-yellow-400 text-sm mb-6">⚠️ This action cannot be undone!</p>

                <div className="flex gap-3">
                  <button
                    onClick={cancelConfirm}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2.5 rounded-xl font-semibold transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmPayment}
                    disabled={markPaymentPaidMutation.isPending}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-2"
                  >
                    {markPaymentPaidMutation.isPending
                      ? <FaSpinner className="animate-spin" />
                      : <><FaCheckCircle /> Yes, Mark Paid</>
                    }
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawyerAppointments;