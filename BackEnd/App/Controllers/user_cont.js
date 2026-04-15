const jwt=require('jsonwebtoken')
const bcrypt=require('bcrypt')
const usermodel=require("../Models/usermodel.js")
const validator=require('validator')
//Token
function Genusertoken(id){
    const secret = process.env.jwtkey;
  if (!secret) throw new Error("JWT secret key is missing!");
    return jwt.sign({id},secret)
}

//login user
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Validate email
    if (!validator.isEmail(email)) {
      return res.json({ status: false, message: "Please enter a valid email" });
    }

    // Find user in DB
    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.json({ status: false, message: "Invalid User" });
    }

    // Compare password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.json({ status: false, message: "Invalid Password!" });
    }

    // Generate token
    const usertoken = Genusertoken(user._id);
//Generate name
  
    // Send success
    res.json({ status: true, usertoken:usertoken,name:user.name ,id:user._id });
  } catch (e) {
    console.error(e);
    res.json({ status: false, message: e.toString() });
  }
}


//register user
async function registerUser(req,res){
   try{
    let {name,email,password}=req.body;
    console.log(name ,"", email," ",password )
   let exist= await usermodel.findOne({email})
   if(exist){
  return  res.json({status:false,message:"User Already Exist"})
   }
   if(!validator.isEmail(email)){
return    res.json({status:false,message:"Please Enter Valid Email"})
   }
   if(password.length <8){
  return  res.json({status:false,message:"Enter atleast 8 characters"})
   }
     let salt= await bcrypt.genSalt(10)
     let newpassword=await bcrypt.hash(password,salt)
     let user=await usermodel({
        name,email,
        password:newpassword,
          


     })
    let newuser=await user.save()
    let usertoken=Genusertoken(newuser._id)
return    res.json({status:true,usertoken})
   }catch(e){
    console.log(e.toString())
return  res.json({status:false,message:"Error"})

   }
}
async function allusers(req,res){
 let allusers=await usermodel.find()
  return res.json({status:true,allusers})
}
 
 module.exports={loginUser,registerUser,allusers}