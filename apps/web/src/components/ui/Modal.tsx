import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dim Daylight Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className={`relative w-full ${maxWidths[maxWidth]} bg-white dark:bg-[#26262A] rounded-xl p-6 shadow-xl border border-[#E5E4E1] dark:border-[#38383C] z-10 text-[#292826] dark:text-[#EDEDEC]`}>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E5E4E1] dark:border-[#38383C]">
          <h3 className="text-base font-bold text-[#292826] dark:text-[#EDEDEC]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#7A7873] dark:text-[#9C9C98] hover:text-[#292826] dark:hover:text-[#EDEDEC] hover:bg-[#E5E4E1]/40 dark:hover:bg-[#38383C]/40 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
