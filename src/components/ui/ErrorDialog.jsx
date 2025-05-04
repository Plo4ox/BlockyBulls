import React from "react";
import { X } from "lucide-react";

const ErrorDialog = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="m-4 w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-800 p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">{title || "Error"}</h3>
          <button
            onClick={onClose}
            className="rounded-full p-1 transition-colors hover:bg-zinc-700"
          >
            <X className="h-5 w-5 text-zinc-400" />
          </button>
        </div>
        <p className="mb-6 text-zinc-300">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorDialog;
