// pages/Admin/AllUsers.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AllUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get token
  const getToken = () => {
    return localStorage.getItem("token");
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = getToken();

      if (!token) {
        toast.error("Please login");
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/user/allusers", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status) {
        setUsers(response.data.allusers);
      } else {
        toast.error(response.data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-400 text-xl">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-yellow-400">All Users</h1>
         
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-xl border border-yellow-500/30 overflow-hidden">
          <table className="w-full">
            <thead className="bg-black border-b border-yellow-500/30">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">#</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-yellow-400">Phone</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.filter(user => user.role !== "admin").map((user, index) => (
                <tr key={user._id} className="hover:bg-white/5 transition">
                  <td className="px-6 py-3 text-sm text-gray-400">{index + 1}</td>
                  <td className="px-6 py-3 text-sm text-white">{user.name || "N/A"}</td>
                  <td className="px-6 py-3 text-sm text-gray-300">{user.email || "N/A"}</td>
                  <td className="px-6 py-3 text-sm text-gray-300">{user.phone || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* No users message */}
          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllUsers;