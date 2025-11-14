

import React from 'react';

const alertVariants = {
  default: 'bg-gray-800 border-gray-700 text-gray-300',
  danger: 'bg-red-900/50 border-red-700 text-red-300',
  // FIX: Added 'warning' variant to support its usage in other components.
  warning: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
};

interface AlertProps {
  variant?: keyof typeof alertVariants;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Alert = ({ variant = 'default', title, children, className = '' }: AlertProps) => {
  return (
    <div className={`border-l-4 p-4 rounded-r-lg ${alertVariants[variant]} ${className}`} role="alert">
      <h5 className="font-bold mb-1">{title}</h5>
      {/* FIX: Changed wrapper from <p> to <div> to allow complex children like other divs and icons. */}
      <div className="text-sm">{children}</div>
    </div>
  );
};

export const AlertTitle = ({ children }: { children: React.ReactNode }) => (
  <h5 className="mb-1 font-medium leading-none tracking-tight">{children}</h5>
);

export const AlertDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm [&_p]:leading-relaxed">{children}</div>
);
