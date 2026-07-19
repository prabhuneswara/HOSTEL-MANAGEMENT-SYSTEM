import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'urgent' | 'high' | 'medium' | 'low' | 'success' | 'warning' | 'info' | 'neutral';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'neutral', 
  className = '',
  dot = true
}) => {
  const styles = {
    urgent: 'bg-[#D89A9A]/15 text-[#A44949] dark:text-[#E2A7A7] border-[#D89A9A]/30 font-medium',
    high: 'bg-[#E8B4A0]/15 text-[#B25D43] dark:text-[#F0C2B2] border-[#E8B4A0]/30 font-medium',
    medium: 'bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] border-[#8FB8A8]/30',
    low: 'bg-[#E5E4E1]/40 dark:bg-[#38383C]/40 text-[#7A7873] dark:text-[#9C9C98] border-[#E5E4E1] dark:border-[#38383C]',
    success: 'bg-[#A8C4A2]/15 text-[#4F7348] dark:text-[#B8D4B2] border-[#A8C4A2]/30 font-medium',
    warning: 'bg-[#E8B4A0]/15 text-[#B25D43] dark:text-[#F0C2B2] border-[#E8B4A0]/30 font-medium',
    info: 'bg-[#8FB8A8]/15 text-[#4C7565] dark:text-[#A3CCA3] border-[#8FB8A8]/30 font-medium',
    neutral: 'bg-[#E5E4E1]/50 dark:bg-[#38383C]/50 text-[#7A7873] dark:text-[#9C9C98] border-[#E5E4E1] dark:border-[#38383C]'
  };

  const dotColors = {
    urgent: 'bg-[#A44949]',
    high: 'bg-[#B25D43]',
    medium: 'bg-[#4C7565]',
    low: 'bg-[#7A7873]',
    success: 'bg-[#4F7348]',
    warning: 'bg-[#B25D43]',
    info: 'bg-[#4C7565]',
    neutral: 'bg-[#7A7873]'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono border tracking-tight ${styles[variant]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      <span>{children}</span>
    </span>
  );
};
