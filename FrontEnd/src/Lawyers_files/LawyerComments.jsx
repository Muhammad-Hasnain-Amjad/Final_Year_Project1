import React from "react";
import { FaStar, FaCommentDots } from "react-icons/fa";

export default function LawyerComments({ comments }) {

  if (!comments || comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center mt-10 text-center">

        <FaCommentDots className="text-6xl text-yellow-400 animate-bounce mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />

        <p className="text-2xl font-semibold text-yellow-400 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.9)]">
          No Comments Yet
        </p>

        <p className="text-gray-400 mt-2">
          
        </p>

      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {comments.map((c, i) => (
        <div
          key={c._id || i}
          className="bg-gray-900 border border-yellow-500 p-4 rounded-lg"
        >
          <p>{c.comment}</p>

          <div className="flex items-center gap-2 mt-2 text-yellow-400">
            <FaStar /> {c.rating}/5
          </div>
        </div>
      ))}
    </div>
  );
}