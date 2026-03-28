const { urlencoded } = require("express");
const mongoose = require("mongoose");

const lawyerSchema = new mongoose.Schema({
 registration: {
  fullName: { type: String, required: true },
  cnic: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  barCouncilNumber: { type: String, required: true },
  membershipType: { type: String, required: true },
  yearOfEnrollment: { type: Number, required: true },

 
  practiceAreas: { type: [String], required: true },
  experience: { type: Number, required: true },
  courtLevel: { type: String, required: true },
  officeAddress: { type: String, required: true },
  barCouncilCard: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},
cnicFront: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},
cnicBack: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},
profilePic: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},
llb: {
  url: { type: String, required: true },
  public_id: { type: String, required: true }
},

  username: { type: String, unique: true, required: true },
  password: { type: String, required: true }
},

  profile: {
    about: { type: String ,default:""},
    fee: { type: Number }
  },
 
  status: {
    isVerified: { type: String, default: "pending" },
    verificationDate: { type: Date },
    isActive: { type: Boolean, default: true }
  },
  days: [
      
        { type: String, required: true }, // e.g., "Monday"
       
    ],
      slots: [
        { type: String ,required: true }
      ],
});

const lawyermodel =mongoose.model.Lawyer || mongoose.model("Lawyer", lawyerSchema);
module.exports =lawyermodel