import React from 'react';
import { DrData, LawyersData,services } from '../assets/assets';
import { NavLink, useNavigate } from 'react-router-dom';
import dr from '../assets/druncle.jpg';
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

<div className="w-full mt-14 flex flex-col gap-10 px-4 md:px-10 lg:px-20">

  {/* Doctors Card */}
  <div className="group relative bg-gray-100 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between overflow-hidden transform transition-transform duration-500 hover:scale-105">
    {/* Text Box */}
    <div className="md:w-1/2 p-6">
      <h2 className="text-2xl font-semibold mb-4">Why Choose Our Doctors?</h2>
      <p className="text-gray-700 leading-relaxed">
        Cure & Counsel connects you with highly experienced and trusted doctors across Pakistan.
        Thousands of patients rely on our platform for reliable and quick medical assistance. With
        verified profiles, real patient feedback, and instant booking, you get the safest and most
        convenient healthcare experience.
      </p>
    </div>

    {/* Image Box */}
    <div className="md:w-1/2 flex justify-center p-6">
      <img
        src={dr}
        alt="Doctors"
        className="w-48 h-48 rounded-xl object-cover shadow-md"
      />
    </div>
  </div>

  {/* Lawyers Card */}
  <div className="group relative bg-yellow-50 rounded-2xl shadow-md flex flex-col md:flex-row-reverse items-center justify-between overflow-hidden transform transition-transform duration-500 hover:scale-105">
    {/* Text Box */}
    <div className="md:w-1/2 p-6 ">
      <h2 className="text-2xl font-semibold mb-4">Why Choose Our Lawyers?</h2>
      <p className="text-gray-700 leading-relaxed">
        Whether it's property matters, family issues, business contracts, or legal disputes  our
        expert lawyers are here to help. Cure & Counsel ensures you get access to qualified,
        experienced, and trusted legal professionals. Thousands of clients have already solved
        their cases through our platform.
      </p>
    </div>

    {/* Image Box */}
    <div className="md:w-1/2 flex justify-center p-6">
      <img
        src={lawyer}
        alt="Lawyers"
        className="w-48 h-48 rounded-xl object-cover shadow-md"
      />
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
