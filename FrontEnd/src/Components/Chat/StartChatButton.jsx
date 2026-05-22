// src/Components/Chat/StartChatButton.jsx
// ✅ USER clicks this → POST /chats/create → navigates to /chats/:chatId
//
// Props:
//   lawyerId   - required  - lawyer's _id
//   lawyerName - optional  - shown in loading state
//   profilePic - optional  - passed via location.state to ChatWindow
//   className  - optional  - extra Tailwind classes on the full button
//   variant    - optional  - "icon" renders a circular icon button (like the other IconButtons)

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiMessageCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../config/api";

const StartChatButton = ({
  lawyerId,
  lawyerName = "Lawyer",
  profilePic = "",
  className = "",
  variant,          // "icon" → small circular button
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please log in first");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${api}/chats/create`,
        { otherUserId: lawyerId, otherUserType: "Lawyer" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const { chat, otherParticipant } = res.data.data;

      navigate(`/chats/${chat._id}`, {
        state: {
          otherParticipant: {
            _id:        otherParticipant._id              || lawyerId,
            name:       otherParticipant.registration?.fullName
                        || otherParticipant.name          || lawyerName,
            profilePic: otherParticipant.registration?.profilePic?.url
                        || otherParticipant.profilePic    || profilePic,
            type: "Lawyer",
          },
        },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to open chat");
    } finally {
      setLoading(false);
    }
  };

  // ── Icon-only variant (circular, matches IconButton style) ─────────────────
  if (variant === "icon") {
    return (
      <button
        onClick={handleStart}
        disabled={loading}
        title="Message Lawyer"
        className={`bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-3 rounded-full shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${className}`}
      >
        {loading
          ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin block" />
          : <FiMessageCircle className="w-4 h-4" />
        }
      </button>
    );
  }

  // ── Default full button ────────────────────────────────────────────────────
  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold rounded-xl shadow-md hover:shadow-lg transition-all text-sm ${className}`}
    >
      {loading
        ? <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
        : <FiMessageCircle className="w-4 h-4" />
      }
      {loading ? "Opening…" : "Message Lawyer"}
    </button>
  );
};

export default StartChatButton;