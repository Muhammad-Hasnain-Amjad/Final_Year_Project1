import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loader from '../Components/Loader'
import ShowModel from "../Components/ShowModel";
import TempMessage from "../Components/TempMessage";
export default function Law_Reg() {
  const BaseURL = "http://localhost:5000/lawyer";
 const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(true);
const[isOpen,setIsOpen]=useState(false)
 const [statusMessage, setStatusMessage] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    cnic: "",
    phoneNumber: "",
    email: "",
    barCouncilNumber: "",
    membershipType: "",
    yearOfEnrollment: "",
    practiceAreas: [],
    experience: "",
    courtLevel: "",
    officeAddress: "",
    username: "",
    password: "",
  });

  const [image, setImage] = useState({
    cnicFront: null,
    cnicBack: null,
    llb: null,
    profilePic: null,
    barCouncilCard: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "practiceAreas") {
      setForm({ ...form, practiceAreas: value.split(",").map((a) => a.trim()) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleImage = (e) => {
    const { name, files } = e.target;
    if (files) {
      setImage((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  setLoading(true)
    const formData = new FormData();

    // Append text fields
    formData.append("fullName", form.fullName);
    formData.append("cnic", form.cnic);
    formData.append("phoneNumber", form.phoneNumber);
    formData.append("email", form.email);
    formData.append("barCouncilNumber", form.barCouncilNumber);
    formData.append("membershipType", form.membershipType);
    formData.append("yearOfEnrollment", form.yearOfEnrollment);
    formData.append("practiceAreas", form.practiceAreas.join(",")); // convert array to string
    formData.append("experience", form.experience);
    formData.append("courtLevel", form.courtLevel);
    formData.append("officeAddress", form.officeAddress);
    formData.append("username", form.username);
    formData.append("password", form.password);

    // Append images
    formData.append("cnicFront", image.cnicFront);
    formData.append("cnicBack", image.cnicBack);
    formData.append("llb", image.llb);
    formData.append("profilePic", image.profilePic);
    formData.append("barCouncilCard", image.barCouncilCard);

    try {
      const result = await axios.post(BaseURL + "/add", formData);
   setLoading(false)
      if (result.data.success) {
        // Clear form and images
        setForm({
          fullName: "",
          cnic: "",
          phoneNumber: "",
          email: "",
          barCouncilNumber: "",
          membershipType: "",
          yearOfEnrollment: "",
          practiceAreas: [],
          experience: "",
          courtLevel: "",
          officeAddress: "",
          username: "",
          password: "",
        });

        setImage({
          cnicFront: null,
          cnicBack: null,
          llb: null,
          profilePic: null,
          barCouncilCard: null,
        });

        toast.success("Lawyer Registered Successfully");
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
    } catch (err) {
      toast.error("❌ Server Error");
      console.error(err);
    }
  };

  return (
    <div className="bg-black text-white px-6 py-12 flex justify-center">
       <Loader show={loading} />
<ShowModel isopen={isOpen} setIsOpen={setIsOpen}>
  <TempMessage type={statusMessage} setIsOpen={setIsOpen} />
</ShowModel>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-black p-8 rounded-2xl border border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.4)]"
      >
        <h1 className="text-3xl font-bold text-center mb-10 text-yellow-400">
          Lawyer Registration
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Personal Info */}
          <div className="bg-black p-6 rounded-xl border border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">
              Personal Information
            </h2>

            <label className="block mb-3">
              <span className="text-sm">Full Name</span>
              <input
                type="text"
                required
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Your full name"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">CNIC</span>
              <input
                type="text"
                required
                name="cnic"
                value={form.cnic}
                onChange={handleChange}
                placeholder="12345-1234567-1"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Phone Number</span>
              <input
                type="text"
                required
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                placeholder="03XX-XXXXXXX"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Email</span>
              <input
                type="email"
                required
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>
          </div>

          {/* Bar Council Details */}
          <div className="bg-black p-6 rounded-xl border border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">
              Bar Council Details
            </h2>

            <label className="block mb-3">
              <span className="text-sm">Bar Council Number</span>
              <input
                type="text"
                required
                name="barCouncilNumber"
                value={form.barCouncilNumber}
                onChange={handleChange}
                placeholder="PBC-XXXX"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Membership Type</span>
              <select
                required
                name="membershipType"
                value={form.membershipType}
                onChange={handleChange}
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="">Select Type</option>
                <option>Advocate</option>
                <option>Advocate High Court</option>
                <option>Advocate Supreme Court</option>
              </select>
            </label>

            <label className="block mb-3">
              <span className="text-sm">Year of Enrollment</span>
              <input
                type="number"
                required
                name="yearOfEnrollment"
                value={form.yearOfEnrollment}
                onChange={handleChange}
                placeholder="2020"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Bar Council Card</span>
              <input
                onChange={handleImage}
                name="barCouncilCard"
                type="file"
                required
                className="w-full bg-white text-black px-2 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>
          </div>

          {/* Practice Details */}
          <div className="bg-black p-6 rounded-xl border border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">
              Practice Details
            </h2>

            <label className="block mb-3">
              <span className="text-sm">Practice Areas</span>
              <input
                type="text"
                required
                name="practiceAreas"
                value={form.practiceAreas.join(", ")}
                onChange={handleChange}
                placeholder="Civil, Criminal, Family..."
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Experience (Years)</span>
              <input
                type="number"
                required
                name="experience"
                value={form.experience}
                onChange={handleChange}
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-3">
              <span className="text-sm">Court Level</span>
              <select
                required
                name="courtLevel"
                value={form.courtLevel}
                onChange={handleChange}
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              >
                <option value="">Select Court</option>
                <option>District Court</option>
                <option>High Court</option>
                <option>Supreme Court</option>
                <option>Special Courts</option>
              </select>
            </label>

            <label className="block mb-3">
              <span className="text-sm">Office Address</span>
              <input
                type="text"
                required
                name="officeAddress"
                value={form.officeAddress}
                onChange={handleChange}
                placeholder="Chamber / Office location"
                className="w-full bg-white text-black px-4 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>
          </div>

          {/* Verification Docs */}
          <div className="bg-black p-6 rounded-xl border border-yellow-400 shadow-[0_0_25px_rgba(250,204,21,0.3)]">
            <h2 className="text-xl font-semibold mb-4 text-yellow-300">
              Verification Documents
            </h2>

            <label className="block mb-4">
              <span className="text-sm">CNIC Front</span>
              <input
                onChange={handleImage}
                name="cnicFront"
                type="file"
                required
                className="w-full bg-white text-black px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm">CNIC Back</span>
              <input
                onChange={handleImage}
                name="cnicBack"
                type="file"
                required
                className="w-full bg-white text-black px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block mb-4">
              <span className="text-sm">Profile Picture</span>
              <input
                onChange={handleImage}
                name="profilePic"
                type="file"
                required
                className="w-full bg-white text-black px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>

            <label className="block">
              <span className="text-sm">LLB / License Documents</span>
              <input
                name="llb"
                type="file"
                onChange={handleImage}
                required
                className="w-full bg-white text-black px-3 py-2 rounded mt-1 focus:ring-2 focus:ring-yellow-400 outline-none"
              />
            </label>
          </div>

          {/* Account */}
          <div className="border border-yellow-400 bg-[#0f0f0f] rounded-xl p-5 shadow-inner shadow-yellow-700 relative">
            <h3 className="text-xl font-semibold mb-3 text-yellow-300">
              Account Setup
            </h3>

            <label className="block mb-2 text-sm ">Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              className="w-full p-2 text-black rounded bg.white mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
              required
            />

            <label className="block mb-2 text-sm ">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full p-2 rounded bg-white text-black mb-3 outline-none focus:ring-2 focus:ring-yellow-400"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-2 text-sm text-gray-700"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center space-x-4">
          <button
            type="submit"
            className="bg-yellow-400 text-black font-semibold py-3 px-10 rounded-md hover:bg-yellow-500 transition"
          >
            Submit Registration
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
