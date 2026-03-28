import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaStar, FaMapMarkerAlt, FaCommentDots, FaHome, FaCalendarAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Loader from "../Components/Loader";
import { toast } from "react-toastify";


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
        className="bg-yellow-400 text-black p-3 rounded-full"
      >
        {icon}
      </motion.button>

      {showTooltip && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 bg-gray-900 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap"
        >
          {label}
        </motion.div>
      )}
    </div>
  );
};

function View_Lawyer_Profile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const BaseURL = "http://localhost:5000/lawyer";
 const[editLoading,seteditLoading]=useState(false)
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
        fee: data.profile.consultationFee || "",
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
     let result= await axios.patch(`${BaseURL}/idlawyer/${id}`, {
           about: formData.about,
  fee: formData.fee,
  membershipType: formData.membershipType,
  officeAddress: formData.officeAddress,
  practiceAreas: formData.practiceAreas,
  courtLevel: formData.courtLevel
        });
        seteditLoading(true)
        if(result){
          seteditLoading(false)
          toast.success(result.data.message)
          setEditMode(false);
        setLawyer(result.data.data)

        }
 else {
  toast.error(result.data.message)
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
    <div className="bg-black min-h-screen text-white p-6">
      <div className="flex flex-col md:flex-row justify-between gap-6 border-b border-yellow-500 pb-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
      {
        editLoading && (
          <Loader />
        )
      }
          {!editMode && (
            <img
              src={registration.profilePic?.url}
              alt="profile"
              className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
            />
          )}
          <div className="text-center md:text-left">
            {!editMode && (
              <>
                <h1 className="text-2xl md:text-3xl font-bold text-yellow-400">
                  {registration.fullName}
                </h1>
                <p className="text-gray-400">Bar Council #: {registration.barCouncilNumber}</p>
                <p className="text-gray-400 font-bold mt-2">{registration.username}</p>
              </>
            )}
            <div className="flex justify-center md:justify-start items-center gap-2 mt-2 text-yellow-400">
              <FaStar /> {avgRating}
            </div>
            <p className="mt-1">
              {status.isVerified === "verified" ? (
                <span className="text-green-400 font-semibold">✔ Verified</span>
              ) : (
                <span className="text-red-400 font-semibold">Pending Verification</span>
              )}
            </p>
            <p>
              {status.isActive ? (
                <span className="text-green-400">🟢 Online</span>
              ) : (
                <span className="text-gray-400">⚪ Offline</span>
              )}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-4 flex-wrap justify-center">
            <IconButton icon={<FaHome />} label="Home" onClick={() => navigate("/")} />
            <IconButton icon={<FaCalendarAlt />} label="Appointments" onClick={() => navigate("/appointments")} />
            <IconButton icon={<FaCommentDots />} label="Chat" onClick={() => {}} />
            <IconButton icon={<FaMapMarkerAlt />} label="Location" onClick={() => {}} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <div className="bg-black p-6 rounded-xl border border-yellow-500">
          <h2 className="text-yellow-400 text-xl mb-4">Professional Details</h2>
          <label className="text-gray-400 text-sm">About</label>
          <textarea
            rows={4}
            value={formData.about}
            onChange={(e) => handleProfileChange("about", e.target.value)}
            disabled={!editMode}
            className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70 mb-3"
          />
          <label className="text-gray-400 text-sm">Consultation Fee (PKR)</label>
          <input
            type="number"
            value={formData.fee}
            onChange={(e) => handleProfileChange("fee", e.target.value)}
            disabled={!editMode}
            className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70 mb-3"
          />
          <label className="text-gray-400 text-sm">Office Address</label>
          <input
            type="text"
            value={formData.officeAddress}
            onChange={(e) => handleProfileChange("officeAddress", e.target.value)}
            disabled={!editMode}
            className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70 mb-3"
          />
          <label className="text-gray-400 text-sm">Court Level</label>
          <input
            type="text"
            value={formData.courtLevel}
            onChange={(e) => handleProfileChange("courtLevel", e.target.value)}
            disabled={!editMode}
            className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70 mb-3"
          />
          <label className="text-gray-400 text-sm">Practice Areas</label>
          <input
            type="text"
            value={formData.practiceAreas.join(", ")}
            onChange={(e) =>
              handleProfileChange(
                "practiceAreas",
                e.target.value.split(",").map((item) => item.trim())
              )
            }
            disabled={!editMode}
            className="w-full mt-1 p-3 rounded-lg bg-black border border-gray-700 focus:border-yellow-400 outline-none text-white disabled:opacity-70 mb-4"
          />
          <button
            onClick={handleProfile}
            className={`w-full py-2 rounded-lg font-semibold transition ${
              editMode ? "bg-green-500 hover:scale-105" : "bg-yellow-400 hover:scale-105"
            } text-black`}
          >
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default View_Lawyer_Profile;