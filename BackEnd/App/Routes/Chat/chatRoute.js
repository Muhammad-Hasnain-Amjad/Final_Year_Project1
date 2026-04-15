const express = require('express');
const { 
  getOrCreateChat,
  getUserChats, 
  getChatMessages,
  markMessagesAsRead 
} = require('../../Controllers/Chat/chat_cont.js');
const authMiddleware = require('../../../MiddleWare/JWTToken.js');
const chatRouter = express.Router();

// ✅ REMOVE this line - it's causing the error
// console.log(getType(getOrCreateChat));

// Create or get a chat
chatRouter.post("/create", authMiddleware, getOrCreateChat);

// Get user's all chats
chatRouter.get("/my-chats", authMiddleware, getUserChats);

// Get messages for a specific chat
chatRouter.get("/:chatId/messages", authMiddleware, getChatMessages);

// Mark messages as read
chatRouter.post("/mark-read", authMiddleware, markMessagesAsRead);

module.exports = chatRouter;