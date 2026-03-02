let mongoose=require("mongoose")

async function DBConnection(){
    let conn=await mongoose.connect("mongodb://127.0.0.1:27017/FYP"
).then(()=>{
    console.log("DB_Connected Successfully")
}).catch(()=>{
    console.log("Not connected")
})
return conn;
}
module.exports=DBConnection