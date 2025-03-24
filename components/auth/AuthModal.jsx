/**
 * AuthModal.jsx
 * 
 * Modal component for authentication that can toggle between sign-in and sign-up views
 */
import React, { useState, useEffect } from 'react';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { X } from 'lucide-react';

const AuthModal = ({ isOpen, onClose, initialView = 'signin' }) => {
  const [view, setView] = useState(initialView);
  
  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
    }
  }, [isOpen, initialView]);
  
  // Handle successful authentication
  const handleAuthSuccess = () => {
    if (onClose) {
      onClose();
    }
  };
  
  // If modal is not open, don't render anything
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Backdrop overlay */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      ></div>
      
      {/* Modal content */}
      <div className="relative bg-gray-850 rounded-lg shadow-xl max-w-md w-full mx-4 z-10 overflow-hidden">
        {/* Close button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        
        {/* Modal header */}
        <div className="flex border-b border-gray-700">
          <button
            className={`flex-1 py-4 px-4 text-center font-medium ${
              view === 'signin'
                ? 'text-white border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setView('signin')}
          >
            Sign In
          </button>
          <button
            className={`flex-1 py-4 px-4 text-center font-medium ${
              view === 'signup'
                ? 'text-white border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setView('signup')}
          >
            Create Account
          </button>
        </div>
        
        {/* Modal body */}
        <div className="p-6">
          {view === 'signin' ? (
            <SignIn 
              onSuccess={handleAuthSuccess} 
              onSwitchView={() => setView('signup')}
            />
          ) : (
            <SignUp 
              onSuccess={handleAuthSuccess} 
              onSwitchView={() => setView('signin')}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
