import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaStar, FaCommentDots, FaUserCircle, FaRegClock } from "react-icons/fa";
import { motion } from "framer-motion";

export default function LawyerComments({ lawyerId }) {
  // Fetch comments from API
  const { data: comments, isLoading, error } = useQuery({
    queryKey: ["comments", lawyerId],
    queryFn: async () => {
      const response = await axios.get(`http://localhost:5000/comments/lawyer/${lawyerId}`);
      return response.data.data || [];
    },
    enabled: !!lawyerId,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center">
        <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400">Loading comments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center">
        <FaCommentDots className="text-6xl text-red-400 mb-4" />
        <p className="text-xl font-semibold text-red-400">Error Loading Comments</p>
        <p className="text-gray-400 mt-2">Please try again later</p>
      </div>
    );
  }

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center">
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
        >
          <FaCommentDots className="text-6xl text-yellow-400 mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />
        </motion.div>

        <p className="text-2xl font-semibold text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">
          No Comments Yet
        </p>

        <p className="text-gray-400 mt-2">
          Be the first to share your experience!
        </p>
      </div>
    );
  }

  // Calculate average rating
  const avgRating = comments.reduce((sum, c) => sum + c.rating, 0) / comments.length;
  const totalReviews = comments.length;

  return (
    <div className="mt-4">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-700">
        <div className="text-center">
          <div className="text-3xl font-bold text-yellow-400">{avgRating.toFixed(1)}</div>
          <div className="flex items-center gap-1 mt-1">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-yellow-400' : 'text-gray-600'}`} />
            ))}
          </div>
          <div className="text-xs text-gray-500 mt-1">{totalReviews} reviews</div>
        </div>
        <div className="flex-1">
          <div className="text-sm text-gray-400">Based on {totalReviews} client reviews</div>
          <div className="text-xs text-gray-500 mt-1">Verified clients only</div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {comments.map((c, i) => (
          <motion.div
            key={c._id || i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-800/50 border border-gray-700 hover:border-yellow-400/30 rounded-xl p-4 transition-all"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                {c.userId?.profilePic?.url ? (
                  <img 
                    src={c.userId.profilePic.url} 
                    alt={c.userId?.name} 
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="w-8 h-8 text-gray-500" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">{c.userId?.name || "Anonymous"}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <FaRegClock className="w-3 h-3" />
                  {new Date(c.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={`w-4 h-4 ${i < c.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
              ))}
              <span className="text-xs text-gray-500 ml-2">({c.rating}/5)</span>
            </div>

            {/* Comment Text */}
            <p className="text-gray-300 text-sm leading-relaxed">{c.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}