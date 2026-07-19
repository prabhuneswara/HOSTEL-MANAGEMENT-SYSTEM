import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { label: string; value: string }[];
  error?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  error,
  className = '',
  id,
  ...props
}) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={selectId} className="block text-xs font-mono font-semibold uppercase tracking-wider text-[#7A7873] dark:text-[#9C9C98]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-md bg-white dark:bg-[#26262A] border border-[#E5E4E1] dark:border-[#38383C] text-[#292826] dark:text-[#EDEDEC] text-sm px-3.5 py-2.5 transition duration-150 focus:outline-none focus:ring-1 focus:ring-[#8FB8A8] ${
          error ? 'border-[#D89A9A]' : 'border-[#E5E4E1] dark:border-[#38383C]'
        } ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-white dark:bg-[#26262A] text-[#292826] dark:text-[#EDEDEC]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-[#A44949] mt-1">{error}</p>}
    </div>
  );
};
