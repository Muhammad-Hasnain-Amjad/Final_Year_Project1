const express=require("express")
const cors=require("cors");
const dotenv = require('dotenv');
dotenv.config()
const DBConnection=require("./Config/DB_Config.js")
const {lawyerrouter}=require("./App/Routes/Lawyerroute.js")
const Drrouter=require("./App/Routes/Drroute.js")
const userRouter=require("./App/Routes/userRouter.js")
// index.js or server.js (add these lines)
const commentRoutes =require ("./App/Routes/commentRoutes.js");
const appointmentRoutes=require ("./App/Routes/appointmentroutes.js");

console.log("commentRoutes type:", typeof commentRoutes);
 console.log("appointmentRoutes type:",typeof appointmentRoutes)
// Add after other middleware

//----Working.----
const app=express()
app.use(cors());
app.use(express.json());
app.use("/lawyer",lawyerrouter)
app.use("/doctor",Drrouter)
app.use("/user",userRouter)
app.get("/",(req,res)=>{
    res.send("Backend working")
})
app.use("/comments", commentRoutes);
app.use("/appointments", appointmentRoutes);

app.listen(5000,()=>{
let conn=DBConnection();
 if(conn){
        console.log("Running")

 }
})