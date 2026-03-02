import React, { useState } from "react";
import NavBar from "../Components/NavBar";
import Footer from "../Components/Footer";
import emailjs from "@emailjs/browser";

export default function Contactus() {
  const publickey="RB4NfXrUersV92FRZ"
   const serviceId="service_5yr61j2"
   const templateId="template_earfujd"


  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .send(
       serviceId,
        templateId,
        {
          user_name: form.name,
          user_email: form.email,
          user_message: form.message,
        },
       publickey
      )
      .then(() => {
        console.log("Email sent successfully");

        // optional: clear form
        setForm({ name: "", email: "", message: "" });
      })
      .catch((error) => {
        console.error("Email failed:", error);
      });
      
  };

  return (
    <div className="h-screen overflow-y-scroll scrollbar-hide">
      <NavBar />

      <div className="min-h-screen flex items-center justify-center bg-black px-4 py-10">
        <form
          onSubmit={sendEmail}
          className="w-full max-w-lg bg-black text-white p-8 rounded-2xl
                     shadow-[0_80px_400px_rgba(250,204,21,0.20)]
                     focus-within:ring-4 focus-within:ring-yellow-400/40 transition-all"
        >
          <h1 className="text-3xl font-semibold text-center mb-6">
            Contact Us
          </h1>

          {/* Name */}
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block">Full Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Email */}
          <label className="block mb-4">
            <span className="text-sm font-medium mb-2 block">Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          {/* Message */}
          <label className="block mb-6">
            <span className="text-sm font-medium mb-2 block">Message</span>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="4"
              required
              className="w-full bg-white text-black px-4 py-3 rounded-md 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </label>

          <button
            type="submit"
            className="w-full bg-yellow-400 text-black font-semibold py-3 rounded-md
                       hover:bg-yellow-500 transition focus:ring-2 focus:ring-yellow-400"
          >
            Send Message
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
