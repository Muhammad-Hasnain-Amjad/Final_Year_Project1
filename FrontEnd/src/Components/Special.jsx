import React from 'react';
import { DrData, LawyersData,services } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import dr from '../assets/druncle.jpg';
import { FaHeartbeat, FaGavel, FaBrain } from "react-icons/fa";

import lawyer from '../assets/lawyeruncle.jpg';


const Special = () => {
  const navigate = useNavigate();

  return (
    <div className="parentdiv mt-10">
      <div className="subparent flex flex-col items-center p-6">

        {/* Heading Section */}
        <div className="descdiv text-center mb-6">
          <div className="space-y-3">
            <h1 className="text-[30px] font-semibold">
              Find by Speciality
            </h1>
            <p>
              Simply browse through our extensive list of trusted doctors & lawyers <br />
              and schedule your appointment hassle-free.
            </p>
          </div>
        </div>

        {/* Doctors Section */}
        <div className="drdiv flex flex-row gap-6 flex-wrap justify-center">
          {DrData.map((dr) => (
            <div
              key={dr.id}
              className="flex flex-col items-center cursor-pointer"
            >
              <img
                src={dr.image}
                alt=""
                className="w-32 h-32 object-cover rounded-full transition-transform duration-300 hover:-translate-y-2"
              />
              <p className="mt-3 font-medium text-lg">{dr.sp}</p>
            </div>
          ))}
        </div>

      

        {/* Lawyers Section */}
        <div className="drdiv flex flex-row gap-6 flex-wrap justify-center mt-10">
          {LawyersData.map((lawyer) => (
            <div
              key={lawyer.id}
              className="flex flex-col items-center cursor-pointer"
            >
              <img
                src={lawyer.image}
                alt=""
                className="w-32 h-32 object-cover rounded-full transition-transform duration-300 hover:translate-y-2"
              />
              <p className="mt-3 font-medium text-lg">{lawyer.sp}</p>
            </div>
          ))}
        </div>

        {/* WHY CURE & COUNSEL SECTION */}

 <div className="bg-black text-white px-6 py-16 rounded-xl">

      {/* TITLE */}
      <h1 className="text-2xl md:text-3xl font-semibold mb-10">
        Expertise on demand
      </h1>

      {/* TOP GRID */}
      <div className="grid md:grid-cols-2 gap-6 ">

        {/* HEALTHCARE CARD */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition">

          {/* ICON */}
          <FaHeartbeat className="text-yellow-400 text-3xl mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />

          <h2 className="text-xl font-semibold mb-2">
            Healthcare Excellence
          </h2>

          <p className="text-gray-400 mb-4">
            Access top-tier medical specialists, surgeons, and therapists
            for consultations from your home.
          </p>

          {/* TAGS */}
          <div className="flex gap-2 flex-wrap">
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
              Surgery
            </span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
              Pediatrics
            </span>
            <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">
              Mental Health
            </span>
          </div>
        </div>

        {/* LEGAL CARD */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition">

          <FaGavel className="text-yellow-400 text-3xl mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />

          <h2 className="text-xl font-semibold mb-2">
            Legal Counsel
          </h2>

          <p className="text-gray-400 mb-4">
            Strategic legal advice for corporate, family, and criminal
            law matters.
          </p>

          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✔</span> Document Review
            </li>
            <li className="flex items-center gap-2">
              <span className="text-yellow-400">✔</span> Case Strategy
            </li>
          </ul>
        </div>

      </div>

      {/* BOTTOM GRID */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">

        {/* WELLNESS */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition">

          <FaBrain className="text-yellow-400 text-3xl mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />

          <h2 className="text-lg font-semibold mb-2">Wellness</h2>

          <p className="text-gray-400 text-sm">
            Holistic approaches to health and mental clarity.
          </p>
        </div>

        {/* GLOBAL NETWORK */}
        <div className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 transition flex flex-col md:flex-row items-center justify-between">

  {/* TEXT */}
  <div className="mb-4 md:mb-0">
    <h2 className="text-lg font-semibold mb-2">
      Global Network
    </h2>
    <p className="text-gray-400 text-sm">
      Professionals licensed in 40+ countries ready to assist you.
    </p>
  </div>

  {/* IMAGES */}
  <div className="flex flex-wrap md:flex-nowrap gap-3">
    <img
      src="https://randomuser.me/api/portraits/men/32.jpg"
      className="w-10 h-10 rounded-full border-2 border-black"
    />
    <img
      src="https://randomuser.me/api/portraits/women/44.jpg"
      className="w-10 h-10 rounded-full border-2 border-black"
    />
    <img
      src="https://randomuser.me/api/portraits/men/55.jpg"
      className="w-10 h-10 rounded-full border-2 border-black"
    />
    <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center text-sm font-bold">
      +15k
    </div>
  </div>

</div>

      </div>
    </div>
        {/* Our Services */}
<div className="w-full mt-20 px-4 md:px-10 lg:px-20">
      
      {/* Heading */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">Our Services</h1>
        <p className="mt-3 text-gray-700 md:text-lg">
          Explore the services that make Cure & Counsel the trusted platform for medical and legal consultations.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={service.image}
              alt={service.title}
              className="w-24 h-24 object-cover mb-4 rounded-lg transition-transform duration-500 group-hover:scale-110"
            />
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-gray-700 text-sm">{service.desc}</p>
          </div>
        ))}
      </div>
    </div>   

      </div>
    </div>
  );
};

export default Special;
