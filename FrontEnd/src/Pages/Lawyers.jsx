import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import NavBar from "../Components/NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiStar, FiBriefcase, FiChevronDown, FiCheckCircle, FiXCircle } from "react-icons/fi";

// Fetch function for lawyers with filters
const fetchLawyers = async (filters) => {
  const params = new URLSearchParams();
  if (filters.city) params.append("city", filters.city);
  if (filters.caseType) params.append("caseType", filters.caseType);
  
  const url = params.toString() 
    ? `http://localhost:5000/lawyer/filter?${params.toString()}`
    : "http://localhost:5000/lawyer/get";
    
  const res = await axios.get(url);
  return res.data.data;
};

// Skeleton Loader Component
const LawyerSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-200 animate-pulse">
    <div className="p-5">
      <div className="flex gap-4">
        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
        <div className="flex-1">
          <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="flex items-center gap-2 mt-1">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
      <div className="flex gap-3 mt-5">
        <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
        <div className="h-10 bg-gray-200 rounded-xl flex-1"></div>
      </div>
    </div>
  </div>
);

// Individual Lawyer Card Component
const LawyerCard = ({ lawyer }) => {
  const navigate = useNavigate();

  const fullName = lawyer.registration?.fullName || "Lawyer Name";
  const practiceAreas = lawyer.registration?.practiceAreas || ["General Practice"];
  const experience = lawyer.registration?.experience || 0;
  const profilePic = lawyer.registration?.profilePic?.url || "https://via.placeholder.com/80x80?text=Lawyer";
  const rating = 4.5;
  const reviewCount = Math.floor(Math.random() * 200) + 20;
  const isVerified = lawyer.status?.isVerified === "verified";
  const about = lawyer.profile?.about || "Experienced lawyer dedicated to providing excellent legal representation.";
  const fee = lawyer.profile?.fee || "Consultation fee upon request";

  const handleViewProfile = () => {
    navigate(`/lawyers_a/${lawyer._id}`);
  };

  const handleBookNow = () => {
    navigate(`/lawyers_a/${lawyer._id}?book=true`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 group"
    >
      <div className="p-5">
        <div className="flex gap-4">
          <div className="relative">
            <img
              src={profilePic}
              alt={fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-yellow-400 group-hover:border-yellow-500 transition-all"
            />
            {isVerified && (
              <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-0.5">
                <FiCheckCircle className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-lg leading-tight">{fullName}</h3>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded-full">
                {experience}+ Years Exp
              </span>
              <div className="flex items-center gap-1">
                <FiStar className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-gray-700">{rating}</span>
                <span className="text-xs text-gray-400">({reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mt-3 line-clamp-2">{about}</p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {practiceAreas.slice(0, 2).map((area, idx) => (
            <span key={idx} className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              {area}
            </span>
          ))}
          {practiceAreas.length > 2 && (
            <span className="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">
              +{practiceAreas.length - 2}
            </span>
          )}
        </div>

        <div className="mt-3 text-sm text-gray-500 flex items-center gap-1">
          <FiBriefcase className="w-3.5 h-3.5" />
          <span>{typeof fee === 'number' ? `PKR ${fee}` : fee}</span>
        </div>

        <div className="flex gap-3 mt-5">
          <button 
            onClick={handleViewProfile}
            className="flex-1 py-2 text-sm font-medium text-yellow-700 border border-yellow-300 rounded-xl hover:bg-yellow-50 transition-colors duration-200"
          >
            View Profile
          </button>
          
          <button 
            onClick={handleBookNow}
            className="flex-1 py-2 text-sm font-medium text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-colors duration-200 shadow-sm"
          >
            Book Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Search Panel Component
const SearchPanel = ({ onClose, onSearch, isOpen }) => {
  const [city, setCity] = useState("");
  const [caseType, setCaseType] = useState("");

  const caseOptions = [
    "Property / Land",
    "Family Issues",
    "Criminal & Court Case",
    "Cyber Crime",
    "Immigration",
    "Employer Issues",
    "Tax Issues",
    "Torture",
    "Business / Industrial"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch({ city, caseType });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-4 bg-white rounded-2xl shadow-xl border border-gray-200 p-6 z-20"
        >
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="w-full text-black px-4 py-2.5 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Case Type</label>
                <select
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-300 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-100 outline-none transition-all bg-white text-gray-900"
                >
                  <option value="" className="text-gray-600">Select case type</option>
                  {caseOptions.map((option) => (
                    <option key={option} value={option} className="text-gray-900">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-yellow-500 rounded-xl hover:bg-yellow-600 transition-colors shadow-sm"
              >
                Apply Filters
              </button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Main Component
const Lawyers = () => {
  const [searchPanelOpen, setSearchPanelOpen] = useState(false);
  const [filters, setFilters] = useState({ city: "", caseType: "" });

  // Fetch lawyers with filters
  const { data: lawyers, isLoading, error, refetch } = useQuery({
    queryKey: ["lawyers", filters],
    queryFn: () => fetchLawyers(filters),
    enabled: true,
  });

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    // Refetch will happen automatically because queryKey changed
  };

  const handleClearFilters = () => {
    setFilters({ city: "", caseType: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {/* Hero Section with Yellow Theme */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            {/* Left side - h1 and p */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">
                Find your <span className="text-yellow-500">Counsel.</span>
              </h1>
              <p className="text-gray-300 text-lg max-w-2xl">
                Discover top-tier legal experts vetted for precision and excellence.
              </p>
            </motion.div>

            {/* Right side - Search Button */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <button
                onClick={() => setSearchPanelOpen(!searchPanelOpen)}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <FiSearch className="w-5 h-5" />
                <span>Advanced Search</span>
                <FiChevronDown className={`w-5 h-5 transition-transform duration-200 ${searchPanelOpen ? 'rotate-180' : ''}`} />
              </button>
            </motion.div>
          </div>

          {/* Search Panel - appears right after the button and before grid */}
          <AnimatePresence>
            {searchPanelOpen && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <SearchPanel
                  isOpen={searchPanelOpen}
                  onClose={() => setSearchPanelOpen(false)}
                  onSearch={handleSearch}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Count */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Showing <span className="text-yellow-600">{lawyers?.length || 0}</span> results
          </h2>
          <p className="text-sm text-gray-500">Verified legal professionals</p>
        </div>

        {/* Active Filters Display */}
        {(filters.city || filters.caseType) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm text-gray-500">Active filters:</span>
            {filters.city && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                City: {filters.city}
                <button onClick={() => setFilters(prev => ({ ...prev, city: "" }))} className="hover:text-yellow-900">
                  <FiXCircle className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {filters.caseType && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 text-sm rounded-full">
                Case: {filters.caseType}
                <button onClick={() => setFilters(prev => ({ ...prev, caseType: "" }))} className="hover:text-yellow-900">
                  <FiXCircle className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            <button
              onClick={handleClearFilters}
              className="text-sm text-gray-400 hover:text-gray-600 underline"
            >
              Clear all
            </button>
          </div>
        )}

        {/* Grid Layout */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, idx) => (
              <LawyerSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 bg-red-50 rounded-2xl">
            <p className="text-red-600">Failed to load lawyers. Please try again later.</p>
          </div>
        ) : lawyers?.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl">
            <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No verified lawyers found matching your criteria.</p>
            {(filters.city || filters.caseType) && (
              <button
                onClick={handleClearFilters}
                className="mt-3 text-yellow-600 hover:text-yellow-700 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {lawyers.map((lawyer) => (
                <LawyerCard key={lawyer._id} lawyer={lawyer} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Lawyers;