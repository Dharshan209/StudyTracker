// components/LoginModal.jsx
import React from 'react';
import { LogIn, X } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, signInWithGoogle }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
    >
      {/* Modal Container */}
      <div
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicking inside
        className="relative rounded-xl shadow-xl w-full max-w-sm m-4 bg-white"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-full transition-colors text-gray-500 hover:bg-gray-100"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-center mb-2 text-gray-900">
            Welcome Back
          </h2>
          <p className="text-center text-sm mb-6 text-gray-600">
            Sign in to continue to DSA Tracker.
          </p>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center py-3 px-4 rounded-lg font-semibold text-base transition-colors bg-blue-500 hover:bg-blue-600 text-white"
          >
            <LogIn size={20} className="mr-2" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;