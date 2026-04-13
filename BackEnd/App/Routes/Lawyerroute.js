let express=require("express");
const multer = require("multer");
let{addlawyer,getlawyers,idlawyer,statuslawyer,deletelawyer,loginlawyer,IDlawyer,filterlawyers }=require("../Controllers/lawyer_cont.js")
let lawyerrouter=express.Router();
const { editLawyerProfile } = require("../Controllers/lawyer_cont.js");
// console.log("editLawyerProfile type:", typeof editLawyerProfile);
// console.log("editLawyerProfile value:", editLawyerProfile);
const memoryStorage = multer.memoryStorage();

const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "application/pdf"
    ) {
      cb(null, true);
    } else {
      cb(new Error("Only JPEG, PNG, or PDF files are allowed"));
    }
  },
});


const lawyerUploadFields = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
  { name: "llb", maxCount: 1 },
  {name:"barCouncilCard",maxCount:1}
]);


lawyerrouter.post("/add", lawyerUploadFields, addlawyer);// frontend side to register lawyer
lawyerrouter.get("/get",getlawyers) // for getting all lawyers on Admin and frontend side
lawyerrouter.get("/idlawyer/:id",idlawyer) //Admin Side Viewing Lawyer profile
lawyerrouter.patch("/idlawyer/:id/status",statuslawyer)
lawyerrouter.delete("/deletelawyer/:id",deletelawyer)//admin side to delete lawyer
lawyerrouter.post("/login",loginlawyer)// for logging in 
lawyerrouter.patch("/idlawyer/:id", editLawyerProfile); // for Editing Lawyer profile
lawyerrouter.get("/filter", filterlawyers); // for filtering lawyers based on criteria
module.exports={lawyerrouter}