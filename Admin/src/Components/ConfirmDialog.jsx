import React from "react";
import { confirmable, createConfirmation } from "react-confirm";
import { XIcon, Trash2 } from "lucide-react"; 

const MyDialog = ({ show, proceed, message  }) => {
 
  if (!show) return null; 

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative flex flex-col gap-4">
        {/* Close icon */}
        <XIcon
          className="absolute top-2 right-2 w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-700"
          onClick={() => proceed(false)}
        />

        <div className="flex items-center gap-2">
          <Trash2 className="w-6 h-6 text-red-600" />
          <p className="text-gray-800 text-lg font-semibold">{message}</p>
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition"
            onClick={() => proceed(false)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
            onClick={() => proceed(true)
           }
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Step 2: Make it confirmable and export the function
export const confirm = createConfirmation(confirmable(MyDialog));
