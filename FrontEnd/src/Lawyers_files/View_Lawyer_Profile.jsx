import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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
      <div className="min-h-screen flex items-center justify-center bg-black text-yellow-400">
        Loading Profile...
      </div>
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

      {/* MAP SECTION */}

      <div className="mt-10">

        <h2 className="text-yellow-400 text-xl mb-4">Office Location</h2>

        <iframe
          title="map"
          width="100%"
          height="300"
          className="rounded-lg border border-yellow-500"
          src={`https://maps.google.com/maps?q=${registration.officeAddress}&output=embed`}
        ></iframe>

      </div>

      {/* BOOK CONSULTATION */}

      <div className="mt-10">

        <button className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:scale-105 transition">
          📅 Book Consultation
        </button>

      </div>

      {/* COMMENTS */}

      <div className="mt-10">

        <button
          onClick={() => setShowComments(!showComments)}
          className="bg-yellow-400 text-black px-6 py-2 rounded-lg"
        >
          View Reviews
        </button>

        {showComments && (

          <div className="mt-4 space-y-4">

            {comments.length === 0 ? (
              <p className="text-gray-400">No reviews yet</p>
            ) : (
              comments.map((c, i) => (
                <div
                  key={i}
                  className="bg-gray-900 border border-yellow-500 p-4 rounded-lg"
                >

                  <p>{c.comment}</p>

                  <div className="flex gap-2 text-yellow-400 mt-2">
                    <FaStar /> {c.rating}
                  </div>

                </div>
              ))
            )}

          </div>

        )}

      </div>

      {/* LIVE CHAT SECTION */}

      {showChat && (

        <div className="fixed bottom-4 right-4 w-80 bg-gray-900 border border-yellow-500 rounded-xl shadow-lg">

          <div className="bg-yellow-400 text-black p-3 font-bold">
            Live Chat
          </div>

          <div className="p-4 h-40 overflow-y-auto text-sm">
            Chat messages will appear here...
          </div>

          <input
            placeholder="Type message..."
            className="w-full p-2 bg-black border-t border-yellow-500 text-white"
          />

        </div>

      )}

    </div>
  );
}

export default View_Lawyer_Profile;