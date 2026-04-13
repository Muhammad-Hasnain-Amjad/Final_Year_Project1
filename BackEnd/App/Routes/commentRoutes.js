const express = require("express");
const Comment =require("../Models/Comment.js");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose"); 
  const Appointment = require("../Models/Appointment.js");

require("dotenv").config();
const commentRoutes = express.Router();
const authMiddleware =require("../../MiddleWare/JWTToken.js")
// Middleware to check if user is authenticated
console.log("JWT Middleware:", authMiddleware);

// Get comments for a lawyer
commentRoutes.get("/lawyer/:lawyerId", async (req, res) => {
  try {
    const comments = await Comment.find({ lawyerId: req.params.lawyerId })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    
    res.status(200).json({ success: true, data: comments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create comment (only after completed appointment)
commentRoutes.post("/", authMiddleware, async (req, res) => {
  try {
    const { lawyerId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "User not authenticated" 
      });
    }

    // Check if user has a COMPLETED appointment with this lawyer
    const completedAppointment = await Appointment.findOne({
      userId: userId,
      lawyerId: lawyerId,
      status: "completed"
    });

    if (!completedAppointment) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only leave a review after your appointment is completed." 
      });
    }

    // Check if user has already reviewed this lawyer
    const existingComment = await Comment.findOne({
      userId: userId,
      lawyerId: lawyerId
    });

    if (existingComment) {
      return res.status(400).json({ 
        success: false, 
        message: "You have already reviewed this lawyer." 
      });
    }

    const newComment = await Comment.create({
      userId,
      lawyerId,
      rating,
      comment
    });
    
    const populatedComment = await Comment.findById(newComment._id)
      .populate("userId", "name email");
    
    res.status(201).json({ 
      success: true, 
      data: populatedComment 
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update comment (only the comment owner)
commentRoutes.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const commentId = req.params.id;
    const userId = req.user?.id;

    // Find the comment
    const existingComment = await Comment.findById(commentId);
    
    if (!existingComment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }

    // Check if user is the owner of the comment
    if (existingComment.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only edit your own comments" 
      });
    }

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      { rating, comment },
      { new: true }
    ).populate("userId", "name email");
    
    res.status(200).json({ 
      success: true, 
      data: updatedComment,
      message: "Comment updated successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete comment (only the comment owner)
commentRoutes.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const commentId = req.params.id;
    const userId = req.user?.id;

    // Find the comment
    const existingComment = await Comment.findById(commentId);
    
    if (!existingComment) {
      return res.status(404).json({ 
        success: false, 
        message: "Comment not found" 
      });
    }

    // Check if user is the owner of the comment
    if (existingComment.userId.toString() !== userId) {
      return res.status(403).json({ 
        success: false, 
        message: "You can only delete your own comments" 
      });
    }

    await Comment.findByIdAndDelete(commentId);
    
    res.status(200).json({ 
      success: true, 
      message: "Comment deleted successfully" 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports =commentRoutes;