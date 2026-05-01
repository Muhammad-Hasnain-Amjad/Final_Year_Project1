// src/Components/Chat/ChatList.jsx
// ✅ SHARED - Works for both User side and Lawyer side
// Backend auto-detects who you are via JWT token

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FiMessageCircle, FiSearch, FiUser, FiLoader
} from "react-icons/fi";
import { useChat } from "../../Context/ChatContext";

// basePath: "/chats" for user, "/lawyer-chats" for lawyer
const ChatList = ({ basePath = "/chats" }) => {
  const navigate = useNavigate();
  const { isUserOnline, unreadMessages } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ["my-chats", basePath],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/chats/my-chats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.data || [];
    },
    refetchInterval: 10000, // refresh every 10s for new chats
  });

  const filtered = chats.filter((c) =>
    c.otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const timeAgo = (date) => {
    if (!date) return "";
    const diff = Date.now() - new Date(date);
    const m = Math.floor(diff / 60000);
    const h = Math.floor(diff / 3600000);
    const d = Math.floor(diff / 86400000);
    if (m < 1) return "Just now";
    if (m < 60) return `${m}m`;
    if (h < 24) return `${h}h`;
    return `${d}d`;
  };

  const handleClick = (chat) => {
    navigate(`${basePath}/${chat._id}`, {
      state: { otherParticipant: chat.otherParticipant },
    });
  };

  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-800/60">
        <div className="flex items-center gap-2 mb-1">
          <FiMessageCircle className="text-yellow-400 w-5 h-5" />
          <h2 className="text-lg font-bold text-white tracking-tight">Messages</h2>
        </div>
        <p className="text-gray-500 text-xs">Your conversations</p>
      </div>

      {/* Search */}
      <div className="px-4 py-3">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl bg-gray-800/60 border border-gray-700/50 focus:border-yellow-500/60 outline-none text-white placeholder-gray-500 transition"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <FiMessageCircle className="w-10 h-10 text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No conversations yet</p>
            {basePath === "/chats" && (
              <button
                onClick={() => navigate("/lawyers")}
                className="mt-4 px-4 py-2 text-xs font-semibold bg-yellow-500 hover:bg-yellow-400 text-black rounded-lg transition"
              >
                Browse Lawyers
              </button>
            )}
          </div>
        ) : (
          filtered.map((chat, idx) => {
            const online = isUserOnline(chat.otherParticipant?._id);
            const unread = unreadMessages[chat._id] || chat.unreadCount || 0;

            return (
              <motion.button
                key={chat._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => handleClick(chat)}
                className="w-full px-4 py-3.5 flex items-center gap-3 hover:bg-white/[0.04] transition border-b border-gray-800/40 group text-left"
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div className="w-11 h-11 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700/40">
                    {chat.otherParticipant?.profilePic ? (
                      <img
                        src={chat.otherParticipant.profilePic}
                        alt={chat.otherParticipant.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  {online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-950 rounded-full" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <span className={`text-sm font-semibold truncate group-hover:text-yellow-400 transition ${unread > 0 ? "text-white" : "text-gray-200"}`}>
                      {chat.otherParticipant?.name || "Unknown"}
                    </span>
                    <span className="text-[10px] text-gray-600 shrink-0 ml-2">
                      {timeAgo(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${unread > 0 ? "text-gray-300" : "text-gray-500"}`}>
                    {chat.lastMessageSender === "You" ? (
                      <span className="text-gray-500">You: </span>
                    ) : null}
                    {chat.lastMessage || "No messages yet"}
                  </p>
                </div>

                {/* Unread badge */}
                {unread > 0 && (
                  <div className="shrink-0 min-w-[18px] h-[18px] bg-yellow-500 rounded-full flex items-center justify-center px-1">
                    <span className="text-[10px] font-bold text-black">{unread > 9 ? "9+" : unread}</span>
                  </div>
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
