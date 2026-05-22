const express=require('express')
const {loginUser,registerUser,allusers,resetPassword,verifyEmail}=require("../Controllers/user_cont.js");
const usermodel = require('../Models/usermodel.js');
const authMiddleware = require('../../MiddleWare/JWTToken.js');
const userRouter=express.Router();

userRouter.post("/login",loginUser)
userRouter.post("/register",registerUser)
userRouter.get("/allusers",allusers)
// 1. Verify email exists
userRouter.get("/profile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await usermodel.findById(userId).select("-password");
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
userRouter.patch("/profile/:userId", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, gender, dob, phone, address } = req.body;
    
    const updatedUser = await usermodel.findByIdAndUpdate(
      userId,
      { name, gender, dob, phone, address },
      { new: true, runValidators: true }
    ).select("-password");
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.json({ success: true, data: updatedUser, message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
// 2. Direct password reset
userRouter.post('/reset-password-direct',resetPassword);
// 3. Verify email
userRouter.post('/verify-email',verifyEmail);
module.exports=userRouter