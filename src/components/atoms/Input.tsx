import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, error, id, className, ...props }, ref) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={inputId} className="text-sm font-medium text-secondary">
        {label}
      </label>
      <input
        ref={ref}
        id={inputId}
        className={`w-full px-4 py-3 rounded-lg bg-surface border-2 ${error ? 'border-red-500' : 'border-accent/30 focus:border-accent'} text-primary placeholder-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/50 ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
Input.displayName = 'Input';
