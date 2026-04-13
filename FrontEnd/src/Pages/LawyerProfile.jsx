import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaStar, FaMapMarkerAlt, FaBriefcase, FaArrowLeft, 
  FaCheckCircle, FaPhone, FaEnvelope, FaAward, FaGavel,
  FaCalendarAlt, FaClock, FaComment, FaQuoteLeft,
  FaUserCircle, FaRegClock, FaShieldAlt, FaCertificate,
  FaLocationArrow, FaEdit, FaTrash
} from "react-icons/fa";
import { FiMessageSquare } from "react-icons/fi";
import Swal from 'sweetalert2';
import AppointmentBooking from "../Components/AppointmentBooking";
import { toast } from "react-toastify";

const LawyerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [newComment, setNewComment] = useState({ rating: 5, comment: "" });
  
  // Edit/Delete states
  const [editingComment, setEditingComment] = useState(null);
  const [editData, setEditData] = useState({ rating: 5, comment: "" });
  
  // Get current user ID from token
  const [currentUserId, setCurrentUserId] = useState(null);

  // Extract userId from token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setCurrentUserId(payload.id || payload.userId);
      } catch (error) {
        console.error("Error parsing token:", error);
      }
    }
  }, []);

  // Fetch lawyer details
  const { data: lawyer, isLoading, refetch } = useQuery({
    queryKey: ["lawyer", id],
    queryFn: async () => {
      const res = await axios.get(`http://localhost:5000/lawyer/idlawyer/${id}`);
      return res.data.data;
    }
  });

  // Fetch comments
  const { data: comments, isLoading: commentsLoading, refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      try {
        const res = await axios.get(`http://localhost:5000/comments/lawyer/${id}`);
        return res.data.data || [];
      } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
      }
    }
  });

  // Submit comment
  const submitComment = async () => {
    if (!newComment.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to submit a review");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/comments",
        {
          lawyerId: id,
          rating: newComment.rating,
          comment: newComment.comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Review submitted successfully!");
        setShowCommentModal(false);
        setNewComment({ rating: 5, comment: "" });
        refetchComments();
        refetch();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    }
  };

  // Edit comment
  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setEditData({ rating: comment.rating, comment: comment.comment });
  };

  // Update comment
  const handleUpdateComment = async () => {
    if (!editData.comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to edit review");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/comments/${editingComment._id}`,
        {
          rating: editData.rating,
          comment: editData.comment
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        toast.success("Review updated successfully!");
        setEditingComment(null);
        refetchComments();
        refetch();
      }
    } catch (error) {
      console.error("Update error:", error.response?.data);
      toast.error(error.response?.data?.message || "Failed to update review");
    }
  };

  // Delete comment with SweetAlert2 confirmation
  const handleDeleteComment = async (commentId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1a1a1a',
      color: '#fff',
      iconColor: '#fbbf24'
    });

    if (result.isConfirmed) {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please login to delete review");
        return;
      }

      try {
        const response = await axios.delete(
          `http://localhost:5000/comments/${commentId}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        if (response.data.success) {
          await Swal.fire({
            title: 'Deleted!',
            text: 'Your review has been deleted.',
            icon: 'success',
            confirmButtonColor: '#fbbf24',
            background: '#1a1a1a',
            color: '#fff'
          });
          refetchComments();
          refetch();
        }
      } catch (error) {
        console.error("Delete error:", error.response?.data);
        toast.error(error.response?.data?.message || "Failed to delete review");
      }
    }
  };

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

  if (!lawyer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="text-6xl mb-4">⚖️</div>
          <p className="text-gray-400 text-lg">Lawyer not found</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 text-yellow-400 hover:text-yellow-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { registration, profile, status } = lawyer;
  
  const avgRating = comments?.length > 0 
    ? (comments.reduce((a, b) => a + b.rating, 0) / comments.length).toFixed(1)
    : null;
  
  const totalReviews = comments?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-yellow-400 hover:text-yellow-300 mb-6 transition-colors group"
        >
          <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to Lawyers
        </motion.button>

        {/* Main Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Column 1 - Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-black rounded-2xl border border-gray-800 p-6 sticky top-6 shadow-xl">
              {/* Profile Image */}
              <div className="relative flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-xl opacity-30"></div>
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
              
              {/* Name & Badges */}
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
                
                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mt-2">
                  <div className="flex items-center gap-1">
                    <FaStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-white font-semibold">{avgRating || "New"}</span>
                  </div>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-400 text-sm">{totalReviews} reviews</span>
                </div>

                {/* About Text */}
                <p className="text-gray-400 text-sm mt-3 max-w-full break-words line-clamp-3">
                  {profile?.about || "Experienced lawyer dedicated to justice"}
                </p>
              </div>

              {/* Contact Info */}
              <div className="mt-6 space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Contact Information</h3>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaEnvelope className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{registration?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-300">
                  <FaPhone className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm">{registration?.phoneNumber}</span>
                </div>
                
                {/* Location with Clickable Icon */}
                <div className="flex items-center justify-between gap-3 text-gray-300">
                  <div className="flex items-center gap-3 flex-1">
                    <FaMapMarkerAlt className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-sm truncate">{registration?.officeAddress}</span>
                  </div>
                  <button
                    onClick={() => setShowLocationModal(true)}
                    className="flex items-center gap-1 px-2 py-1 bg-yellow-400/10 hover:bg-yellow-400/20 rounded-lg transition-all text-yellow-400 text-xs"
                  >
                    <FaLocationArrow className="w-3 h-3" />
                    View Map
                  </button>
                </div>
              </div>

              {/* Practice Areas */}
              <div className="mt-6">
                <h3 className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-3">Practice Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {registration?.practiceAreas?.map((area, idx) => (
                    <span key={idx} className="text-xs bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-full">
                      {area}
                    </span>
                  ))}
                </div>
              </div>

              {/* Fee - Changed to PKR */}
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-xl border-l-4 border-yellow-400">
                <p className="text-gray-400 text-xs">Consultation Fee</p>
                <p className="text-white text-2xl font-bold">₨ {profile?.fee || "Negotiable"}<span className="text-sm text-gray-400">/session</span></p>
              </div>
            </div>
          </motion.div>

          {/* Column 2 & 3 - Details and Comments */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Professional Details Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 shadow-md"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaAward className="text-yellow-500" /> Professional Dossier
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-gray-100 rounded-xl border border-gray-200">
                  <p className="text-gray-500 text-xs">Experience</p>
                  <p className="text-black font-semibold">{registration?.experience}+ Years</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl border border-gray-200">
                  <p className="text-gray-500 text-xs">Court Level</p>
                  <p className="text-black font-semibold">{registration?.courtLevel}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl border border-gray-200">
                  <p className="text-gray-500 text-xs">Bar Council Number</p>
                  <p className="text-black font-semibold">{registration?.barCouncilNumber}</p>
                </div>
                <div className="p-3 bg-gray-100 rounded-xl border border-gray-200">
                  <p className="text-gray-500 text-xs">Membership Type</p>
                  <p className="text-black font-semibold">{registration?.membershipType}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all flex items-center justify-center gap-2 shadow-md"
                >
                  <FaCalendarAlt /> Book Appointment
                </button>
                <button
                  onClick={() => setShowCommentModal(true)}
                  className="flex-1 border border-black text-black py-3 rounded-xl font-semibold hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <FaComment /> Write Review
                </button>
              </div>
            </motion.div>

            {/* Comments Section with Edit/Delete Icons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
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
                  className="text-sm text-yellow-400 hover:text-yellow-300 transition flex items-center gap-1"
                >
                  <FiMessageSquare /> Write a review
                </button>
              </div>

              {commentsLoading ? (
                <div className="flex justify-center py-12">
                  <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : comments?.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1
                    }}
                    className="inline-block"
                  >
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 rounded-full flex items-center justify-center">
                      <FaComment className="w-10 h-10 text-yellow-400/50" />
                    </div>
                  </motion.div>
                  <p className="text-gray-400">No reviews yet</p>
                  <p className="text-gray-500 text-sm mt-1">Be the first to share your experience!</p>
                </motion.div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {comments?.map((comment, idx) => {
                    // Check if current user owns this comment
                    const commentUserId = comment.userId?._id || comment.userId;
                    const isOwner = currentUserId && commentUserId?.toString() === currentUserId?.toString();
                    
                    return (
                      <motion.div
                        key={comment._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-black/30 rounded-xl p-4 border border-white/10 hover:border-yellow-400/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            {comment.userId?.profilePic?.url ? (
                              <img 
                                src={comment.userId.profilePic.url}
                                alt={comment.userId?.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                                <FaUserCircle className="w-8 h-8 text-gray-500" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <p className="font-semibold text-white">{comment.userId?.name || "Anonymous"}</p>
                                <div className="flex items-center gap-1 mt-1">
                                  {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className={`w-3 h-3 ${i < comment.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <FaRegClock className="w-3 h-3" />
                                  {new Date(comment.createdAt).toLocaleDateString()}
                                </div>
                                
                                {/* Edit/Delete buttons with icons - only visible to comment owner */}
                                {isOwner && (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="p-1.5 text-blue-400 hover:text-blue-300 transition rounded-lg hover:bg-blue-400/10"
                                      title="Edit review"
                                    >
                                      <FaEdit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteComment(comment._id)}
                                      className="p-1.5 text-red-400 hover:text-red-300 transition rounded-lg hover:bg-red-400/10"
                                      title="Delete review"
                                    >
                                      <FaTrash className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 relative">
                              <FaQuoteLeft className="w-3 h-3 text-yellow-400/30 absolute -left-1 -top-1" />
                              <p className="text-gray-400 text-sm pl-4">{comment.comment}</p>
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

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setShowBookingModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaCalendarAlt /> Book Appointment with {registration?.fullName}
                </h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-gray-400 hover:text-white transition text-2xl"
                >
                  ×
                </button>
              </div>
              
              <AppointmentBooking
                lawyerId={id}
                lawyerName={registration?.fullName}
                practiceAreas={registration?.practiceAreas || []} 
                onClose={() => setShowBookingModal(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaLocationArrow /> Office Location
                </h2>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">
                  <FaMapMarkerAlt className="inline mr-1 text-yellow-400" /> 
                  {registration?.officeAddress}
                </p>
              </div>
              
              <div className="relative w-full h-96 rounded-xl overflow-hidden border border-gray-700">
                <iframe
                  title="Office Location"
                  src={`https://www.google.com/maps?q=${encodeURIComponent(registration?.officeAddress)}&output=embed`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
              
              <div className="flex gap-3 mt-4">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(registration?.officeAddress)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-yellow-500 text-black py-2 rounded-xl font-semibold hover:bg-yellow-600 transition text-center"
                >
                  Get Directions
                </a>
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 border border-gray-700 text-gray-400 py-2 rounded-xl hover:bg-gray-800 transition"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comment Modal */}
      <AnimatePresence>
        {showCommentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCommentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaStar /> Write a Review
                </h2>
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewComment({ ...newComment, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar className={`w-8 h-8 ${star <= newComment.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Your Review</label>
                <textarea
                  rows={4}
                  value={newComment.comment}
                  onChange={(e) => setNewComment({ ...newComment, comment: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-500 outline-none text-white resize-none"
                  placeholder="Share your experience with this lawyer..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCommentModal(false)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitComment}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl font-semibold hover:scale-105 transition-all"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Comment Modal */}
      <AnimatePresence>
        {editingComment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setEditingComment(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-700 p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                  <FaStar /> Edit Your Review
                </h2>
                <button
                  onClick={() => setEditingComment(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Your Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditData({ ...editData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <FaStar className={`w-8 h-8 ${star <= editData.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-400 text-sm mb-2">Your Review</label>
                <textarea
                  rows={4}
                  value={editData.comment}
                  onChange={(e) => setEditData({ ...editData, comment: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:border-yellow-500 outline-none text-white resize-none"
                  placeholder="Share your experience with this lawyer..."
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setEditingComment(null)}
                  className="flex-1 px-4 py-2 rounded-xl border border-gray-700 text-gray-400 hover:bg-gray-800 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateComment}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black py-2 rounded-xl font-semibold hover:scale-105 transition-all"
                >
                  Update Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LawyerProfile;