import React from "react";
import { FaStar } from "react-icons/fa";

export default function LawyerComments({ comments }) {

  if (!comments || comments.length === 0)
    return <p className="text-gray-400 mt-4">No comments yet.</p>;

  return (
    <div className="mt-4 space-y-4">

      {comments.map((c, i) => (
        <div
          key={i}
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