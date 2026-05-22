import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { LoaderCircle, AlertTriangle, ArrowLeft, Calendar, Clock, User, Briefcase, DollarSign, Video, Tag } from "lucide-react";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/appointments/${id}`);
      
      if (response.data.success) {
        setAppointment(response.data.data);
      } else {
        setError("Failed to fetch appointment details");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to load appointment");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-400/30";
      case "accepted": return "bg-green-500/20 text-green-400 border-green-400/30";
      case "ongoing": return "bg-blue-500/20 text-blue-400 border-blue-400/30";
      case "completed": return "bg-purple-500/20 text-purple-400 border-purple-400/30";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-400/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-400/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-400 text-xl gap-4">
        <LoaderCircle className="animate-spin w-14 h-14" />
        <p>Loading appointment details...</p>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500 text-xl gap-4">
        <AlertTriangle className="w-14 h-14" />
        <p>{error || "Appointment not found"}</p>
        <button 
          onClick={() => navigate("/appointments")}
          className="mt-4 bg-yellow-400 text-black px-6 py-2 rounded-md font-semibold hover:bg-yellow-500"
        >
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      {/* Back Button */}
      <button
        onClick={() => navigate("/appointments")}
        className="mb-6 flex items-center gap-2 text-yellow-400 hover:text-yellow-500 transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Appointments
      </button>

      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-400 mb-8">
          Appointment Details
        </h1>

        <div className="bg-black border border-yellow-400/30 rounded-2xl p-8 shadow-[0_40px_200px_rgba(250,204,21,0.15)]">
          
          {/* Status Badge */}
          <div className="flex justify-end mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(appointment.status)}`}>
              {appointment.status.toUpperCase()}
            </span>
          </div>

          {/* Client Section */}
          <div className="mb-8 pb-6 border-b border-yellow-400/20">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <p><span className="text-gray-400">Name:</span> {appointment.clientName}</p>
              <p><span className="text-gray-400">Email:</span> {appointment.clientEmail || 'N/A'}</p>
              <p><span className="text-gray-400">Phone:</span> {appointment.clientPhone || 'N/A'}</p>
            </div>
          </div>

          {/* Lawyer Section */}
          <div className="mb-8 pb-6 border-b border-yellow-400/20">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <Briefcase className="w-5 h-5" />
              Lawyer Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <p><span className="text-gray-400">Name:</span> {appointment.lawyerName}</p>
              <p><span className="text-gray-400">Fees:</span> <span className="text-yellow-400">₨ {appointment.fees.toLocaleString()}</span></p>
              <p><span className="text-gray-400">Payment Status:</span> 
                <span className={appointment.isPaid ? "text-green-400 ml-2" : "text-red-400 ml-2"}>
                  {appointment.isPaid ? "Paid" : "Not Paid"}
                </span>
              </p>
            </div>
          </div>

          {/* Appointment Section */}
          <div className="mb-8 pb-6 border-b border-yellow-400/20">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Appointment Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
              <p><span className="text-gray-400">Date:</span> {new Date(appointment.date).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <p><span className="text-gray-400">Time:</span> {appointment.time}</p>
              <p><span className="text-gray-400">Case Type:</span> <span className="text-yellow-400">{appointment.caseType}</span></p>
              <p className="col-span-2"><span className="text-gray-400">Description:</span> {appointment.description}</p>
            </div>
          </div>

        

          {/* Action Buttons */}
          <div className="flex gap-4 mt-8">
            
            <button
              onClick={() => navigate("/appointments")}
              className="flex-1 border border-yellow-400 text-yellow-400 font-semibold py-2 rounded-md hover:bg-yellow-400/10 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}