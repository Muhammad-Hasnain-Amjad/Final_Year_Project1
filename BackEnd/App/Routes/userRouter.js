const express=require('express')
const {loginUser,registerUser,allusers,resetPassword,verifyEmail}=require("../Controllers/user_cont.js");
const usermodel = require('../Models/usermodel.js');

const userRouter=express.Router();

userRouter.post("/login",loginUser)
userRouter.post("/register",registerUser)
userRouter.get("/allusers",allusers)
// 1. Verify email exists


// 2. Direct password reset
userRouter.post('/reset-password-direct',resetPassword);
// 3. Verify email
userRouter.post('/verify-email',verifyEmail);
module.exports=userRouter