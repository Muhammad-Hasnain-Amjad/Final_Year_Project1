import React, { useState } from "react";
import { LoaderCircle, AlertTriangle, CheckCircle, XCircle, Clock, Image as ImageIcon, ChevronLeft, ChevronRight, ZoomIn, Download } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

function Temp_lawyer() {
  const { id } = useParams();
  const BaseURL = "http://localhost:5000/lawyer";
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Fetch lawyer by ID
  const { data: lawyer, isLoading, error } = useQuery({
    queryKey: ["lawyer", id],
    queryFn: async () => {
      const res = await axios.get(`${BaseURL}/idlawyer/${id}`);
      return res.data?.data;
    },
  });

  // Mutation to update status
  const updateStatus = useMutation({
    mutationFn: async (newStatus) =>
      axios.patch(`${BaseURL}/idlawyer/${id}/status`, {
        status: newStatus,
      }),
    onSuccess: (data, newStatus) => {
      queryClient.invalidateQueries({ queryKey: ["lawyer", id] });
      toast.success(`${newStatus} Successfully!`);
    },
  });

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="mb-4"
        >
          <LoaderCircle className="w-16 h-16 text-yellow-400" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-yellow-400 text-lg font-medium"
        >
          Loading lawyer data...
        </motion.p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"
      >
        <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
        <p className="text-red-500 text-lg font-medium">Failed to load lawyer! Please try again.</p>
      </motion.div>
    );
  }

  if (!lawyer) {
    return (
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900"
      >
        <AlertTriangle className="w-16 h-16 text-gray-500 mb-4" />
        <p className="text-gray-400 text-lg font-medium">No lawyer data found.</p>
      </motion.div>
    );
  }

  // Images array safely using optional chaining
  const images = [
    { label: "Profile Picture", src: lawyer?.registration?.profilePic?.url || "", icon: "👤" },
    { label: "Bar Council Card", src: lawyer?.registration?.barCouncilCard?.url || "", icon: "📜" },
    { label: "CNIC Front", src: lawyer?.registration?.cnicFront?.url || "", icon: "🪪" },
    { label: "CNIC Back", src: lawyer?.registration?.cnicBack?.url || "", icon: "🪪" },
    { label: "LLB Degree", src: lawyer?.registration?.llb?.url || "", icon: "🎓" },
  ].filter(img => img.src);

  const getStatusConfig = () => {
    const status = lawyer?.status?.isVerified;
    switch(status) {
      case "verified":
        return { color: "green", icon: CheckCircle, label: "Verified", bg: "bg-green-500/20", border: "border-green-500" };
      case "rejected":
        return { color: "red", icon: XCircle, label: "Rejected", bg: "bg-red-500/20", border: "border-red-500" };
      default:
        return { color: "yellow", icon: Clock, label: "Pending", bg: "bg-yellow-500/20", border: "border-yellow-500" };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setSelectedImage(images[(currentImageIndex + 1) % images.length]);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setSelectedImage(images[(currentImageIndex - 1 + images.length) % images.length]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                {lawyer?.registration?.fullName || "N/A"}
              </h1>
              <p className="text-gray-400 mt-2">Bar Council #{lawyer?.registration?.barCouncilNumber || "N/A"}</p>
            </div>
            
            {/* Status Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg} border ${statusConfig.border}`}
            >
              <StatusIcon className={`w-5 h-5 text-${statusConfig.color}-400`} />
              <span className={`font-semibold text-${statusConfig.color}-400`}>{statusConfig.label}</span>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* LEFT COLUMN: Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:flex-1"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                Documents & Gallery
              </h2>
              
              {images.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No documents available</p>
                </div>
              ) : (
                <>
                  {/* Main Image Display */}
                  <motion.div
                    layoutId="main-image"
                    className="relative mb-4 rounded-xl overflow-hidden bg-gray-800 cursor-pointer group"
                    onClick={() => setSelectedImage(images[currentImageIndex])}
                  >
                    <img
                      src={images[currentImageIndex].src}
                      alt={images[currentImageIndex].label}
                      className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ZoomIn className="w-8 h-8 text-white" />
                    </div>
                    <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-full text-sm text-yellow-400">
                      {images[currentImageIndex].icon} {images[currentImageIndex].label}
                    </div>
                  </motion.div>

                  {/* Thumbnail Navigation */}
                  <div className="relative">
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-gray-800">
                      {images.map((img, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setCurrentImageIndex(idx)}
                          className={`relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                            currentImageIndex === idx
                              ? "border-yellow-400 shadow-lg shadow-yellow-500/20"
                              : "border-gray-700 hover:border-gray-500"
                          }`}
                        >
                          <img
                            src={img.src}
                            alt={img.label}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <span className="text-xs text-white">{img.icon}</span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>

          {/* RIGHT COLUMN: Info & Actions */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:flex-1"
          >
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-6">
              <h2 className="text-2xl font-bold text-yellow-400 mb-4">Professional Information</h2>
              
              <div className="space-y-3">
                <InfoRow label="Email" value={lawyer?.registration?.email} />
                <InfoRow label="Phone" value={lawyer?.registration?.phoneNumber} />
                <InfoRow label="CNIC" value={lawyer?.registration?.cnic} />
                <InfoRow label="Bar Council Number" value={lawyer?.registration?.barCouncilNumber} />
                <InfoRow label="Membership Type" value={lawyer?.registration?.membershipType} />
                <InfoRow label="Year of Enrollment" value={lawyer?.registration?.yearOfEnrollment} />
                <InfoRow label="Experience" value={`${lawyer?.registration?.experience || 0} years`} />
                <InfoRow label="Court Level" value={lawyer?.registration?.courtLevel} />
                <InfoRow label="Office Address" value={lawyer?.registration?.officeAddress} />
                <InfoRow label="Practice Areas" value={lawyer?.registration?.practiceAreas?.join(", ")} isMultiline />
                <InfoRow label="About" value={lawyer?.profile?.about} isMultiline />
              </div>
            </div>

            {/* Action Buttons */}
            {lawyer?.status?.isVerified === "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 mt-6"
              >
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateStatus.mutate("verified")}
                  disabled={updateStatus.isLoading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {updateStatus.isLoading ? "Processing..." : "Accept Lawyer"}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => updateStatus.mutate("rejected")}
                  disabled={updateStatus.isLoading}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <XCircle className="w-5 h-5" />
                  {updateStatus.isLoading ? "Processing..." : "Reject Lawyer"}
                </motion.button>
              </motion.div>
            )}

            {/* Status Display for already verified/rejected */}
            {lawyer?.status?.isVerified !== "pending" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl text-center ${statusConfig.bg} border ${statusConfig.border}`}
              >
                <div className="flex items-center justify-center gap-2">
                  <StatusIcon className={`w-5 h-5 text-${statusConfig.color}-400`} />
                  <span className={`font-semibold text-${statusConfig.color}-400`}>
                    This lawyer has been {statusConfig.label.toLowerCase()}
                  </span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Lightbox Modal for Image Preview */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-5xl w-full"
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.label}
                className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      prevImage();
                    }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      nextImage();
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </>
              )}
              
              {/* Image Label */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 rounded-full text-yellow-400">
                {selectedImage.icon} {selectedImage.label}
              </div>

              {/* Download Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(selectedImage.src, '_blank');
                }}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
              >
                <Download className="w-5 h-5 text-white" />
              </button>

              {/* Close Button */}
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 left-4 bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
              >
                <XCircle className="w-5 h-5 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper component for info rows
const InfoRow = ({ label, value, isMultiline }) => {
  if (!value) return null;
  
  return (
    <div className={`border-b border-gray-800 pb-2 ${isMultiline ? '' : 'flex justify-between items-start'}`}>
      <span className="text-gray-400 text-sm font-medium block mb-1">{label}:</span>
      <span className={`text-white ${isMultiline ? 'block mt-1' : ''}`}>
        {value}
      </span>
    </div>
  );
};

export default Temp_lawyer;