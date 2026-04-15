// src/context/ChatContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import io from "socket.io-client";
import { toast } from "react-toastify";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [newMessageNotification, setNewMessageNotification] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userType = localStorage.getItem("userType");

    if (!token) {
      console.log("No token, skipping socket connection");
      return;
    }

    console.log("Connecting to socket with token...");

    const newSocket = io("http://localhost:5000", {
      auth: { token },
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    });

    newSocket.on("connect_error", (error) => {
      console.error("❌ Socket connection error:", error.message);
      setIsConnected(false);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("user-status", ({ userId, userType, isOnline }) => {
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (isOnline) {
          newSet.add(userId);
        } else {
          newSet.delete(userId);
        }
        return newSet;
      });
    });

    newSocket.on("user-typing", ({ chatId, userId, isTyping }) => {
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        const key = `${chatId}_${userId}`;
        if (isTyping) {
          newSet.add(key);
        } else {
          newSet.delete(key);
        }
        return newSet;
      });
    });

    newSocket.on("new-message", (message) => {
      console.log("📩 New message received:", message);
      
      setNewMessageNotification(message);
      
      // Increment unread count for the chat
      setUnreadMessages(prev => ({
        ...prev,
        [message.chatId]: (prev[message.chatId] || 0) + 1
      }));
      
      // Show toast notification
      toast.info(`📨 New message from ${message.sender?.name || "Someone"}`);
    });

    newSocket.on("message-sent", (message) => {
      console.log("✅ Message sent:", message);
    });

    newSocket.on("message-delivered", ({ messageId }) => {
      console.log("✅ Message delivered:", messageId);
    });

    newSocket.on("messages-read", ({ chatId }) => {
      console.log("✅ Messages read in chat:", chatId);
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection");
      if (newSocket) {
        newSocket.disconnect();
        newSocket.close();
      }
    };
  }, []); // Empty dependency array - connect once on mount

  const joinChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit("join-chat", chatId);
      console.log(`Joined chat: ${chatId}`);
    } else {
      console.warn("Cannot join chat - socket not connected");
    }
  };

  const leaveChat = (chatId) => {
    if (socket && isConnected) {
      socket.emit("leave-chat", chatId);
      console.log(`Left chat: ${chatId}`);
    }
  };

  const sendMessage = (data) => {
    if (socket && isConnected) {
      socket.emit("send-message", data);
      console.log("📤 Message sent:", data);
    } else {
      console.warn("Cannot send message - socket not connected");
      toast.error("Not connected to chat server");
    }
  };

  const sendTyping = ({ chatId, receiverId, isTyping }) => {
    if (socket && isConnected) {
      socket.emit("typing", { chatId, receiverId, isTyping });
    }
  };

  const markAsRead = ({ chatId, messageIds }) => {
    if (socket && isConnected) {
      socket.emit("mark-read", { chatId, messageIds });
      setUnreadMessages(prev => ({ ...prev, [chatId]: 0 }));
      console.log(`Marked ${messageIds?.length || 0} messages as read in chat: ${chatId}`);
    }
  };

  const resetUnreadCount = (chatId) => {
    setUnreadMessages(prev => ({ ...prev, [chatId]: 0 }));
  };

  const isUserOnline = (userId) => {
    return onlineUsers.has(userId);
  };

  const isUserTyping = (chatId, userId) => {
    return typingUsers.has(`${chatId}_${userId}`);
  };

  const value = {
    socket,
    isConnected,
    onlineUsers,
    typingUsers,
    newMessageNotification,
    unreadMessages,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
    markAsRead,
    resetUnreadCount,
    isUserOnline,
    isUserTyping,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};