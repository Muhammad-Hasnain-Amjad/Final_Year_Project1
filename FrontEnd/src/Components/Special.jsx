import React from 'react';
import { DrData, LawyersData, services } from '../assets/assets';
import { FaHeartbeat, FaGavel, FaBrain } from "react-icons/fa";
import { motion } from "framer-motion";

const Special = () => {

  const scrollAnimation = { 
    initial: { opacity: 0, y: 50 }, 
    whileInView: { opacity: 1, y: 0 }, 
    viewport: { once: false, amount: 0.3 } // triggers every time element comes into view
  };

  return (
    <div className="parentdiv mt-10">
      <div className="subparent flex flex-col items-center p-6">

        {/* Heading Section */}
        <motion.div {...scrollAnimation} transition={{ duration: 0.8 }} className="descdiv text-center mb-6">
          <h1 className="text-[30px] font-semibold">Find by Speciality</h1>
          <p>Simply browse through our extensive list of trusted doctors & lawyers and schedule your appointment hassle-free.</p>
        </motion.div>

        {/* Doctors Section */}
        <div className="drdiv flex flex-row gap-6 flex-wrap justify-center">
          {DrData.map((dr, index) => (
            <motion.div
              key={dr.id}
              className="flex flex-col items-center cursor-pointer"
              {...scrollAnimation}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={dr.image}
                alt=""
                className="w-32 h-32 object-cover rounded-full transition-transform duration-300"
              />
              <p className="mt-3 font-medium text-lg">{dr.sp}</p>
            </motion.div>
          ))}
        </div>

        {/* Lawyers Section */}
        <div className="drdiv flex flex-row gap-6 flex-wrap justify-center mt-10">
          {LawyersData.map((lawyer, index) => (
            <motion.div
              key={lawyer.id}
              className="flex flex-col items-center cursor-pointer"
              {...scrollAnimation}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={lawyer.image}
                alt=""
                className="w-32 h-32 object-cover rounded-full transition-transform duration-300"
              />
              <p className="mt-3 font-medium text-lg">{lawyer.sp}</p>
            </motion.div>
          ))}
        </div>

        {/* Expertise Cards */}
        <motion.div {...scrollAnimation} transition={{ duration: 1, delay: 0.2 }} className="bg-black text-white px-6 py-16 rounded-xl w-full max-w-6xl mt-12">
          <h1 className="text-2xl md:text-3xl font-semibold mb-10 text-center">Expertise on demand</h1>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400">
              <FaHeartbeat className="text-yellow-400 text-3xl mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
              <h2 className="text-xl font-semibold mb-2">Healthcare Excellence</h2>
              <p className="text-gray-400 mb-4">Access top-tier medical specialists, surgeons, and therapists for consultations from your home.</p>
              <div className="flex gap-2 flex-wrap">
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">Surgery</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">Pediatrics</span>
                <span className="bg-gray-800 px-3 py-1 rounded-full text-sm">Mental Health</span>
              </div>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400">
              <FaGavel className="text-yellow-400 text-3xl mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
              <h2 className="text-xl font-semibold mb-2">Legal Counsel</h2>
              <p className="text-gray-400 mb-4">Strategic legal advice for corporate, family, and criminal law matters.</p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2"><span className="text-yellow-400">✔</span> Document Review</li>
                <li className="flex items-center gap-2"><span className="text-yellow-400">✔</span> Case Strategy</li>
              </ul>
            </motion.div>
          </div>

          {/* Bottom Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400">
              <FaBrain className="text-yellow-400 text-3xl mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(250,204,21,0.7)]" />
              <h2 className="text-lg font-semibold mb-2">Wellness</h2>
              <p className="text-gray-400 text-sm">Holistic approaches to health and mental clarity.</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.03 }} transition={{ type: 'spring', stiffness: 300 }} className="bg-gray-900 p-6 rounded-2xl border border-gray-800 hover:border-yellow-400 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-lg font-semibold mb-2">Global Network</h2>
                <p className="text-gray-400 text-sm">Professionals licensed in 40+ countries ready to assist you.</p>
              </div>
              <div className="flex flex-wrap md:flex-nowrap gap-3">
                <img src="https://randomuser.me/api/portraits/men/32.jpg" className="w-10 h-10 rounded-full border-2 border-black" />
                <img src="https://randomuser.me/api/portraits/women/44.jpg" className="w-10 h-10 rounded-full border-2 border-black" />
                <img src="https://randomuser.me/api/portraits/men/55.jpg" className="w-10 h-10 rounded-full border-2 border-black" />
                <div className="w-10 h-10 rounded-full bg-yellow-400 text-black flex items-center justify-center text-sm font-bold">+15k</div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Our Services */}
        <motion.div {...scrollAnimation} transition={{ duration: 1, delay: 0.8 }} className="w-full mt-20 px-4 md:px-10 lg:px-20">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold">Our Services</h1>
            <p className="mt-3 text-gray-700 md:text-lg">Explore the services that make Cure & Counsel the trusted platform for medical and legal consultations.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }} className="group bg-white p-6 rounded-2xl shadow-md flex flex-col items-center text-center">
                <img src={service.image} alt={service.title} className="w-24 h-24 object-cover mb-4 rounded-lg transition-transform duration-500 group-hover:scale-110" />
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-gray-700 text-sm">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Special;