let express=require("express");
const multer = require("multer");
let{addlawyer,getlawyers,idlawyer,statuslawyer,deletelawyer,loginlawyer,IDlawyer}=require("../Controllers/lawyer_cont.js")
let lawyerrouter=express.Router();


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


lawyerrouter.post("/add", lawyerUploadFields, addlawyer);
lawyerrouter.get("/get",getlawyers)
lawyerrouter.get("/idlawyer/:id",idlawyer)
lawyerrouter.patch("/idlawyer/:id/status",statuslawyer)
lawyerrouter.delete("/deletelawyer/:id",deletelawyer)
lawyerrouter.post("/login",loginlawyer)
lawyerrouter.get("/idlawyer/:id",IDlawyer)

module.exports={lawyerrouter}