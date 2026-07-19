import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from './Button.js';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center glass-card border border-dashed border-slate-800 rounded-xl space-y-4 max-w-lg mx-auto my-6">
      <div className="p-4 bg-indigo-500/10 rounded-full text-indigo-400">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-base font-bold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
