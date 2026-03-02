const drmodel = require("../Models/drmodel"); // imported model
const uploadFile=require("../../Utils/upLoadfile")


async function addDoctor(req, res) {
  try {
    const {
      fullName,
      email,
      phoneNumber,
      specialization,
      experience,
      clinicHospital,
      pmdcNumber,
      username,
      password
    } = req.body;

    // ✅ Safe access to files
    const profilePic = req.files?.profilePic?.[0];
    const cnicFront = req.files?.cnicFront?.[0]; 
    const cnicBack = req.files?.cnicBack?.[0];
    const pmdcCertificate = req.files?.pmdcCertificate?.[0];
    const medicalDegree = req.files?.medicalDegree?.[0];

    if (!profilePic || !cnicFront || !cnicBack || !pmdcCertificate || !medicalDegree) {
      return res.status(400).json({ message: "All files are required!" });
    }

    // ✅ Check existing email
    const isExist = await drmodel.findOne({ "registration.email": email });
    if (isExist) {
      if (isExist.status.isVerified) {
        console.log("Already Exist")
        return res.status(400).json({ message: "ALREADY_VERIFIED" });
      } else {

        return res.status(200).json({ status: false, message: "UNDER_REVIEW" });
      }
    }
    const isExist_username = await drmodel.findOne({ "registration.username": username });
    if (isExist_username) {
      if (isExist_username.status.isVerified) {
        console.log("Already Exist")
        return res.status(400).json({ message: "ALREADY_VERIFIED" });
      } else {

        return res.status(200).json({ status: false, message: "UNDER_REVIEW" });
      }
    }

    const folder = `doctors/${email}`;
    const [
      profilePicResult,
      cnicFrontResult,
      cnicBackResult,
      pmdcCertificateResult,
      medicalDegreeResult
    ] = await Promise.all([
      uploadFile(profilePic, `${folder}/profilePic`),
      uploadFile(cnicFront, `${folder}/cnicFront`),
      uploadFile(cnicBack, `${folder}/cnicBack`),
      uploadFile(pmdcCertificate, `${folder}/pmdcCertificate`),
      uploadFile(medicalDegree, `${folder}/medicalDegree`)
    ]);

    const doctor = new drmodel({
      registration: {
        fullName,
        email,
        phoneNumber,
        specialization,
        experience,
        clinicHospital,
        pmdcNumber,
        username,
        password,
        profilePic: profilePicResult.secure_url,
        cnicFront: cnicFrontResult.secure_url,
        cnicBack: cnicBackResult.secure_url,
        pmdcCertificate: pmdcCertificateResult.secure_url,
        medicalDegree: medicalDegreeResult.secure_url
      }
    });

    // ✅ Save doctor safely
    try {
      await doctor.save();
    } catch (err) {
      console.log(err.toString())
    }

    res.status(201).json({ success: true, message: "Doctor registered successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

module.exports = { addDoctor };

