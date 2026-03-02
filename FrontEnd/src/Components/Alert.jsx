import React, { useEffect } from "react";

function Alert({ type , message, onClose, duration }) {
  const colors = {
    error: "bg-red-100 text-red-800 border-red-400",
    success: "bg-green-100 text-green-800 border-green-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`border-l-4 p-4 rounded-md shadow-md mb-4 ${colors[type]}`}
      role="alert"
    >
      <div className="flex justify-between items-center">
        <span>{message}</span>
        <button onClick={onClose} className="font-bold ml-4">✖</button>
      </div>
    </div>
  );
}

export default Alert;
