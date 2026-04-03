const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Models/usermodel.js");
const Appointment = require("../Models/Appointment.js");
const appointmentRoutes = express.Router();
const authMiddleware = require("../../MiddleWare/JWTToken.js");
const mongoose = require("mongoose");

// Create appointment - with authentication
appointmentRoutes.post("/", authMiddleware, async (req, res) => {
  try {
    const { lawyerId, date, time, caseType, description } = req.body;
    const userId = req.user.id;
    
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }
    
    const existingAppointment = await Appointment.findOne({
      lawyerId,
      date: new Date(date),
      time,
      status: { $in: ["pending", "accepted", "ongoing"] }
    });
    
    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: "This time slot is already booked"
      });
    }
    
    const appointment = await Appointment.create({
      userId,
      lawyerId,
      date,
      time,
      caseType,
      description,
      status: "pending"
    });
    
    // FIX: Remove the .populate("userId") line
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("lawyerId", "registration.fullName registration.profilePic");
      // .populate("userId", "fullName email");  // ← COMMENT OR REMOVE THIS LINE
    
    res.status(201).json({
      success: true,
      data: populatedAppointment
    });
    console.log("Appointment created:", populatedAppointment);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get user's appointments
appointmentRoutes.get("/user", authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user?.id })
      .populate("lawyerId", "registration.fullName registration.profilePic")
      .sort({ date: 1, time: 1 });
    
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get lawyer's appointments
appointmentRoutes.get("/lawyer/:lawyerId", async (req, res) => {
  try {
    const appointments = await Appointment.find({ lawyerId: req.params.lawyerId })
      .populate("userId", "fullName email phoneNumber")
      .sort({ date: 1, time: 1 });
    
    res.status(200).json({ success: true, data: appointments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Create appointment


// Update appointment status
appointmentRoutes.patch("/:id/status", async (req, res) => {
  try {
    const { status, meetingLink } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, meetingLink, updatedAt: Date.now() },
      { new: true }
    );
    
    res.status(200).json({ success: true, data: appointment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports=appointmentRoutes;