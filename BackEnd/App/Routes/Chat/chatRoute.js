const express = require('express');
const { 
  getOrCreateChat,
  getUserChats, 
  getChatMessages,
  markMessagesAsRead 
} = require('../../Controllers/Chat/chat_cont.js');
const authMiddleware = require('../../../MiddleWare/JWTToken.js');
const {getLegalAdvice}=require('../../../Services/deepSeekServices.js');
const chatRouter = express.Router();
const lawyermodel = require('../../Models/lawyerModel.js');


// Create or get a chat
chatRouter.post("/create", authMiddleware, getOrCreateChat);

// Get user's all chats
chatRouter.get("/my-chats", authMiddleware, getUserChats);

// Get messages for a specific chat
chatRouter.get("/:chatId/messages", authMiddleware, getChatMessages);

// Mark messages as read
chatRouter.post("/mark-read", authMiddleware, markMessagesAsRead);
chatRouter.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    console.log("Received question:", question);
    console.log()
    // Just pass the entire req, res to the service
    await getLegalAdvice(req, res);
  } catch (error) {
    console.error("Chat error:", error);
    if (!res.headersSent) {
      res.status(500).json({ 
        success: false, 
        reply: "Something went wrong. Please try again." 
      });
    }
  }
});

// Lawyer-specific chat (with lawyer's expertise)


module.exports = chatRouter;