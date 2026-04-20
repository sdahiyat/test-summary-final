import React from 'react';
import { cn } from '@/lib/cn';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const sizeMap = {
  sm: 16,
  md: 24,
  lg: 36,
  xl: 48,
};

const colorMap = {
  primary: 'text-primary-600',
  white: 'text-white',
  gray: 'text-gray-400',
};

export function Spinner({ size = 'md', color = 'primary', className }: SpinnerProps) {
  const px = sizeMap[size];
  return (
    <svg
      aria-label="Loading"
      role="status"
      className={cn('animate-spin', colorMap[color], className)}
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  );
}

export function FullPageSpinner() {
  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
      <Spinner size="xl" color="primary" />
    </div>
  );
}
