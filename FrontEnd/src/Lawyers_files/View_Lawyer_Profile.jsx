import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaCommentDots, FaHome, FaCalendarAlt, FaEdit, FaSave, FaUser, FaIdCard, FaPhone, FaEnvelope, FaGavel, FaBuilding } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";
import Select from "react-select";
import LawyerComments from './LawyerComments'

const IconButton = ({ icon, label, onClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <motion.button
        onClick={onClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.95 }}
        className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-black p-3 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {icon}
      </motion.button>

      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 bg-gray-900 text-yellow-400 text-xs px-2 py-1 rounded-md whitespace-nowrap shadow-md"
        >
          {label}
        </motion.div>
      )}
    </div>
  );
};

function View_Lawyer_Profile() {
    const practiceAreaOptions = [
  { value: "Property / Land", label: "Property / Land" },
  { value: "Family Issues", label: "Family Issues" },
  { value: "Criminal & Court Case", label: "Criminal & Court Case" },
  { value: "Cyber Crime", label: "Cyber Crime" },
  { value: "Immigration", label: "Immigration" },
  { value: "Employer Issues", label: "Employer Issues" },
  { value: "Tax Issues", label: "Tax Issues" },
  { value: "Torture", label: "Torture" },
  { value: "Business / Industrial", label: "Business / Industrial" }
];

const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#1f1f1f",
    borderColor: state.isFocused ? "#facc15" : "#3f3f3f",
    boxShadow: state.isFocused ? "0 0 0 1px #facc15" : "none",
    padding: "4px",
    borderRadius: "0.75rem",
    color: "#fff",
    "&:hover": {
      borderColor: "#facc15"
    }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: "#1f1f1f",
    borderRadius: "0.75rem",
    overflow: "hidden",
    zIndex: 9999,
    border: "1px solid #3f3f3f"
  }),
  menuList: (base) => ({
    ...base,
    backgroundColor: "#1f1f1f",
    padding: "4px"
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#facc15" : "#1f1f1f",
    color: state.isFocused ? "#000" : "#fff",
    cursor: "pointer",
    borderRadius: "0.5rem",
    margin: "2px 4px",
    "&:active": {
      backgroundColor: "#eab308"
    }
  }),
  singleValue: (base) => ({
    ...base,
    color: "#fff"
  }),
  input: (base) => ({
    ...base,
    color: "#fff"
  }),
  placeholder: (base) => ({
    ...base,
    color: "#9ca3af"
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "#facc15",
    borderRadius: "0.5rem"
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: "#000",
    fontWeight: "600",
    padding: "4px 8px"
  }),
  multiValueRemove: (base) => ({
    ...base,
    color: "#000",
    borderRadius: "0 0.5rem 0.5rem 0",
    ":hover": {
      backgroundColor: "#eab308",
      color: "#000"
    }
  })
};

  const { id } = useParams();
  const navigate = useNavigate();
  const BaseURL = "http://localhost:5000/lawyer";
  const [editLoading, seteditLoading] = useState(false);
  const [lawyer, setLawyer] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    about: "",
    fee: "",
    membershipType: "",
    officeAddress: "",
    practiceAreas: [],
    courtLevel: ""
  });

  const fetchLawyer = async () => {
    try {
      const res = await axios.get(`${BaseURL}/idlawyer/${id}`);
      const data = res.data.data;
      setLawyer(data);
      setFormData({
        about: data.profile.about || "",
        fee: data.profile.fee || "",
        membershipType: data.registration.membershipType || "",
        officeAddress: data.registration.officeAddress || "",
        practiceAreas: data.registration.practiceAreas || [],
        courtLevel: data.registration.courtLevel || ""
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleProfile = async () => {
    if (!editMode) {
      setEditMode(true);
    } else {
      try {
        let result = await axios.patch(`${BaseURL}/idlawyer/${id}`, {
          about: formData.about,
          fee: formData.fee,
          membershipType: formData.membershipType,
          officeAddress: formData.officeAddress,
          practiceAreas: formData.practiceAreas,
          courtLevel: formData.courtLevel
        });
        seteditLoading(true);
        if (result) {
          seteditLoading(false);
          toast.success(result.data.message);
          setEditMode(false);
          setLawyer(result.data.data);
        } else {
          toast.error(result.data.message);
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  const handleProfileChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  useEffect(() => {
    fetchLawyer();
  }, [id]);

  if (!lawyer) return <Loader />;

  const { registration, profile, status, comments } = lawyer;

  const avgRating =
    comments?.length > 0
      ? (comments.reduce((a, b) => a + b.rating, 0) / comments.length).toFixed(1)
      : "No rating";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {editLoading && <Loader />}
      
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8 pb-8">
            
            {/* Left Section - Profile Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col md:flex-row items-center gap-6"
            >
              {!editMode && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur-xl opacity-50"></div>
                  <img
                    src={registration.profilePic?.url}
                    alt="profile"
                    className="relative w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-yellow-400 shadow-2xl"
                  />
                  {status.isVerified === "verified" && (
                    <div className="absolute bottom-2 right-2 bg-green-500 rounded-full p-1.5 border-2 border-black">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
              
              <div className="text-center md:text-left">
                {!editMode && (
                  <>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                      {registration.fullName}
                    </h1>
                    <div className="flex flex-wrap items-center gap-3 mt-2 justify-center md:justify-start">
                      <p className="text-gray-400 flex items-center gap-1">
                        <FaIdCard className="text-yellow-400" /> {registration.barCouncilNumber}
                      </p>
                      <p className="text-gray-400 flex items-center gap-1">
                        <FaUser className="text-yellow-400" /> @{registration.username}
                      </p>
                    </div>
                  </>
                )}
                
                <div className="flex justify-center md:justify-start items-center gap-3 mt-3">
                  <div className="flex items-center gap-1 bg-yellow-500/20 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-400" />
                    <span className="font-semibold text-yellow-400">{avgRating}</span>
                    {typeof avgRating !== "string" && <span className="text-gray-400 text-sm">/5</span>}
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    status.isVerified === "verified" 
                      ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                      : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                  }`}>
                    {status.isVerified === "verified" ? "✓ Verified" : "⏳ Pending"}
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${
                    status.isActive 
                      ? "bg-green-500/20 text-green-400 border border-green-500/50" 
                      : "bg-gray-500/20 text-gray-400 border border-gray-500/50"
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${status.isActive ? "bg-green-400 animate-pulse" : "bg-gray-400"}`}></span>
                    {status.isActive ? "Online" : "Offline"}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Section - Action Buttons */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="flex gap-3 flex-wrap justify-center">
                <IconButton icon={<FaHome />} label="Home" onClick={() => navigate("/")} />
                <IconButton icon={<FaCalendarAlt />} label="Appointments" onClick={() => navigate("/appointments")} />
                <IconButton icon={<FaCommentDots />} label="Chat" onClick={() => {}} />
                <IconButton icon={<FaMapMarkerAlt />} label="Location" onClick={() => {}} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Professional Details Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden shadow-xl"
          >
            <div className="bg-gradient-to-r from-yellow-500/20 to-transparent px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <FaGavel /> Professional Details
              </h2>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">About</label>
                <textarea
                  rows={4}
                  value={formData.about}
                  onChange={(e) => handleProfileChange("about", e.target.value)}
                  disabled={!editMode}
                  className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-white disabled:opacity-60 transition-all"
                  placeholder="Tell us about your professional background..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-2">Fee (PKR)</label>
                  <input
                    type="number"
                    value={formData.fee}
                    onChange={(e) => handleProfileChange("fee", e.target.value)}
                    disabled={!editMode}
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-white disabled:opacity-60 transition-all"
                    placeholder="Enter consultation fee"
                  />
                </div>

                <div>
                  <label className="text-gray-400 text-sm font-medium block mb-2">Court Level</label>
                  <input
                    type="text"
                    value={formData.courtLevel}
                    onChange={(e) => handleProfileChange("courtLevel", e.target.value)}
                    disabled={!editMode}
                    className="w-full p-3 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-white disabled:opacity-60 transition-all"
                    placeholder="e.g., Supreme Court, High Court"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Office Address</label>
                <div className="relative">
                  <FaBuilding className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    type="text"
                    value={formData.officeAddress}
                    onChange={(e) => handleProfileChange("officeAddress", e.target.value)}
                    disabled={!editMode}
                    className="w-full p-3 pl-10 rounded-xl bg-gray-900 border border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none text-white disabled:opacity-60 transition-all"
                    placeholder="Full office address"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm font-medium block mb-2">Practice Areas</label>
                <Select
                  isMulti
                  options={practiceAreaOptions}
                  styles={customStyles}
                  isDisabled={!editMode}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  value={practiceAreaOptions.filter(opt =>
                    formData.practiceAreas.includes(opt.value)
                  )}
                  onChange={(selected) =>
                    handleProfileChange(
                      "practiceAreas",
                      selected ? selected.map(item => item.value) : []
                    )
                  }
                  placeholder="Select practice areas..."
                />
              </div>

              <button
                onClick={handleProfile}
                className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                  editMode 
                    ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl" 
                    : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 shadow-lg hover:shadow-xl"
                } text-black`}
              >
                {editMode ? <><FaSave /> Save Changes</> : <><FaEdit /> Edit Profile</>}
              </button>
            </div>
          </motion.div>

          {/* Comments Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden shadow-xl"
          >
            <div className="bg-gradient-to-r from-yellow-500/20 to-transparent px-6 py-4 border-b border-gray-800">
              <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
                <FaCommentDots /> Client Reviews
              </h2>
            </div>
            <div className="p-6">
              <LawyerComments />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default View_Lawyer_Profile;