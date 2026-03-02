const express=require("express")
const cors=require("cors");
const dotenv = require('dotenv');
dotenv.config()
const DBConnection=require("./Config/DB_Config.js")
const {lawyerrouter}=require("./App/Routes/Lawyerroute.js")
const Drrouter=require("./App/Routes/Drroute.js")
const userRouter=require("./App/Routes/userRouter.js")
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

app.listen(5000,()=>{
let conn=DBConnection();
 if(conn){
        console.log("Running")

 }
})