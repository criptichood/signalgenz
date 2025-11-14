import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

const Card = ({ className, ...props }: CardProps) => (
  <div className={`bg-gray-800 rounded-lg shadow-2xl border border-gray-700/50 ${className ?? ''}`} {...props} />
);

const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={`p-6 ${className ?? ''}`} {...props} />
);

const CardTitle = ({ className, ...props }: CardProps) => (
  <h3 className={`text-xl font-bold text-white ${className ?? ''}`} {...props} />
);

const CardDescription = ({ className, ...props }: CardProps) => (
  <p className={`text-sm text-gray-400 mt-1 ${className ?? ''}`} {...props} />
);

const CardContent = ({ className, ...props }: CardProps) => (
  <div className={`p-6 ${className ?? ''}`} {...props} />
);

const CardFooter = ({ className, ...props }: CardProps) => (
  <div className={`p-6 pt-0 ${className ?? ''}`} {...props} />
);

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };