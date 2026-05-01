// src/Components/Chat/ChatWindow.jsx
// ✅ SHARED - Works for both User & Lawyer side

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiArrowLeft, FiSend, FiUser, FiMoreVertical,
  FiCheckCircle, FiCheck, FiCircle, FiMessageCircle,
} from "react-icons/fi";
import { useChat } from "../../Context/ChatContext";
import { toast } from "react-toastify";

// backPath: "/chats" for user, "/lawyer-chats" for lawyer
const ChatWindow = ({ backPath = "/chats" }) => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimerRef = useRef(null);

  const [newMessage, setNewMessage] = useState("");
  const [isTypingLocal, setIsTypingLocal] = useState(false);

  const currentUserId = localStorage.getItem("userId");

  const {
    joinChat, leaveChat, sendMessage, sendTyping,
    markAsRead, resetUnreadCount,
    isUserOnline, isUserTyping,
    activeMessages, setInitialMessages,
  } = useChat();

  const otherParticipant = location.state?.otherParticipant;

  // ── Fetch historical messages ──────────────────────────
  const { isLoading } = useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/chats/${chatId}/messages`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const msgs = res.data.data || [];
      setInitialMessages(chatId, msgs);
      return msgs;
    },
    enabled: !!chatId,
    staleTime: Infinity, // socket keeps it fresh
  });

  const messages = activeMessages[chatId] || [];

  // ── Auto scroll ────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Join / Leave chat room ─────────────────────────────
  useEffect(() => {
    if (!chatId) return;
    joinChat(chatId);
    resetUnreadCount(chatId);

    return () => leaveChat(chatId);
  }, [chatId, joinChat, leaveChat, resetUnreadCount]);

  // ── Mark messages as read ──────────────────────────────
  useEffect(() => {
    if (!chatId || !messages.length || !currentUserId) return;
    const unreadIds = messages
      .filter((m) => !m.isRead && m.receiverId === currentUserId)
      .map((m) => m._id);
    if (unreadIds.length > 0) {
      markAsRead({ chatId, messageIds: unreadIds });
    }
  }, [messages, chatId, markAsRead, currentUserId]);

  // ── Typing ─────────────────────────────────────────────
  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    if (!isTypingLocal && e.target.value.length > 0) {
      setIsTypingLocal(true);
      sendTyping({ chatId, receiverId: otherParticipant?._id, isTyping: true });
    }

    clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(() => {
      setIsTypingLocal(false);
      sendTyping({ chatId, receiverId: otherParticipant?._id, isTyping: false });
    }, 1200);
  };

  // ── Send ───────────────────────────────────────────────
  const handleSend = useCallback(() => {
    if (!newMessage.trim()) return;

    const receiverType = otherParticipant?.type || "User"; // if lawyer chats, other side is User

    sendMessage({
      chatId,
      receiverId: otherParticipant?._id,
      receiverType,
      message: newMessage.trim(),
      messageType: "text",
    });

    setNewMessage("");
    clearTimeout(typingTimerRef.current);
    sendTyping({ chatId, receiverId: otherParticipant?._id, isTyping: false });
    setIsTypingLocal(false);
    inputRef.current?.focus();
  }, [newMessage, chatId, otherParticipant, sendMessage, sendTyping]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOnline = isUserOnline(otherParticipant?._id);
  const receiverTyping = isUserTyping(chatId, otherParticipant?._id);

  // ── Read tick icon ─────────────────────────────────────
  const ReadTick = ({ msg }) => {
    if (msg.isPending) return <FiCircle className="w-3 h-3 text-gray-600" />;
    if (msg.isRead) return <FiCheckCircle className="w-3 h-3 text-yellow-400" />;
    if (msg.deliveredAt) return <FiCheck className="w-3 h-3 text-gray-500" />;
    return <FiCircle className="w-3 h-3 text-gray-600" />;
  };

  // ── Guard: need chatId ─────────────────────────────────
  if (!chatId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-8 bg-gray-950">
        <FiMessageCircle className="w-12 h-12 text-gray-700 mb-4" />
        <h3 className="text-white text-lg font-semibold mb-1">No chat selected</h3>
        <p className="text-gray-500 text-sm">Pick a conversation from the left</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-950">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="px-4 py-3 border-b border-gray-800/60 bg-gray-900/80 backdrop-blur-sm flex items-center gap-3">
        <button
          onClick={() => navigate(backPath)}
          className="p-2 rounded-lg hover:bg-white/10 transition"
        >
          <FiArrowLeft className="w-4 h-4 text-yellow-400" />
        </button>

        <div className="relative shrink-0">
          <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-700/40">
            {otherParticipant?.profilePic ? (
              <img src={otherParticipant.profilePic} alt={otherParticipant.name} className="w-full h-full object-cover" />
            ) : (
              <FiUser className="w-4 h-4 text-gray-400" />
            )}
          </div>
          {isOnline && (
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-gray-900" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white truncate">
            {otherParticipant?.name || "..."}
          </h3>
          <p className="text-[11px] text-gray-500">
            {receiverTyping ? (
              <span className="text-yellow-400 animate-pulse">Typing…</span>
            ) : isOnline ? (
              <span className="text-green-400">Online</span>
            ) : (
              "Offline"
            )}
          </p>
        </div>

        <button className="p-2 rounded-lg hover:bg-white/10 transition">
          <FiMoreVertical className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* ── Messages ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <FiMessageCircle className="w-10 h-10 text-gray-700 mb-3" />
            <p className="text-gray-500 text-sm">No messages yet</p>
            <p className="text-gray-600 text-xs mt-1">Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => {
              const isSender = msg.senderId?.toString() === currentUserId?.toString();
              const showName =
                !isSender &&
                (idx === 0 || messages[idx - 1]?.senderId?.toString() !== msg.senderId?.toString());

              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div className="max-w-[72%]">
                    {showName && (
                      <p className="text-[10px] text-gray-500 mb-1 ml-1">
                        {otherParticipant?.name}
                      </p>
                    )}

                    <div className={`px-3.5 py-2 rounded-2xl text-sm break-words leading-relaxed ${
                      isSender
                        ? "bg-yellow-500 text-black rounded-br-sm"
                        : "bg-gray-800 text-white rounded-bl-sm"
                    } ${msg.isPending ? "opacity-60" : ""}`}>
                      {msg.message}
                    </div>

                    <div className={`flex items-center gap-1 mt-0.5 ${isSender ? "justify-end" : "justify-start"}`}>
                      <span className="text-[10px] text-gray-600">
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                      {isSender && <ReadTick msg={msg} />}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}

        {/* Typing bubble */}
        <AnimatePresence>
          {receiverTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex justify-start"
            >
              <div className="px-4 py-3 bg-gray-800 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input ──────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-gray-800/60 bg-gray-900/50">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 px-4 py-2.5 text-sm rounded-xl bg-gray-800/60 border border-gray-700/50 focus:border-yellow-500/60 outline-none text-white placeholder-gray-500 resize-none max-h-32 transition"
            style={{ overflowY: "auto" }}
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="p-2.5 bg-yellow-500 hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed text-black rounded-xl transition flex items-center justify-center shrink-0"
          >
            <FiSend className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
