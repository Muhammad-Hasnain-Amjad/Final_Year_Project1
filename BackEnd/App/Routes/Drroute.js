const multer = require("multer");
const{addDoctor}=require("../Controllers/dr_cont")
const express = require("express");
const Drrouter = express.Router();
const memory = multer.memoryStorage();

const upload = multer({
  storage: memory,
  limits: { fileSize: 2 * 1024 * 1024 }, 
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
  }
});

// Define fields expected from frontend
const doctorUploadFields = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "cnicFront", maxCount: 1 },
  { name: "cnicBack", maxCount: 1 },
  { name: "pmdcCertificate", maxCount: 1 },
  { name: "medicalDegree", maxCount: 1 }
]);



Drrouter.post("/add", doctorUploadFields, addDoctor);

module.exports = Drrouter;
