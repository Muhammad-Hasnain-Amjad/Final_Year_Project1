import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import EmptyState from "../Components/EmptyState"; 
import {TrashIcon,LoaderCircle, AlertTriangle} from "lucide-react";


export default function All_Drs() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fake fetch example, replace with real API call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      // setDoctors([]); // empty case
      
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
       <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-400 text-xl gap-4">
           <LoaderCircle className="animate-spin w-14 h-14" />
           <p>Loading lawyers ...</p>
         </div> )
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
        Doctors Management
      </h1>

      {/* EMPTY STATE */}
      {doctors.length === 0 && (
        <EmptyState
          title="No Doctors Registered Yet"
          subtitle="Once doctors sign up, they will appear here for approval."
        />
      )}

      {/* DOCTORS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="
              bg-black border border-yellow-400/30
              rounded-2xl p-6
              shadow-[0_40px_200px_rgba(250,204,21,0.15)]
              hover:scale-[1.02] transition
            "
          >
            {/* NAME */}
            <h2 className="text-xl font-semibold text-yellow-400 mb-2">
              {doc.name}
            </h2>

            {/* EMAIL */}
            <p className="text-gray-300 text-sm mb-1">{doc.email}</p>

            {/* EXPERIENCE */}
            <p className="text-gray-400 mb-4">
              Experience: <span className="text-white">{doc.experience} yrs</span>
            </p>

            {/* STATUS */}
            <span
              className={`inline-block px-3 py-1 rounded-full text-sm mb-4
                ${
                  doc.status === "approved"
                    ? "bg-green-500/20 text-green-400"
                    : doc.status === "rejected"
                    ? "bg-red-500/20 text-red-400"
                    : "bg-yellow-500/20 text-yellow-400"
                }
              `}
            >
              {doc.status || "pending"}
            </span>

            {/* VIEW PROFILE */}
            <button
              onClick={() => navigate(`/admin/doctors/${doc._id}`)}
              className="
                w-full mt-4 bg-yellow-400 text-black
                font-semibold py-2 rounded-md
                hover:bg-yellow-500 transition
              "
            >
              View Profile
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
