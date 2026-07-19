import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  hoverEffect = true
}) => {
  return (
    <div
      onClick={onClick}
      className={`flat-card bg-white dark:bg-[#26262A] rounded-xl p-5 border border-[#E5E4E1] dark:border-[#38383C] ${
        hoverEffect ? 'flat-card-hover' : ''
      } ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
