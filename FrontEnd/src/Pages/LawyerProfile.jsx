// src/Pages/LawyerProfile.jsx
// ✅ USER-FACING lawyer profile — user can message, book appointment, write review
// StartChatButton calls POST /chats/create then navigates to /chats/:chatId

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaStar, FaMapMarkerAlt, FaArrowLeft,
  FaCheckCircle, FaPhone, FaEnvelope, FaAward, FaGavel,
  FaCalendarAlt, FaComment, FaQuoteLeft,
  FaUserCircle, FaRegClock, FaShieldAlt, FaCertificate,
  FaLocationArrow, FaEdit, FaTrash,
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Swal from "sweetalert2";
import AppointmentBooking from "../Components/AppointmentBooking";
import StartChatButton from "../Components/Chat/StartChatButton";  // ✅ Message button
import { toast } from "react-toastify";

// ─────────────────────────────────────────────────────────────────────────────
const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showBookingModal,  setShowBookingModal]  = useState(false);
  const [showCommentModal,  setShowCommentModal]  = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newComment,        setNewComment]        = useState({ rating: 5, comment: "" });
  const [editingComment,    setEditingComment]    = useState(null);
  const [editData,          setEditData]          = useState({ rating: 5, comment: "" });
  const [currentUserId,     setCurrentUserId]     = useState(null);

  // Extract userId from JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setCurrentUserId(payload.id || payload.userId);
      } catch { /* ignore */ }
    }
  }, []);

  // ── Fetch lawyer ─────────────────────────────────────────
  const { data: lawyer, isLoading, refetch } = useQuery({
    queryKey: ["lawyer", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/lawyer/idlawyer/${id}`);
      return res.data.data;
    },
  });

  // ── Fetch comments ───────────────────────────────────────
  const { data: comments = [], isLoading: commentsLoading, refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:5000/comments/lawyer/${id}`);
        return res.data.data || [];
      } catch { return []; }
    },
  });

  // ── Submit comment ───────────────────────────────────────
  const submitComment = async () => {
    if (!newComment.comment.trim()) { toast.error("Please write a comment"); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login to submit a review"); return; }
    try {
      const res = await axios.post(
        "http://localhost:5000/comments",
        { lawyerId: id, rating: newComment.rating, comment: newComment.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Review submitted!");
        setShowCommentModal(false);
        setNewComment({ rating: 5, comment: "" });
        refetchComments(); refetch();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to submit review"); }
  };

  // ── Edit comment ─────────────────────────────────────────
  const handleEditComment = (c) => {
    setEditingComment(c);
    setEditData({ rating: c.rating, comment: c.comment });
  };

  const handleUpdateComment = async () => {
    if (!editData.comment.trim()) { toast.error("Please write a comment"); return; }
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login"); return; }
    try {
      const res = await axios.put(
        `http://localhost:5000/comments/${editingComment._id}`,
        { rating: editData.rating, comment: editData.comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success("Review updated!");
        setEditingComment(null);
        refetchComments(); refetch();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to update"); }
  };

  // ── Delete comment ───────────────────────────────────────
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: "Are you sure?", text: "You won't be able to revert this!",
      icon: "warning", showCancelButton: true,
      confirmButtonColor: "#d33", cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!", background: "#1a1a1a", color: "#fff", iconColor: "#fbbf24",
    });
    if (!result.isConfirmed) return;
    const token = localStorage.getItem("token");
    if (!token) { toast.error("Please login"); return; }
    try {
      const res = await axios.delete(`http://localhost:5000/comments/${commentId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        await Swal.fire({ title: "Deleted!", text: "Your review has been deleted.", icon: "success", confirmButtonColor: "#fbbf24", background: "#1a1a1a", color: "#fff" });
        refetchComments(); refetch();
      }
    } catch (err) { toast.error(err.response?.data?.message || "Failed to delete"); }
  };

  // ── Loading / not found ──────────────────────────────────
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

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <p className="text-gray-400 text-lg">Lawyer not found</p>
          <button onClick={() => navigate(-1)} className="mt-4 text-yellow-400 hover:text-yellow-300">Go Back</button>
        </div>
      </div>
    );
  }

  const { registration, profile, status } = lawyer;
  const avgRating    = comments.length > 0 ? (comments.reduce((a, b) => a + b.rating, 0) / comments.length).toFixed(1) : null;
  const totalReviews = comments.length;

  // ─────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">

        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Lawyers
        </motion.button>

        {/* ── PROFILE GRID ──────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Column 1 — sticky profile card ─────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-black rounded-2xl border border-gray-800 p-6 sticky top-6 shadow-xl">

              {/* Avatar */}
              <div className="relative flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-xl opacity-30" />
                  <img
                    src={registration?.profilePic?.url || "https://via.placeholder.com/150"}
                    alt={registration?.fullName}
                    className="relative w-32 h-32 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
                  />
                  {status?.isVerified === "verified" && (
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5 border-2 border-black">
                      <FaCheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Name & rating */}
              <div className="text-center mt-4">
                <div className="flex items-center justify-center gap-2 flex-wrap mb-2">
                  {status?.isVerified === "verified" && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                      <FaShieldAlt className="w-3 h-3" /> Verified
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded-full">
                    <FaCertificate className="w-3 h-3" /> Licensed
                  </span>
                </div>

                <h1 className="text-2xl font-bold text-white">{registration?.fullName}</h1>

                <div className="flex items-center justify-center gap-2 mt-2">
                  <FaStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-white font-semibold">{avgRating || "New"}</span>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{totalReviews} reviews</span>
                </div>

                <p className="text-gray-400 text-sm mt-3 line-clamp-3">
                  {profile?.about || "Experienced lawyer dedicated to justice"}
                </p>
              </div>

              {/* ✅ MESSAGE LAWYER BUTTON ─────────────────────────────── */}
              {/* Calls POST /chats/create → navigates user to /chats/:chatId */}
              <div className="mt-5">
                <StartChatButton
                  lawyerId={lawyer._id}
                  lawyerName={registration?.fullName}
                  profilePic={registration?.profilePic?.url || ""}
                  className="w-full justify-center text-sm py-3"
                />
              </div>

              {/* Contact info */}
              <div className="mt-5 space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Contact</h3>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{registration?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{registration?.phoneNumber}</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-gray-300">
                  <div className="flex items-center gap-3 flex-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm truncate">{registration?.officeAddress}</span>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg text-yellow-400 text-xs transition"
                  >
                    <FaLocationArrow className="w-3 h-3" /> View Map
                  </button>
                </div>
              </div>

              {/* Practice Areas */}
              <div className="mt-5">
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Practice Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {registration?.practiceAreas?.map((area, idx) => (
                    <span key={idx} className="text-xs bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fee */}
              <div className="mt-5 p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl border-l-4 border-yellow-400">
                <p className="text-gray-400 text-xs">Consultation Fee</p>
                <p className="text-white text-2xl font-bold">
                  ₨ {profile?.fee || "Negotiable"}
                  <span className="text-sm text-gray-400">/session</span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── Column 2+3 — details + reviews ──────────── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Professional Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaAward className="text-yellow-500" /> Professional Dossier
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  ["Experience",        `${registration?.experience}+ Years`],
                  ["Court Level",       registration?.courtLevel],
                  ["Bar Council No.",   registration?.barCouncilNumber],
                  ["Membership Type",   registration?.membershipType],
                ].map(([label, value]) => (
                  <div key={label} className="p-3 bg-gray-100 rounded-xl border border-gray-200">
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="text-black font-semibold">{value}</p>
                  </div>
                ))}
              </div>

              {/* Action row — Book + Review + Message */}
              <div className="flex flex-wrap gap-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition flex items-center justify-center gap-2 shadow-md"
                >
                  <FaCalendarAlt /> Book Appointment
                </button>

                <button
                  onClick={() => setShowCommentModal(true)}
                  className="flex-1 border border-black text-black py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition flex items-center justify-center gap-2"
                >
                  <FaComment /> Write Review
                </button>

                {/* ✅ SECOND Message button — inline with the action row */}
                <StartChatButton
                  lawyerId={lawyer._id}
                  lawyerName={registration?.fullName}
                  profilePic={registration?.profilePic?.url || ""}
                  className="flex-1 justify-center py-3 text-sm"
                />
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                  <FaComment /> Client Reviews
                  {totalReviews > 0 && (
                    <span className="text-sm bg-yellow-400/20 text-yellow-400 px-2 py-0.5 rounded-full">
                      {totalReviews}
                    </span>
                  )}
                </h2>
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition"
                >
                  <FiMessageSquare /> Write a review
                </button>
              </div>

              {commentsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : comments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-yellow-400/10 rounded-full flex items-center justify-center">
                    <FaComment className="w-10 h-10 text-yellow-400/40" />
                  </div>
                  <p className="text-gray-400">No reviews yet</p>
                  <p className="text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {comments.map((c, idx) => {
                    const commentOwnerId = c.userId?._id || c.userId;
                    const isOwner = currentUserId && commentOwnerId?.toString() === currentUserId?.toString();

                    return (
                      <motion.div
                        key={c._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {c.userId?.profilePic?.url ? (
                              <img src={c.userId.profilePic.url} alt={c.userId?.name} className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <FaUserCircle className="w-8 h-8 text-gray-500" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-semibold text-white">{c.userId?.name || "Anonymous"}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`w-3 h-3 ${i < c.rating ? "text-yellow-400" : "text-gray-600"}`} />
                                  ))}
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <FaRegClock className="w-3 h-3" />
                                  {new Date(c.createdAt).toLocaleDateString()}
                                </span>

                                {isOwner && (
                                  <div className="flex gap-2">
                                    <button onClick={() => handleEditComment(c)} className="p-1.5 text-blue-400 hover:text-blue-300 rounded-lg hover:bg-blue-400/10 transition" title="Edit">
                                      <FaEdit className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleDeleteComment(c._id)} className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-red-400/10 transition" title="Delete">
                                      <FaTrash className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="mt-2 relative">
                              <FaQuoteLeft className="w-3 h-3 text-yellow-400/30 absolute -left-1 -top-1" />
                              <p className="text-gray-400 text-sm pl-4">{c.comment}</p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────── */}

      {/* Booking */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaCalendarAlt /> Book Appointment
                </h2>
                <button onClick={() => setShowBookingModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <AppointmentBooking lawyerId={id} lawyerName={registration?.fullName} practiceAreas={registration?.practiceAreas || []} onClose={() => setShowBookingModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaLocationArrow /> Office Location
                </h2>
                <button onClick={() => setShowLocationModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                <FaMapMarkerAlt className="inline mr-1 text-yellow-400" />{registration?.officeAddress}
              </p>
              <div className="relative w-full h-96 rounded-xl overflow-hidden border border-gray-700">
                <iframe
                  title="Office Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(registration?.officeAddress)}&output=embed`}
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(registration?.officeAddress)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-yellow-500 text-black py-2 rounded-xl font-semibold hover:bg-yellow-600 transition text-center"
                >
                  Get Directions
                </a>
                <button onClick={() => setShowLocationModal(false)} className="flex-1 border border-gray-700 text-gray-400 py-2 rounded-xl hover:bg-gray-800 transition">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Write review */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaStar /> Write a Review
                </h2>
                <button onClick={() => setShowCommentModal(false)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setNewComment({ ...newComment, rating: s })} className="focus:outline-none hover:scale-110 transition-transform">
                      <FaStar className={`w-8 h-8 ${s <= newComment.rating ? "text-yellow-400" : "text-gray-600"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Your Review</label>
                <textarea rows={4} value={newComment.comment} onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-500 outline-none text-white resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowCommentModal(false)} className="flex-1 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition">Cancel</button>
                <button onClick={submitComment} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl font-semibold hover:scale-105 transition-all">Submit</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit review */}
      <AnimatePresence>
        {editingComment && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingComment(null)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaStar /> Edit Your Review
                </h2>
                <button onClick={() => setEditingComment(null)} className="text-gray-400 hover:text-white text-2xl">×</button>
              </div>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button key={s} onClick={() => setEditData({ ...editData, rating: s })} className="focus:outline-none hover:scale-110 transition-transform">
                      <FaStar className={`w-8 h-8 ${s <= editData.rating ? "text-yellow-400" : "text-gray-600"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Your Review</label>
                <textarea rows={4} value={editData.comment} onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-500 outline-none text-white resize-none"
                  placeholder="Share your experience..."
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setEditingComment(null)} className="flex-1 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition">Cancel</button>
                <button onClick={handleUpdateComment} className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl font-semibold hover:scale-105 transition-all">Update</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawyerProfile;
