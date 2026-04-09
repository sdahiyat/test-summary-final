import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './Label';

interface FormFieldProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  hint,
  required,
  htmlFor,
  className,
  children,
}) => {
  return (
    <div className={cn('mb-4', className)}>
      {label && (
        <div className="mb-1">
          <Label htmlFor={htmlFor} required={required}>
            {label}
          </Label>
        </div>
      )}
      {children}
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
};

export default FormField;
