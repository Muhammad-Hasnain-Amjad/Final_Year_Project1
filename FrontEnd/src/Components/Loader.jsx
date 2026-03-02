import React from "react";

export default function Loader({ show }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="w-20 h-20 border-4 border-t-yellow-400 border-b-yellow-400 border-l-black border-r-black rounded-full animate-spin"></div>
    </div>
  );
}
