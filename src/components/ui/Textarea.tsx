import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  rows?: number;
  autoResize?: boolean;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      hint,
      rows = 3,
      autoResize = false,
      fullWidth = true,
      className,
      id,
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLTextAreaElement>) || innerRef;
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    useEffect(() => {
      if (autoResize && resolvedRef.current) {
        resolvedRef.current.style.height = 'auto';
        resolvedRef.current.style.height = `${resolvedRef.current.scrollHeight}px`;
      }
    }, [value, autoResize, resolvedRef]);

    return (
      <div className={cn(fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}
        <textarea
          ref={resolvedRef}
          id={inputId}
          rows={rows}
          value={value}
          onChange={onChange}
          className={cn(
            'w-full rounded-lg border px-3 py-2 text-sm resize-none',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            'transition-colors duration-150',
            'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-green-500',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p className="mt-1 text-xs text-gray-500">{hint}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;
