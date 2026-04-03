let lawyermodel=require("../Models/Lawyermodel.js")
const uploadFile=require("../../Utils/upLoadfile")
const { deleteCloudinaryFiles } = require("../../Utils/Cloudinary.js")
const sendEmail=require("../../Utils/sendEmail.js")
 const jwt = require("jsonwebtoken");

async function addlawyer(req, res) {
  try {
    const {
      fullName,
      cnic,
      phoneNumber,
      email,
      barCouncilNumber,
      membershipType,
      yearOfEnrollment,
      practiceAreas,
      experience,
      courtLevel,
      officeAddress,
      username,
      password
    } = req.body;

    
    const profilePic = req.files?.profilePic?.[0];
    const cnicFront = req.files?.cnicFront?.[0];
    const cnicBack = req.files?.cnicBack?.[0];
    const llb = req.files?.llb?.[0];
    const barCouncilCard = req.files?.barCouncilCard?.[0];


    if (!profilePic || !cnicFront || !cnicBack || !llb || !barCouncilCard) {
      return res.status(400).json({ message: "All files are required!" });
    }
    const isExist = await lawyermodel.findOne({
      "registration.email": email
    });

    if (isExist) {
      // ❗ FIX 2: correct path
      if (isExist.registration.verified) {
        return res.json({
          success: false,
          message: "ALREADY_VERIFIED"
        });
      } else {
        return res.json({
          success: false,
          message: "UNDER_REVIEW"
        });
      }
    }
     const folder = `lawyers/${email}`;
    
        const [
          profilePicResult,
          cnicFrontResult,
          cnicBackResult,
          llbResult,
          barCouncilCardResult
        ] = await Promise.all([
          uploadFile(profilePic, `${folder}/profilePic`),
          uploadFile(cnicFront, `${folder}/cnicFront`),
          uploadFile(cnicBack, `${folder}/cnicBack`),
          uploadFile(llb, `${folder}/llb`),
          uploadFile(barCouncilCard, `${folder}/barCouncilCard`)
        ]);

    // Create lawyer
    let lawyer = new lawyermodel({
      registration: {
        fullName,
        cnic,
        phoneNumber,
        email,
        barCouncilNumber,
        membershipType,
        yearOfEnrollment,
        practiceAreas: Array.isArray(practiceAreas)
          ? practiceAreas
          : practiceAreas.split(",").map(a => a.trim()),
        experience,
        courtLevel,
        officeAddress,
        username,
        password, 
        profilePic: {
  url: profilePicResult.secure_url,
  public_id: profilePicResult.public_id
},
        cnicFront: {url :cnicFrontResult.secure_url, public_id:cnicFrontResult.public_id},
        cnicBack: {
      url: cnicBackResult.secure_url,
      public_id: cnicBackResult.public_id
    },
    llb: {
      url: llbResult.secure_url,
      public_id: llbResult.public_id
    },
    barCouncilCard: {
      url: barCouncilCardResult.secure_url,
      public_id: barCouncilCardResult.public_id
    }
      }
    });

    await lawyer.save();

    console.log("Lawyer saved successfully");

    return res.status(201).json({
      success: true,
      message: "Lawyer added successfully"
    });

  } catch (e) {
    console.error(e);
    return res.status(500).json({
      success: false,
      message: "Error while adding lawyer"
    });
  }
}
async function getlawyers(req,res){
  //npm install react-loading-skeleton
  let lawyers=await lawyermodel.find()
  if(lawyers){
    
    return res.json({success:true ,data:lawyers})
  }
  else {
    return res.json({success:false ,message:"Couldnt get lawyers"})
  }
}
async function idlawyer(req,res){
  try {
    const { id } = req.params; // <-- get the dynamic ID from URL

    const lawyer = await lawyermodel.findById(id); // MongoDB search by _id

    if (!lawyer) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }

    return res.json({ success: true, data: lawyer });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
async function statuslawyer(req, res) {
  try {
    const { id } = req.params;          
    const { status } = req.body;       

    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedLawyer = await lawyermodel.findByIdAndUpdate(
      id,
      {
        $set: {
          "status.isVerified": status,
          "status.verificationDate": new Date()
        }
      },
      { new: true }
    );
  
    if (!updatedLawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }
    let updatedemail=updatedLawyer.registration.email
    let updatedstatus=updatedLawyer.status.isVerified
    const updatedname = updatedLawyer.registration.fullName;
if(updatedstatus=="verified"){
await sendEmail(updatedemail,"Account Approved",
  `
  <h2>Hello ${updatedname},</h2>
          <p>Congratulations! Your account has been approved.</p>
          <p>You can now login and complete your profile.</p>
          <br/>
          <p>Best Regards,<br/>Cure&Counsel</p>
  `
)
}
else if(updatedstatus=="rejected"){
await sendEmail(
        updatedemail,
        "Application Update",
        `
          <h2>Hello ${updatedname},</h2>
          <p>We are sorry to inform you that your application was not approved.</p>
          <p>You may contact support for further details.</p>
          <br/>
          <p>Best Regards,<br/>Cure&Counsel Team</p>
        `
      );
}
 
    res.status(200).json({
      message: "Status updated & email sent",
      data: updatedLawyer,
    });
 console.log("accepted")
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
}
async function deletelawyer(req,res){
  try {
    const { id } = req.params;

    // Find lawyer by ID
    const lawyer = await lawyermodel.findById(id);
    console.log(id)
    if (!lawyer) {
      return res.status(404).json({ success: false, message: "Lawyer not found" });
    }

    // Collect public_ids
    const images = [
      lawyer.registration.profilePic?.public_id,
      lawyer.registration.cnicFront?.public_id,
      lawyer.registration.cnicBack?.public_id,
      lawyer.registration.llb?.public_id,
      lawyer.registration.barCouncilCard?.public_id
    ];

     let deletedemail=lawyer.registration.email
     let deletedname=lawyer.registration.fullName
    await deleteCloudinaryFiles(images);

    // Delete lawyer record
await lawyer.deleteOne();
 await sendEmail(
  deletedemail,"Account Update",
     `
          <h2>Hello ${deletedname},</h2>
          <p>We are sorry to inform you that <br/>your account has been deleted.</p>
          <p>You may contact support for further details.</p>
          <br/>
          <p>Best Regards,<br/>Cure&Counsel Team</p>
        `
 )
    return res.status(200).json({ success: true, message: "Account deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

async function loginlawyer(req, res) {
  let accountid = null;

  try {
    const { email, password } = req.body;

    const lawyer = await lawyermodel.findOne({ "registration.email": email });

    if (!lawyer) {
      return res.status(404).json({
        status: false,
        id: accountid,
        message: "Lawyer not found",
      });
    }

    if (lawyer.registration.password != password) {
      return res.status(400).json({
        status: false,
        id: accountid,
        message: "Invalid password",
      });
    }

    accountid = lawyer._id;

    // TOKEN GENERATION
    const token = jwt.sign(
      {
        id: lawyer._id,
        role: "lawyer",
        email: lawyer.registration.email,
      },
     process.env.lawyer_key,   // put this in .env in production
      { expiresIn: "7d" }
    );

    return res.json({
      status: true,
      id: accountid,
      name: lawyer.registration.fullName,
      usertoken: token,
      message: "Login successful",
    });

  } catch (err) {
    res.status(500).json({
      status: false,
      message: err.message,
    });
  }
}
 async function IDlawyer(req, res) {
  try {

    const { id } = req.params;

    const lawyer = await lawyermodel.findById(id);

    if (!lawyer) {
      return res.status(404).json({
        success: false,
        message: "Lawyer not found"
      });
    }

    return res.status(200).json({
      success: true,
      data: lawyer
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });

  }
}


// PATCH update lawyer



async function editLawyerProfile(req, res){
  try {
    const {
      about,
      fee,
      membershipType,
      officeAddress,
      practiceAreas,
      courtLevel
    } = req.body;

    const lawyer = await lawyermodel.findById(req.params.id);

    if (!lawyer) {
      return res.status(404).json({ status: false, message: "Lawyer not found" });
    }

    // Update profile fields
    if (about !== undefined) lawyer.profile.about = about;
    if (fee !== undefined) lawyer.profile.fee = fee;

    // Update registration fields
    if (membershipType !== undefined) lawyer.registration.membershipType = membershipType;
    if (officeAddress !== undefined) lawyer.registration.officeAddress = officeAddress;
    if (practiceAreas !== undefined) lawyer.registration.practiceAreas = practiceAreas;
    if (courtLevel !== undefined) lawyer.registration.courtLevel = courtLevel;

    await lawyer.save();

    res.json({
      status:true,
      message: "Profile updated successfully",
      data: lawyer
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}; 


module.exports={addlawyer,getlawyers,idlawyer,statuslawyer,deletelawyer,loginlawyer,IDlawyer,editLawyerProfile}