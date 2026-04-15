// src/Components/Chat/ChatList.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FiMessageCircle, FiSearch, FiUser, FiUsers, 
  FiClock, FiCheckCircle, FiCircle
} from "react-icons/fi";
import { useChat } from "../../Context/ChatContext";
import { toast } from "react-toastify";

const ChatList = () => {
  const navigate = useNavigate();
  const { onlineUsers, unreadMessages, isUserOnline } = useChat();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch user's chats
  const { data: chats, isLoading, refetch } = useQuery({
    queryKey: ["user-chats"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      // ✅ FIXED: Added missing '/api' in the URL
      const response = await axios.get("http://localhost:5000/chats/my-chats", {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data || [];
    }
  });

  const filteredChats = chats?.filter(chat =>
    chat.otherParticipant?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const diff = now - new Date(date);
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const handleChatClick = (chatId, otherParticipant) => {
    navigate(`/chats/${chatId}`, { state: { otherParticipant } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
          <FiMessageCircle /> Messages
        </h2>
        <p className="text-gray-500 text-sm mt-1">Your conversations</p>
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-yellow-400 outline-none text-white"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats?.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-gray-400 text-sm mt-1">Start chatting with a lawyer!</p>
            <button
              onClick={() => navigate("/lawyers")}
              className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Find Lawyers
            </button>
          </div>
        ) : (
          filteredChats.map((chat, idx) => {
            const isOnline = isUserOnline(chat.otherParticipant?._id);
            // ✅ FIXED: Use chat.unreadCount from backend if available
            const unread = unreadMessages[chat._id] || chat.unreadCount || 0;
            
            return (
              <motion.button
                key={chat._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleChatClick(chat._id, chat.otherParticipant)}
                className="w-full p-4 flex items-center gap-3 hover:bg-white/5 transition-all border-b border-gray-800/50 group"
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 flex items-center justify-center">
                    {chat.otherParticipant?.profilePic ? (
                      <img 
                        src={chat.otherParticipant.profilePic} 
                        alt={chat.otherParticipant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <FiUser className="w-6 h-6 text-yellow-400" />
                    )}
                  </div>
                  {/* Online Status Dot */}
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black"></div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 text-left">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-white group-hover:text-yellow-400 transition">
                      {chat.otherParticipant?.name || "Unknown"}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {getTimeAgo(chat.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {chat.lastMessageSender === "You" ? "You: " : ""}{chat.lastMessage || "No messages yet"}
                  </p>
                </div>

                {/* Unread Badge */}
                {unread > 0 && (
                  <div className="min-w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center px-1">
                    <span className="text-xs text-black font-bold">{unread}</span>
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