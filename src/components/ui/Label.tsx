import React from 'react';
import { cn } from '@/lib/utils';

interface LabelProps {
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: React.ReactNode;
}

export const Label: React.FC<LabelProps> = ({
  required,
  htmlFor,
  className,
  children,
}) => {
  return (
    <label
      htmlFor={htmlFor}
      className={cn('text-sm font-medium text-gray-700', className)}
    >
      {children}
      {required && (
        <span className="text-red-500 ml-1" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
};

export default Label;
