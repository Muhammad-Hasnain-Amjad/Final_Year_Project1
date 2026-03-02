import React from "react";

const TempMessage = ({ type,setIsOpen }) => {

  const content = {
    registered: {
      title: "Registration Successful",
      text: "Your details have been successfully submitted. Our verification team will review your information shortly and notify you once your account is approved.",
      color: "text-green-700"
    },

    verified: {
      title: "Already Verified",
      text: "Your account is already verified and currently active on our platform. You can continue using all services without any restrictions.",
      color: "text-blue-700"
    },

    pending: {
      title: "Verification In Progress",
      text: "We have already received your details and your account is currently under review. Once the verification process is completed, you will be notified promptly.",
      color: "text-orange-600"
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <h2 className={`text-xl font-semibold mb-3 ${content[type].color}`}>
        {content[type].title}
      </h2>

      <p className="text-gray-600 leading-relaxed mb-6">
        {content[type].text}
      </p>
 <button

  onClick={()=>setIsOpen(false)}
  className="bg-yellow-400 text-black font-semibold py-3 px-10 rounded-md hover:bg-yellow-500 transition disabled:opacity-60"
>
  Close
</button>
     
    </div>
  );
};

export default TempMessage;
