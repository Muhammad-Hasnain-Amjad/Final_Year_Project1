import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios'
import { toast } from 'react-toastify'
import ShowModel from "../Components/ShowModel";
import TempMessage from "../Components/TempMessage";
import Loader from "../Components/Loader";
export default function Dr_Reg() {
        const BaseURL="http://localhost:5000/doctor"
 const[isOpen,setIsOpen]=useState(false)
 const [statusMessage, setStatusMessage] = useState("");

 const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    clinic: "",
    pmdc: "",
    
    username: "",
    password: "",
    
  });
  const[image,setImage]=useState({
    cnicFront:null,
    cnicBack:null,
    degree:null,
    profilePic:null,
    pmdcCert:null,

  })

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  function handleimage(e){
    const{name,files}=e.target;
if(files){
  setImage(prev => ({
  ...prev,
  [name]: files[0]
}));

}
  }
 
async  function handleSubmit (e)  {
  e.preventDefault();
 setLoading(true)
  const form = new FormData();

  // text fields
  form.append("fullName", formData.fullName);
  form.append("email", formData.email);
  form.append("phoneNumber", formData.phone);
  form.append("specialization", formData.specialization);
  form.append("experience", formData.experience);
  form.append("clinicHospital", formData.clinic);
  form.append("pmdcNumber", formData.pmdc);
  form.append("username", formData.username);
  form.append("password", formData.password);

  // image fields (VERY IMPORTANT PART)
  form.append("cnicFront", image.cnicFront);
  form.append("cnicBack", image.cnicBack);
  form.append("medicalDegree", image.degree);
  form.append("profilePic", image.profilePic);
  form.append("pmdcCertificate", image.pmdcCert);
    const result = await axios.post(BaseURL + "/add", form);
    setLoading(false)
     if (result.data.success) {
          
          toast.success(" Doctor  Registered Successfully");
 setFormData({
  fullName: "",
  email: "",
  phone: "",
  specialization: "",
  experience: "",
  clinic: "",
  pmdc: "",
  username: "",
  password: "",
});

setImage({
  cnicFront: null,
  cnicBack: null,
  degree: null,
  profilePic: null,
  pmdcCert: null,
});

          setStatusMessage("registered")
          setIsOpen(true)
          
        } else {
          if (result.data.message === "ALREADY_VERIFIED") {
    setStatusMessage("verified");   // case 2
    setIsOpen(true);
  } 
  else if (result.data.message === "UNDER_REVIEW") {
    setStatusMessage("pending");     // case 3
    setIsOpen(true);
  } else {
    toast.error(result.data.message);
  }
          

        }


};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-6">
      <Loader show={loading} />

      <ShowModel isopen={isOpen} setisopen={setIsOpen}>
  <TempMessage type={statusMessage} setIsOpen={setIsOpen} />
</ShowModel>
      <form
        onSubmit={handleSubmit}
        className="bg-black focus:border border-yellow-400 shadow-[0_0_20px_rgba(255,230,0,0.5)] rounded-xl p-8 w-full max-w-4xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-yellow-400">
          Doctor Registration
        </h2>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* PERSONAL */}
          <div className="border border-yellow-400 bg-[#0f0f0f] rounded-xl p-5 shadow-inner shadow-yellow-700">
            <h3 className="text-xl font-semibold mb-3 text-yellow-300">
              Personal Information
            </h3>

            <label className="block mb-2 text-sm text-white">Full Name</label>
            <input
              type="text"
              name="fullName"
              onChange={handleChange}
              className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            <label className="block mb-2 text-sm text-white">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              className="w-full p-2 rounded bg.white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            <label className="block mb-2 text-sm text-white">Phone Number</label>
            <input
              type="text"
              name="phone"
              onChange={handleChange}
              className="w-full p-2 rounded bg-white outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* PROFESSIONAL */}
          <div className="border border-yellow-400 bg-[#0f0f0f] rounded-xl p-5 shadow-inner shadow-yellow-700">
            <h3 className="text-xl font-semibold mb-3 text-yellow-300">
              Professional Information
            </h3>

        <label className="block mb-3">
              <span className="text-sm">Specialization</span>
              <select
                required
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="">Dermatologist</option>
                <option>Gastroenterologist</option>
                <option>General_physician</option>
                <option>Neurologist</option>
                <option>Pediatricians</option>
                                <option>Gynecologist</option>

              </select>
            </label>

         

            <label className="block mb-2 text-sm text-white">Experience (Years)</label>
            <input
              type="number"
              name="experience"
              onChange={handleChange}
              className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            <label className="block mb-2 text-sm text-white">Clinic / Hospital</label>
            <input
              type="text"
              name="clinic"
              onChange={handleChange}
              className="w-full p-2 rounded bg-white outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />
          </div>

          {/* VERIFICATION */}
          {/* VERIFICATION */}
<div className="border border-yellow-400 bg-[#0f0f0f] rounded-xl p-5 shadow-inner shadow-yellow-700">
  <h3 className="text-xl font-semibold mb-3 text-yellow-300">
    Verification Documents
  </h3>

  <label className="block mb-2 text-sm text-white">PMDC / PMC Number</label>
  <input
    type="text"
    name="pmdc"
    onChange={handleChange}
    className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
    required
  />

  <label className="block mb-2 text-sm text-white">
    Upload PMDC / PMC Certificate
  </label>
  <input
    type="file"
    name="pmdcCert"
    onChange={handleimage}
    className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
    required
  />

  <label className="block mb-2 text-sm text-white">
    Upload Medical Degree (MBBS / FCPS)
  </label>
  <input
    type="file"
    name="degree"
    onChange={handleimage}
    className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
    required
  />

  {/* 🔥 FIXED CNIC FIELDS */}
  <label className="block mb-2 text-sm text-white">CNIC Front</label>
  <input
    type="file"
    name="cnicFront"
    onChange={handleimage}
    className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
    required
  />

  <label className="block mb-2 text-sm text-white">CNIC Back</label>
  <input
    type="file"
    name="cnicBack"
    onChange={handleimage}
    className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
    required
  />

  {/* 🔥 FIXED PROFILE PIC FIELD */}
  <label className="block mb-2 text-sm text-white">Profile Picture</label>
  <input
    type="file"
    name="profilePic"
    onChange={handleimage}
    className="w-full p-2 rounded bg-white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
    required
  />
</div>


          {/* ACCOUNT */}
          <div className="border border-yellow-400 bg-[#0f0f0f] rounded-xl p-5 shadow-inner shadow-yellow-700">
            <h3 className="text-xl font-semibold mb-3 text-yellow-300">
              Account Setup
            </h3>

            <label className="block mb-2 text-sm text-white">Username</label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              className="w-full p-2 rounded bg.white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            <label className="block mb-2 text-sm text-white">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              className="w-full p-2 rounded bg.white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

           
          </div>

        </div>

       <div className="mt-10 text-center space-x-4 ">
         <button
          type="submit"
         className="bg-yellow-400 text-black font-semibold py-3 px-10 rounded-md hover:bg-yellow-500 transition"
        >
          Register as Doctor
        </button>
        <Link
     to="/"
     className="text-yellow-400 hover:underline hover:text-white"
   >
     Go to Home
   </Link>
       </div>
      </form>
    </div>
  );
}
