import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98]">
          {label}
        </label>
      )}
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#7A7873] dark:text-[#9C9C98]">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-md bg-white dark:bg-[#26262A] border text-[#292826] dark:text-[#EDEDEC] placeholder-[#7A7873]/50 text-sm transition duration-150 focus:outline-none focus:ring-1 focus:ring-[#8FB8A8] ${
            icon ? 'pl-10' : 'px-3.5'
          } py-2.5 ${
            error ? 'border-[#D89A9A] focus:ring-[#D89A9A]' : 'border-[#E5E4E1] dark:border-[#38383C] focus:border-[#8FB8A8]'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-[#A44949] mt-1">{error}</p>}
    </div>
  );
};
