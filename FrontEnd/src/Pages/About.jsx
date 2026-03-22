import React from "react";
import { motion } from "framer-motion";
import NavBar from "../Components/NavBar";
import mha from '../assets/mha.jpeg'
import muner from '../assets/muner.jpeg'
import sir from '../assets/dr_asif.jpeg'
const teamMembers = [
  {
    name: "Muhammad Hasnain Amjad",
    role: "Founder & Developer",
    img: mha,
  },
  {
    name: "Munner ul Hassan",
    role: "Co-Founder",
    img: muner,
  },
  {
    name: "Dr. Asif Sohail",
    role: " Supervisor",
    img: sir,
  }
];

export default function About() {
  return (
   <div>
    <NavBar />
     <div className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12">

      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6 text-center">
        About Cure & Counsel
      </h1>

      {/* Description */}
      <motion.div
  className="max-w-4xl text-white space-y-4 mb-12 text-center md:text-left"
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.2 }}
>
  <p>
    Cure & Counsel is Pakistan’s <span className="font-semibold text-yellow-400">first trusted platform bridging the gap between legal and medical professionals</span>. In a country where reliable access to certified doctors and licensed lawyers is often challenging, we recognized the need for a single, transparent, and trustworthy network. Our platform is designed to provide you <span className="font-semibold text-yellow-400">peace of mind</span>, knowing that every professional you connect with is verified and highly qualified.
  </p>
  <p>
    We believe that <span className="font-semibold text-yellow-400">healthcare and legal support are fundamental rights</span>, and our mission is to make both <span className="font-semibold text-yellow-400">accessible, reliable, and simple</span>. By connecting medical and legal professionals on a single platform, Cure & Counsel empowers people to <span className="font-semibold text-yellow-400">make informed decisions without the stress of uncertainty or fraud</span>.
  </p>
  <p>
    At Cure & Counsel, our mission is simple: <span className="font-semibold text-yellow-400">to make professional healthcare and legal guidance accessible, reliable, and trustworthy for everyone</span>. By integrating technology, trust, and professionalism, we are redefining how people connect with experts who can truly make a difference.
  </p>
</motion.div>

      {/* Team Section */}
      <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-6 text-center">
        Our Team
      </h2>

      <div className="w-full max-w-4xl flex flex-col gap-8">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.8, delay: idx * 0.3 }}
            className="flex flex-col items-center bg-gray-900 rounded-xl p-6 border border-yellow-400"
          >
            <img
              src={member.img}
              alt={member.name}
              className="w-28 h-28 rounded-full border-2 border-yellow-400 mb-4"
            />
            <h3 className="text-xl font-semibold text-yellow-400 mb-1">
              {member.name}
            </h3>
            <p className="text-white text-center">{member.role}</p>
          </motion.div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="max-w-4xl mt-12 text-white space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-yellow-400 mb-4 text-center">
          Why Choose Us?
        </h2>
        <ul className="list-disc list-inside space-y-2 text-white md:text-lg">
          <li><span className="font-semibold text-yellow-400">Verified Professionals</span> – Every doctor and lawyer is thoroughly screened.</li>
          <li><span className="font-semibold text-yellow-400">Reliable Platform</span> – Designed to be secure, user-friendly, and responsive.</li>
          <li><span className="font-semibold text-yellow-400">Pakistan First</span> – The only platform combining legal and medical expertise under one trusted roof.</li>
          <li><span className="font-semibold text-yellow-400">Accessible Anywhere</span> – From Karachi to Gilgit, our platform connects professionals to you anytime, anywhere.</li>
        </ul>
      </div>

      {/* Footer / Theme Indicator */}
      <div className="mt-12 flex justify-center gap-4">
        <div className="w-6 h-6 bg-yellow-400 rounded-full"></div>
        <div className="w-6 h-6 bg-white rounded-full"></div>
        <div className="w-6 h-6 bg-black rounded-full border border-yellow-400"></div>
      </div>

    </div>
   </div>
  );
}