import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function Container({ children, className = '' }: ContainerProps): JSX.Element {
  return (
    <div className={`max-w-4xl mx-auto px-4 ${className}`}>
      {children}
    </div>
  );
} 