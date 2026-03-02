import { useNavigate } from "react-router-dom";
import EmptyState from "../Components/EmptyState";
import { useQuery} from "@tanstack/react-query";
import {TrashIcon,LoaderCircle, AlertTriangle} from "lucide-react";
import { confirm } from "../Components/ConfirmDialog"; // path to your dialog file
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from "react-toastify";
import axios from "axios";
import { useState } from "react";

export default function All_Lawyers() {
  const queryClient=useQueryClient()
  const navigate = useNavigate();
 const BaseURL = "http://localhost:5000/lawyer";
  const { data: lawyers = [], isLoading, error } = useQuery({
    queryKey: ["lawyers"],
    queryFn: async () => {
      const res = await axios.get(BaseURL + "/get");
        console.log(res.data);

      return res.data.data;
    },
  });
 const deleteLawyerMutation = useMutation({
  mutationFn: async (id) => axios.delete(`${BaseURL}/deletelawyer/${id}`),

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["lawyers"] });
    toast.success("Deleted Successfully!");
  },

  onError: () => {
    toast.error("Delete failed!");
  }
});


const handleDelete = async (id) => {
  const result = await confirm({ message: "Do you really want to delete this lawyer?" });
 
  if (result) {
    
    deleteLawyerMutation.mutate(id);
  
  }
};



  if (isLoading) {
    return(
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-yellow-400 text-xl gap-4">
           <LoaderCircle className="animate-spin w-14 h-14" />
           <p>Loading lawyers ...</p>
         </div>
    )
   
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-red-500 text-xl gap-4">
              <AlertTriangle className="w-14 h-14" />
              <p>Failed to load lawyer! Please try again.</p>
            </div>
          );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <h1 className="text-3xl font-bold text-yellow-400 mb-8">
        Lawyers Management
      </h1>

      {lawyers.length === 0 && (
        <EmptyState
          title="No Lawyers Registered Yet"
          subtitle="Lawyers will appear here once they create an account."
        />
      )}

      {/* FLEX CONTAINER */}
      <div className="flex flex-col gap-6">
      {deleteLawyerMutation.isPending && (
  <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 text-yellow-400 gap-4">
    <LoaderCircle className="animate-spin w-14 h-14" />
    <p>Deleting Lawyer...</p>
  </div>
)}
 

        
        {lawyers.map((lawyer) => (
          <div
            key={lawyer._id}
            className="flex justify-between items-center bg-black border border-yellow-400/30 rounded-xl p-6 shadow-md"
          >
            {/* LEFT SIDE INFO */}
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-yellow-400">
                {lawyer.registration.fullName}
              </h2>
              <p className="text-gray-400">
                Experience:{" "}
                <span className="text-white">
                  {lawyer.registration.experience} years
                </span>
              </p>
     <p className="flex items-center gap-2">
  {/* Status Dot */}
  <span
    className={`w-3 h-3 rounded-full ${
      lawyer.status.isVerified === "verified"
        ? "bg-green-500"
        : lawyer.status.isVerified === "rejected"
        ? "bg-red-500"
        : "bg-yellow-400"
    }`}
  ></span>

  {/* Status Text */}
  <span
    className={`capitalize ${
      lawyer.status.isVerified === "verified"
        ? "text-green-500"
        : lawyer.status.isVerified === "rejected"
        ? "text-red-500"
        : "text-yellow-400"
    }`}
  >
    {lawyer.status.isVerified}
  </span>
</p>


            </div>

            {/* RIGHT SIDE BUTTON */}
           <div className="flex flex-col items-center gap-2 justify-center relative">
  <button
    onClick={() => navigate(`/lawyers_a/${lawyer._id}`)}
    className="bg-yellow-400 text-black px-4 py-2 rounded-md font-semibold hover:bg-yellow-500 transition"
  >
    View Profile
  </button>

  <div className="relative group">
    <TrashIcon className="text-red-700 w-6 h-6 cursor-pointer"   onClick={() => handleDelete(lawyer._id)} />

    {/* Tooltip */}
    <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
      Delete Lawyer
    </span>
  </div>
</div>

          </div>
        ))}
      </div>
    </div>
  );
}
