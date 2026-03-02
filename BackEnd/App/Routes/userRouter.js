const express=require('express')
const {loginUser,registerUser,allusers}=require("../Controllers/user_cont.js")

const userRouter=express.Router();

userRouter.post("/login",loginUser)
userRouter.post("/register",registerUser)
userRouter.get("/allusers",allusers)
module.exports=userRouter