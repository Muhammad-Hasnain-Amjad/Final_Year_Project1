import React from "react";
import { LoaderCircle, AlertTriangle } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

function Temp_lawyer() {
  const { id } = useParams();
  const BaseURL = "http://localhost:5000/lawyer";
  const queryClient = useQueryClient();

  // Fetch lawyer by ID
  const { data: lawyer, isLoading, error } = useQuery({
    queryKey: ["lawyer", id],
    queryFn: async () => {
      const res = await axios.get(`${BaseURL}/idlawyer/${id}`);
      return res.data?.data;
    },
  });

  // Mutation to update status
 const updateStatus = useMutation({
  mutationFn: async (newStatus) =>
    axios.patch(`${BaseURL}/idlawyer/${id}/status`, {
      status: newStatus,
    }),

  onSuccess: (data, newStatus) => {
    queryClient.invalidateQueries({ queryKey: ["lawyer", id] });
    toast.success(`${newStatus} Successfully!`);
  },
});

   
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-400 text-xl gap-4">
        <LoaderCircle className="animate-spin w-14 h-14" />
        <p>Loading lawyer data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500 text-xl gap-4">
        <AlertTriangle className="w-14 h-14" />
        <p>Failed to load lawyer! Please try again.</p>
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-gray-400 text-xl gap-4">
        <AlertTriangle className="w-14 h-14" />
        <p>No lawyer data found.</p>
      </div>
    );
  }

  // Images array safely using optional chaining
  const images = [
    { label: "Profile", src: lawyer?.registration?.profilePic. url || "" },
    { label: "Bar Council Card", src: lawyer?.registration?.barCouncilCard.url || "" },
    { label: "CNIC Front", src: lawyer?.registration?.cnicFront.url || "" },
    { label: "CNIC Back", src: lawyer?.registration?.cnicBack.url || "" },
    { label: "LLB", src: lawyer?.registration?.llb.url || "" },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6">
        {lawyer?.registration?.fullName || "N/A"}
      </h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN: Image Gallery */}
        <div className="flex flex-col gap-4 md:flex-1">
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Documents & Profile</h2>
          <div className="flex overflow-x-auto gap-4 pb-2">
            {images.map((img, idx) => (
              <div
                key={idx}
                className="min-w-[200px] border-2 border-yellow-400 rounded-xl overflow-hidden relative group hover:scale-105 transition-transform"
              >
                <img src={img.src} alt={img.label} className="w-full h-48 object-cover" />
                <span className="absolute bottom-2 left-2 bg-black/70 text-yellow-400 px-2 py-1 rounded text-sm">
                  {img.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Info & Actions */}
        <div className="md:flex-1 flex flex-col gap-6">
          <div className="bg-gray-900 border border-yellow-400 rounded-xl p-6 shadow-lg space-y-2">
            <p><strong>Email:</strong> {lawyer?.registration?.email || "-"}</p>
            <p><strong>Phone:</strong> {lawyer?.registration?.phoneNumber || "-"}</p>
            <p><strong>CNIC:</strong> {lawyer?.registration?.cnic || "-"}</p>
            <p><strong>Bar Council Number:</strong> {lawyer?.registration?.barCouncilNumber || "-"}</p>
            <p><strong>Membership Type:</strong> {lawyer?.registration?.membershipType || "-"}</p>
            <p><strong>Year of Enrollment:</strong> {lawyer?.registration?.yearOfEnrollment || "-"}</p>
            <p><strong>Practice Areas:</strong> {lawyer?.registration?.practiceAreas?.join(", ") || "-"}</p>
            <p><strong>Experience:</strong> {lawyer?.registration?.experience || "-"} years</p>
            <p><strong>Court Level:</strong> {lawyer?.registration?.courtLevel || "-"}</p>
            <p><strong>Office Address:</strong> {lawyer?.registration?.officeAddress || "-"}</p>
            <p><strong>About:</strong> {lawyer?.profile?.about || "-"}</p>
           <p className="flex items-center gap-2">
  <strong>Status:</strong>

  <span
    className={`w-3 h-3 rounded-full ${
      lawyer?.status?.isVerified === "verified"
        ? "bg-green-500"
        : lawyer?.status?.isVerified === "rejected"
        ? "bg-red-500"
        : "bg-yellow-400"
    }`}
  ></span>

  <span className="capitalize">
    {lawyer?.status?.isVerified || "pending"}
  </span>
</p>

          </div>

         
{/* Accept / Reject Buttons */}
<div className="flex gap-4 mt-4">
  {/* ACCEPT BUTTON */}
  <button
    onClick={() => updateStatus.mutate("verified")}
    disabled={
      updateStatus.isLoading ||
      lawyer?.status?.isVerified !== "pending"
    }
    className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {lawyer?.status?.isVerified === "verified"
      ? "Accepted"
      : "Accept"}
  </button>

  {/* REJECT BUTTON */}
  <button
    onClick={() => updateStatus.mutate("rejected")}
    disabled={
      updateStatus.isLoading ||
      lawyer?.status?.isVerified !== "pending"
    }
    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {lawyer?.status?.isVerified === "rejected"
      ? "Rejected"
      : "Reject"}
  </button>
</div>


        </div>
      </div>
    </div>
  );
}

export default Temp_lawyer;
