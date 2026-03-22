import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Loader from '../Components/Loader'
import {
  FaMapMarkerAlt,
  FaCommentDots,
  FaStar,
  FaVideo,
} from "react-icons/fa";

function View_Lawyer_Profile() {

  const { id } = useParams();
  const BaseURL = "http://localhost:5000/lawyer";

  const [lawyer, setLawyer] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const fetchLawyer = async () => {
      try {
        const res = await axios.get(`${BaseURL}/idlawyer/${id}`);
        setLawyer(res.data.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchLawyer();
  }, [id]);

  if (!lawyer)
    return (
      <Loader />
    );

  const { registration, profile, status, comments } = lawyer;

  /* rating calculation */

  const avgRating =
    comments.length > 0
      ? (
          comments.reduce((a, b) => a + b.rating, 0) / comments.length
        ).toFixed(1)
      : "No rating";

  return (
    <div className="bg-black min-h-screen text-white p-6">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-yellow-500 pb-8">

        {/* PROFILE PIC */}
        <img
          src={registration.profilePic?.url}
          alt="profile"
          className="w-40 h-40 rounded-full object-cover border-4 border-yellow-400 shadow-lg"
        />

        {/* BASIC INFO */}
        <div>

          <h1 className="text-3xl font-bold text-yellow-400">
            {registration.fullName}
          </h1>

          <p className="text-gray-400">
            Bar Council #: {registration.barCouncilNumber}
          </p>

          <div className="flex items-center gap-2 mt-2 text-yellow-400">
            <FaStar />
            {avgRating}
          </div>

          <p className="mt-1">
            {status.isVerified === "verified" ? (
              <span className="text-green-400 font-semibold">
                ✔ Verified
              </span>
            ) : (
              <span className="text-red-400 font-semibold">
                Pending Verification
              </span>
            )}
          </p>

          <p>
            {status.isActive ? (
              <span className="text-green-400">🟢 Online</span>
            ) : (
              <span className="text-gray-400">⚪ Offline</span>
            )}
          </p>

          {/* ICONS */}
          <div className="flex gap-4 mt-4">

            {/* MAP */}
            <button
              className="bg-yellow-400 text-black p-3 rounded-full hover:scale-110 transition"
              onClick={() =>
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${registration.officeAddress}`
                )
              }
            >
              <FaMapMarkerAlt />
            </button>

            {/* CHAT */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="bg-yellow-400 text-black p-3 rounded-full hover:scale-110 transition"
            >
              <FaCommentDots />
            </button>

          </div>

        </div>
      </div>

      {/* DETAILS */}

      <div className="grid md:grid-cols-2 gap-6 mt-10">

        {/* PROFESSIONAL CARD */}
        <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500">

          <h2 className="text-yellow-400 text-xl mb-4">
            Professional Details
          </h2>

          <p><strong>Experience:</strong> {registration.experience} years</p>
          <p><strong>Membership:</strong> {registration.membershipType}</p>
          <p><strong>Court Level:</strong> {registration.courtLevel}</p>
          <p><strong>Year of Enrollment:</strong> {registration.yearOfEnrollment}</p>
          <p><strong>Practice Areas:</strong> {registration.practiceAreas.join(", ")}</p>
          <p><strong>Address:</strong> {registration.officeAddress}</p>

        </div>

        {/* ABOUT */}
        <div className="bg-gray-900 p-6 rounded-xl border border-yellow-500">

          <h2 className="text-yellow-400 text-xl mb-4">About</h2>

          <p>{profile.about || "No description available."}</p>

          <p className="mt-3">
            <strong>Consultation Fee:</strong> Rs {profile.consultationFee}
          </p>

          <p>
            <strong>Available Days:</strong> {profile.availableDays}
          </p>

        </div>

      </div>

  
      {/* BOOK CONSULTATION */}

      
      <div className="mt-10 flex flex-row  justify-around items-center gap-2">

        <button
          onClick={() => setShowComments(!showComments)}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg"
        >
          View Reviews
        </button>

      <button
          onClick={() => setShowComments(!showComments)}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg"
        >
          Edit Profile
        </button>

      </div>

      



    </div>
  );
}

export default View_Lawyer_Profile;