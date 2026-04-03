const express = require("express");
const Comment =require("../Models/Comment.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");   // ✅ ADD THIS

require("dotenv").config();
const commentRoutes = express.Router();
const authMiddleware =require("../../MiddleWare/JWTToken.js")
// Middleware to check if user is authenticated
console.log("JWT Middleware:", authMiddleware);

// Get comments for a lawyer
commentRoutes.get("/lawyer/:lawyerId", async (req, res) => {
  try {
    const comments = await Comment.find({ lawyerId: req.params.lawyerId })
      .populate("userId", "fullName email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Add comment
commentRoutes.post("/", authMiddleware, async (req, res) => {
  try {
    const { lawyerId, rating, comment } = req.body;
    const userId = req.user?.id || "some-user-id"; // Replace with actual user ID from auth
    
    const newComment = await Comment.create({
      userId,
      lawyerId,
      rating,
      comment
    });
    
    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "fullName email");
    
    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update comment
commentRoutes.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const commentId = req.params.id;
    
    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { rating, comment },
      { new: true }
    ).populate("userId", "fullName email");
    
    res.status(200).json({ success: true, data: updatedComment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete comment
commentRoutes.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Comment.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports =commentRoutes;