import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-150 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-[#8FB8A8] hover:bg-[#7AA393] text-[#1C1C1E] font-semibold focus:ring-1 focus:ring-[#8FB8A8]',
    secondary: 'bg-[#E5E4E1] dark:bg-[#38383C] hover:bg-[#D8D7D4] dark:hover:bg-[#48484C] text-[#292826] dark:text-[#EDEDEC]',
    outline: 'bg-transparent border border-[#E5E4E1] dark:border-[#38383C] text-[#292826] dark:text-[#EDEDEC] hover:bg-[#E5E4E1]/40 dark:hover:bg-[#38383C]/40',
    danger: 'bg-[#D89A9A] hover:bg-[#C88A8A] text-[#1C1C1E] font-semibold',
    ghost: 'bg-transparent text-[#7A7873] dark:text-[#9C9C98] hover:bg-[#E5E4E1]/30 dark:hover:bg-[#38383C]/30 hover:text-[#292826] dark:hover:text-[#EDEDEC]'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };

  return (
    <button
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  );
};
