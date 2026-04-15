// src/Components/Chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiArrowLeft, 
  FiSend, 
  FiUser, 
  FiMoreVertical,
  FiCheck, 
  FiCheckCircle, 
  FiCircle, 
  FiMessageCircle
} from "react-icons/fi";
import { useChat } from "../../Context/ChatContext";
import { toast } from "react-toastify";

const ChatWindow = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const messagesEndRef = useRef(null);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const currentUserId = localStorage.getItem("userId");

  const { 
    joinChat, 
    leaveChat, 
    sendMessage, 
    sendTyping, 
    markAsRead,
    isUserOnline,
    isUserTyping,
    resetUnreadCount
  } = useChat();

  const otherParticipant = location.state?.otherParticipant;

  // Fetch chat messages
  const { data: messages, isLoading } = useQuery({
    queryKey: ["chat-messages", chatId],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data || [];
    },
    enabled: !!chatId
  });

  // Create or get chat with a lawyer
  const createChatMutation = useMutation({
    mutationFn: async ({ otherUserId, otherUserType }) => {
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/api/chats/create", {
        otherUserId,
        otherUserType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      navigate(`/chats/${data.chat._id}`, { state: { otherParticipant: data.otherParticipant } });
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to start chat");
    }
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Join chat room on mount
  useEffect(() => {
    if (chatId) {
      joinChat(chatId);
      resetUnreadCount(chatId);
      
      // Mark messages as read
      if (messages && messages.length > 0 && currentUserId) {
        const unreadMessageIds = messages
          .filter(m => !m.isRead && m.receiverId === currentUserId)
          .map(m => m._id);
        if (unreadMessageIds.length > 0) {
          markAsRead({ chatId, messageIds: unreadMessageIds });
        }
      }
    }

    return () => {
      if (chatId) leaveChat(chatId);
    };
  }, [chatId, joinChat, leaveChat, messages, markAsRead, resetUnreadCount, currentUserId]);

  // Handle typing indicator
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.length > 0) {
      setIsTyping(true);
      sendTyping({ chatId, receiverId: otherParticipant?._id, isTyping: true });
    }
    
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    typingTimeoutRef.current = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTyping({ chatId, receiverId: otherParticipant?._id, isTyping: false });
      }
    }, 1000);
  };

  // Send message
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const receiverType = otherParticipant?.type || 
      (otherParticipant?.email ? "User" : "Lawyer");

    sendMessage({
      chatId,
      receiverId: otherParticipant?._id,
      receiverType,
      message: newMessage.trim(),
      messageType: "text"
    });

    setNewMessage("");
    
    // Stop typing indicator
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    sendTyping({ chatId, receiverId: otherParticipant?._id, isTyping: false });
    setIsTyping(false);
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isOnline = isUserOnline(otherParticipant?._id);
  const isReceiverTyping = isUserTyping(chatId, otherParticipant?._id);

  // If no chatId and we have otherParticipant (from lawyer click), create chat
  if (!chatId && otherParticipant) {
    createChatMutation.mutate({
      otherUserId: otherParticipant._id,
      otherUserType: otherParticipant.type || "Lawyer"
    });
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-900 to-black">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/chats")}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <FiArrowLeft className="w-5 h-5 text-yellow-400" />
          </button>
          
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-500/10 flex items-center justify-center">
              {otherParticipant?.profilePic ? (
                <img 
                  src={otherParticipant.profilePic} 
                  alt={otherParticipant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <FiUser className="w-5 h-5 text-yellow-400" />
              )}
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold text-white">{otherParticipant?.name || "Loading..."}</h3>
            <p className="text-xs text-gray-400">
              {isReceiverTyping ? (
                <span className="text-yellow-400 animate-pulse">Typing...</span>
              ) : isOnline ? (
                "Online"
              ) : (
                "Offline"
              )}
            </p>
          </div>
          
          <button className="p-2 rounded-lg hover:bg-white/10 transition">
            <FiMoreVertical className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages?.length === 0 ? (
          <div className="text-center py-12">
            <FiMessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500">No messages yet</p>
            <p className="text-gray-400 text-sm mt-1">Start the conversation!</p>
          </div>
        ) : (
          <AnimatePresence>
            {messages?.map((msg, idx) => {
              const isSender = msg.senderId === currentUserId;
              const showSender = idx === 0 || messages[idx - 1]?.senderId !== msg.senderId;
              
              return (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${isSender ? "order-1" : "order-2"}`}>
                    {showSender && !isSender && (
                      <p className="text-xs text-gray-500 mb-1 ml-2">
                        {otherParticipant?.name}
                      </p>
                    )}
                    <div className={`relative px-4 py-2 rounded-2xl ${
                      isSender 
                        ? "bg-yellow-500 text-black rounded-br-sm" 
                        : "bg-gray-800 text-white rounded-bl-sm"
                    }`}>
                      <p className="text-sm break-words">{msg.message}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 ${isSender ? "justify-end" : "justify-start"}`}>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {/* ✅ FIXED - Clean and safe version */}
                      {isSender && (
                        <>
                          {msg.isRead ? (
                            <FiCheckCircle className="w-3 h-3 text-green-500" />
                          ) : msg.deliveredAt ? (
                            <FiCheck className="w-3 h-3 text-gray-500" />
                          ) : (
                            <FiCircle className="w-3 h-3 text-gray-500" />
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <textarea
            value={newMessage}
            onChange={handleTyping}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            rows="1"
            className="flex-1 p-3 rounded-xl bg-gray-800/50 border border-gray-700 focus:border-yellow-400 outline-none text-white resize-none max-h-32"
            style={{ overflowY: 'auto' }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-yellow-500 text-black rounded-xl font-semibold hover:bg-yellow-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            <FiSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;