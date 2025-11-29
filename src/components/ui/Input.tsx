import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-[#1E293B] mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 bg-[#F6F8FA] border border-transparent rounded-xl text-[#1E293B] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#3366FF] focus:bg-white transition-all ${error ? 'border-[#DC2626]' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-[#DC2626]">{error}</p>
      )}
    </div>
  );
};
