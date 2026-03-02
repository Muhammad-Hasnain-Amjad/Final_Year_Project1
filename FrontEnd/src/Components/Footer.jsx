import React from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import logo from "../assets/logo.jpeg";

function Footer() {
  return (
    <div className="w-full mt-16 bg-black text-white">

      {/* ===== TOP SECTION ===== */}
      <div className="max-w-[1400px] mx-auto grid md:grid-cols-3 gap-12 px-10 py-16">

        {/* -------- BOX 1 -------- */}
        <div className="flex flex-col gap-5">
          <div className=" p-2 w-40 rounded-md shadow-md">
            <img
              src={logo}
              alt="logo"
              className="w-full h-16 object-contain rounded-md"
            />
          </div>

          <p className="text-sm text-gray-200 leading-relaxed">
            Cure & Counsel connects you with expert doctors and trusted lawyers.
            Fast, reliable, and secure  we help you book the right consultation
            whenever you need it. Your health and legal guidance, simplified.
          </p>

          <div className="flex gap-5 text-2xl mt-2">
            <FaFacebook className="cursor-pointer hover:text-yellow-400 transition" />
            <FaTwitter className="cursor-pointer hover:text-yellow-400 transition" />
            <FaLinkedin className="cursor-pointer hover:text-yellow-400 transition" />
          </div>
        </div>

        {/* -------- BOX 2 -------- */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">COMPANY</h2>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="hover:text-yellow-400 cursor-pointer transition">Home</li>
            <li className="hover:text-yellow-400 cursor-pointer transition">About Us</li>
            <li className="hover:text-yellow-400 cursor-pointer transition">Doctors</li>
            <li className="hover:text-yellow-400 cursor-pointer transition">Lawyers</li>
            <li className="hover:text-yellow-400 cursor-pointer transition">Privacy Policy</li>
          </ul>
        </div>

        {/* -------- BOX 3 -------- */}
        <div>
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">GET IN TOUCH</h2>
          <ul className="space-y-3 text-gray-300 text-sm">
            <li>📞 +92 300 1234567</li>
            <li>✉️ support@cureandcounsel.com</li>
            <li className="pt-2 text-gray-400">
              Lahore, Pakistan
            </li>
          </ul>
        </div>
      </div>

      {/* ===== BOTTOM BAR ===== */}
      <div className="border-t border-gray-700 py-4 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} Cure & Counsel. All rights reserved.
      </div>
    </div>
  );
}

export default Footer;
