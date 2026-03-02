const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
  registration: {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    phoneNumber: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    clinicHospital: { type: String, required: true },
    pmdcNumber: { type: String, required: true },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
  profilePic: { type: String, required: true },
cnicFront: { type: String, required: true },
cnicBack: { type: String, required: true },
pmdcCertificate: { type: String, required: true },
medicalDegree: { type: String, required: true }

  },
  profile: {
    about: { type: String, default: "" },
    availableDays: { type: [String], default: [] },
    availableTime: { type: [{ start: String, end: String }], default: [] },
    consultationFee: { type: Number, default: 0 }
  },
  comments:[
    {
          userId: { type: mongoose.Schema.Types.ObjectId },
          comment: { type: String },
          rating: { type: Number },
          createdAt: { type: Date, default: Date.now }
        }
  ],
  status: {
    isVerified: { type: Boolean, default: false },
    verificationDate: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
  }
});

const drmodel = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

// Correct export
module.exports = drmodel;