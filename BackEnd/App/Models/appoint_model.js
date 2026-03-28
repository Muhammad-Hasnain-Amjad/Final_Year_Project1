const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // References (foreign keys)
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    lawId: { type: mongoose.Schema.Types.ObjectId, ref: "Lawyer", required: true },

    // Embedded profile snapshots
    userData: { type: Object, required: true }, // copy of user profile at booking time
    docData: { type: Object, required: true },  // copy of doctor/lawyer profile at booking time

    // Appointment details
    slotDate: { type: String, required: true }, // e.g., "2026-03-27"
    slotTime: { type: String, required: true }, // e.g., "10:30 AM"
    amount: { type: Number, required: true },

    // Status
    cancelled: { type: Boolean, default: false },
    payment: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const appoint_model = mongoose.model("Appointment", appointmentSchema);
module.exports=appoint_model