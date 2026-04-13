const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../Models/usermodel.js");
const Appointment = require("../Models/Appointment.js");
const appointmentRoutes = express.Router();
const usermodel =require("../../App/Models/usermodel.js")
const authMiddleware = require("../../MiddleWare/JWTToken.js");
const sendEmail=require("../../Utils/sendEmail.js")

const mongoose = require("mongoose");

// Create appointment - with authentication
appointmentRoutes.post("/", authMiddleware, async (req, res) => {
  try {
    const { lawyerId, date, time, caseType, description } = req.body;
    const userId = req.user.id;
    
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID"
      });
    }
    
    // Validate lawyerId
    if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid lawyer ID"
      });
    }
    
    // Check if the same user already has an appointment with this lawyer at the same time
    const userExistingAppointment = await Appointment.findOne({
      userId,
      lawyerId,
      date: new Date(date),
      time,
      status: { $in: ["pending", "accepted", "ongoing"] }
    });

    
    if (userExistingAppointment) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment with this lawyer at the selected time"
      });
    }
    
    // Check if the time slot is already booked by another user
    // Only block if status is pending, accepted, or ongoing (NOT cancelled or completed)
    const slotBooked = await Appointment.findOne({
      lawyerId,
      date: new Date(date),
      time,
      status: { $in: ["pending", "accepted", "ongoing"] }
    });
    
    if (slotBooked) {
      return res.status(400).json({
        success: false,
        message: `This time slot is already booked. Please choose another time.`
      });
    }
     // Check if the same user already has an appointment with this lawyer
    const userExistingLawyer = await Appointment.findOne({
      userId,
      lawyerId,
      status: { $in: ["pending", "accepted", "ongoing"] }
    });
     if (userExistingLawyer) {
      return res.status(400).json({
        success: false,
        message: "You already have an appointment with this lawyer"
      });
    }
    // Optional: Check if lawyer has reached maximum appointments per day
    const appointmentsCount = await Appointment.countDocuments({
      lawyerId,
      date: new Date(date),
      status: { $in: ["pending", "accepted", "ongoing"] }
    });
    
    const MAX_APPOINTMENTS_PER_DAY = 8; // You can adjust this value
    if (appointmentsCount >= MAX_APPOINTMENTS_PER_DAY) {
      return res.status(400).json({
        success: false,
        message: `Lawyer is fully booked for this day. Maximum ${MAX_APPOINTMENTS_PER_DAY} appointments per day.`
      });
    }
    
    // Create the appointment
    const appointment = await Appointment.create({
      userId,
      lawyerId,
      date: new Date(date),
      time,
      caseType,
      description,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // Populate lawyer details for response
    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate("lawyerId", "registration.fullName registration.profilePic registration.email registration.phoneNumber");
    
    // Optional: Send notification to lawyer (if you have notification system)
    // await sendNotificationToLawyer(lawyerId, { userId, appointmentId: appointment._id });
    
    res.status(201).json({
      success: true,
      message: "Appointment booked successfully! Waiting for lawyer confirmation.",
      data: populatedAppointment
    });
    
    console.log("Appointment created:", {
      id: appointment._id,
      userId,
      lawyerId,
      date,
      time,
      caseType,
      status: "pending"
    });
    
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to book appointment"
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
// Get lawyer's appointments - FIXED for your User model
appointmentRoutes.get("/lawyer/:lawyerId", async (req, res) => {
  try {
    const { lawyerId } = req.params;  // ← CORRECT
    
    // Optional: Validate if lawyerId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(lawyerId)) {
      return res.status(400).json({ 
        success: false, 
        message: "Invalid lawyer ID format" 
      });
    }
    
    const appointments = await Appointment.find({ lawyerId: lawyerId })
      .populate("userId", "name email phone")
      .sort({ date: 1, time: 1 });
    
    res.status(200).json({ 
      success: true, 
      data: appointments,
      count: appointments.length 
    });
    
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
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
    ).populate("userId","name email"); // adjust if your fields differ

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found",
      });
    }

    const updatedStatus = appointment.status;
    const updatedEmail = appointment.userId.email;
    const updatedName = appointment.userId.name;

    // -------------------------------
    // 1. ACCEPTED / VERIFIED
    // -------------------------------
    if (updatedStatus === "accepted" || updatedStatus === "verified") {
      await sendEmail(
        updatedEmail,
        "Appointment Accepted",
        `
        <h2>Hello ${updatedName},</h2>
        <p>Your appointment has been <b>accepted</b> successfully.</p>
        <p>You can now proceed with the consultation details.</p>
        ${meetingLink ? `<p>Meeting Link: ${meetingLink}</p>` : ""}
        <br/>
        <p>Best Regards,<br/>Cure&Counsel</p>
        `
      );
    }

    // -------------------------------
    // 2. REJECTED
    // -------------------------------
    else if (updatedStatus === "rejected") {
      await sendEmail(
        updatedEmail,
        "Appointment Rejected",
        `
        <h2>Hello ${updatedName},</h2>
        <p>We regret to inform you that your appointment has been <b>rejected</b>.</p>
        <p>Please try booking another time slot or contact support.</p>
        <br/>
        <p>Best Regards,<br/>Cure&Counsel Team</p>
        `
      );
    }

    // -------------------------------
    // 3. COMPLETED
    // -------------------------------
    else if (updatedStatus === "completed") {
      await sendEmail(
        updatedEmail,
        "Appointment Completed",
        `
        <h2>Hello ${updatedName},</h2>
        <p>Your appointment has been marked as <b>completed</b> by the lawyer.</p>
        <p>We hope your consultation was helpful.</p>
        <br/>
        <p>Best Regards,<br/>Cure&Counsel Team</p>
        `
      );
    }

    return res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: appointment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports=appointmentRoutes;