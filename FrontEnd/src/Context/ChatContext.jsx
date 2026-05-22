// src/Context/ChatContext.jsx
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import api from "../config/api";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState({}); // { chatId: { userId: true/false } }
  const [unreadMessages, setUnreadMessages] = useState({}); // { chatId: count }
  const [activeMessages, setActiveMessages] = useState({}); // { chatId: [messages] }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    // Connect socket - extract host from api URL
    const socketUrl = api.replace(/\/$/, ""); // Remove trailing slash if any
    const socket = io(socketUrl, {
      auth: { token },
      transports: ["websocket"],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
      console.log("❌ Socket disconnected");
    });

    // Online/Offline status
    socket.on("user-status", ({ userId, isOnline }) => {
      setOnlineUsers((prev) => {
        const updated = new Set(prev);
        if (isOnline) updated.add(userId.toString());
        else updated.delete(userId.toString());
        return updated;
      });
    });

    // Typing indicator
    socket.on("user-typing", ({ chatId, userId, isTyping }) => {
      setTypingUsers((prev) => ({
        ...prev,
        [chatId]: {
          ...(prev[chatId] || {}),
          [userId]: isTyping,
        },
      }));
    });

    // Incoming new message (from the other side)
    socket.on("new-message", (msg) => {
      const chatId = msg.chatId?.toString();
      setActiveMessages((prev) => {
        const existing = prev[chatId] || [];
        // Avoid duplicates
        if (existing.find((m) => m._id === msg._id)) return prev;
        return {
          ...prev,
          [chatId]: [
            ...existing,
            {
              _id: msg._id,
              chatId: msg.chatId,
              message: msg.message,
              messageType: msg.messageType,
              senderId: msg.sender?.id,
              senderModel: msg.sender?.type,
              createdAt: msg.createdAt,
              isRead: false,
              deliveredAt: new Date(),
            },
          ],
        };
      });

      // Increment unread count
      setUnreadMessages((prev) => ({
        ...prev,
        [chatId]: (prev[chatId] || 0) + 1,
      }));
    });

    // Message sent confirmation (echo back to sender)
    socket.on("message-sent", ({ success, messageId }) => {
      // Optionally handle sent confirmation
    });

    // Messages read
    socket.on("messages-read", ({ chatId }) => {
      setActiveMessages((prev) => {
        const msgs = prev[chatId] || [];
        return {
          ...prev,
          [chatId]: msgs.map((m) => ({ ...m, isRead: true })),
        };
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // ── Actions ──────────────────────────────────────────────

  const joinChat = useCallback((chatId) => {
    socketRef.current?.emit("join-chat", chatId);
  }, []);

  const leaveChat = useCallback((chatId) => {
    socketRef.current?.emit("leave-chat", chatId);
  }, []);

  const sendMessage = useCallback(({ chatId, receiverId, receiverType, message, messageType = "text" }) => {
    const currentUserId = localStorage.getItem("userId");
    const currentUserType = localStorage.getItem("userType") || "User";

    const tempId = `temp_${Date.now()}`;
    const tempMsg = {
      _id: tempId,
      chatId,
      message,
      messageType,
      senderId: currentUserId,
      senderModel: currentUserType,
      receiverId,
      receiverModel: receiverType,
      createdAt: new Date().toISOString(),
      isRead: false,
      deliveredAt: null,
      isPending: true,
    };

    // Optimistic update
    setActiveMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), tempMsg],
    }));

    socketRef.current?.emit("send-message", {
      chatId,
      receiverId,
      receiverType,
      message,
      messageType,
    });

    // Confirm sent (replace temp with real on next message-sent)
    socketRef.current?.once("message-sent", ({ success, messageId }) => {
      if (success) {
        setActiveMessages((prev) => {
          const msgs = prev[chatId] || [];
          return {
            ...prev,
            [chatId]: msgs.map((m) =>
              m._id === tempId ? { ...m, _id: messageId, isPending: false, deliveredAt: new Date() } : m
            ),
          };
        });
      }
    });
  }, []);

  const sendTyping = useCallback(({ chatId, receiverId, isTyping }) => {
    socketRef.current?.emit("typing", { chatId, receiverId, isTyping });
  }, []);

  const markAsRead = useCallback(({ chatId, messageIds }) => {
    socketRef.current?.emit("mark-read", { chatId, messageIds });
  }, []);

  const resetUnreadCount = useCallback((chatId) => {
    setUnreadMessages((prev) => ({ ...prev, [chatId]: 0 }));
  }, []);

  const setInitialMessages = useCallback((chatId, messages) => {
    setActiveMessages((prev) => ({
      ...prev,
      [chatId]: messages,
    }));
  }, []);

  const isUserOnline = useCallback(
    (userId) => userId && onlineUsers.has(userId.toString()),
    [onlineUsers]
  );

  const isUserTyping = useCallback(
    (chatId, userId) => !!(typingUsers[chatId]?.[userId]),
    [typingUsers]
  );

  return (
    <ChatContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onlineUsers,
        unreadMessages,
        activeMessages,
        joinChat,
        leaveChat,
        sendMessage,
        sendTyping,
        markAsRead,
        resetUnreadCount,
        setInitialMessages,
        isUserOnline,
        isUserTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used inside ChatProvider");
  return ctx;
};