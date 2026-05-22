import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EmptyState from "../Components/EmptyState"; 
import { TrashIcon, LoaderCircle, AlertTriangle, Eye } from "lucide-react";

export default function All_Appoint() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all appointments from API
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/appointments");
      
      if (response.data.success) {
        setAppointments(response.data.data);
      } else {
        setError("Failed to fetch appointments");
      }
    } catch (err) {
      console.error("Error fetching appointments:", err);
      setError(err.message || "Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-PK', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400";
      case "accepted": return "bg-green-500/20 text-green-400";
      case "ongoing": return "bg-blue-500/20 text-blue-400";
      case "completed": return "bg-purple-500/20 text-purple-400";
      case "cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-400 text-xl gap-4">
        <LoaderCircle className="animate-spin w-14 h-14" />
        <p>Loading appointments...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500 text-xl gap-4">
        <AlertTriangle className="w-14 h-14" />
        <p>Error loading appointments: {error}</p>
        <button 
          onClick={fetchAppointments}
          className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-500"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
        Appointments Management
      </h1>

      {/* EMPTY STATE */}
      {appointments.length === 0 && (
        <EmptyState
          title="No Appointments Found"
          subtitle="Appointments will appear here once clients book consultations."
        />
      )}

      {/* APPOINTMENTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-black border border-yellow-400/30 rounded-2xl p-6 shadow-[0_40px_200px_rgba(250,204,21,0.15)] hover:scale-[1.02] transition-all duration-300"
          >
            {/* Client & Lawyer Names */}
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-yellow-400">
                {apt.clientName}
              </h2>
              <p className="text-gray-400 text-sm">
                vs {apt.lawyerName}
              </p>
            </div>

            {/* Case Type */}
            <div className="mb-3">
              <span className="text-gray-400 text-sm">Case Type:</span>
              <p className="text-white font-medium">{apt.caseType}</p>
            </div>

            {/* Date & Time */}
            <div className="mb-3">
              <span className="text-gray-400 text-sm">Date & Time:</span>
              <p className="text-white">
                {formatDate(apt.date)} at {apt.time}
              </p>
            </div>

            {/* Fees */}
           

            {/* Payment Status */}
            <div className="mb-3">
              <span className="text-gray-400 text-sm">Payment:</span>
              <p className={apt.isPaid ? "text-green-400" : "text-red-400"}>
                {apt.isPaid ? "✓ Paid" : "✗ Not Paid"}
              </p>
            </div>

            {/* Appointment Status */}
            <div className="mb-4">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(apt.status)}`}>
                {apt.status.toUpperCase()}
              </span>
            </div>

           

            {/* VIEW DETAILS BUTTON */}
            <button
              onClick={() => navigate(`/appointments/${apt.id}`)}
              className="w-full mt-2 bg-yellow-400 text-black font-semibold py-2 rounded-md hover:bg-yellow-500 transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}