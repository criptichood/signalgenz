'use client';

import React, { useEffect } from 'react';
import { CheckCircle, X, Info, AlertCircle, Check } from 'lucide-react';

interface ToastProps {
  message: string;
  variant?: 'success' | 'warning' | 'error' | 'default';
  onClose: () => void;
  duration?: number;
}

export const Toast = ({ message, variant = 'default', onClose, duration = 5000 }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
  }, [onClose, duration]);

  const variantConfig = {
    success: {
      icon: <Check className="w-5 h-5 mr-3" />,
      className: "border-green-500 bg-green-500/10 text-green-500"
    },
    warning: {
      icon: <Info className="w-5 h-5 mr-3" />,
      className: "border-yellow-500 bg-yellow-500/10 text-yellow-500"
    },
    error: {
      icon: <AlertCircle className="w-5 h-5 mr-3" />,
      className: "border-red-500 bg-red-500/10 text-red-500"
    },
    default: {
      icon: <Info className="w-5 h-5 mr-3" />,
      className: "border-gray-500 bg-gray-500/10 text-gray-500"
    }
  };

  const config = variantConfig[variant];

  return (
    <div className="fixed top-6 right-6 z-50 animate-toast-in-right">
      <div className={`flex items-center w-full max-w-sm p-4 space-x-4 rounded-lg shadow-lg border ${config.className}`}>
        {config.icon}
        <div className="text-sm font-medium">
          {message}
        </div>
        <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-300">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};