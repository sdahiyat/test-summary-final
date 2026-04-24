import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: 'green' | 'white' | 'gray';
  className?: string;
}

const sizeMap = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
};

const colorMap = {
  green: '#22c55e',
  white: '#ffffff',
  gray: '#9ca3af',
};

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'green',
  className,
}) => {
  const px = sizeMap[size];
  const stroke = colorMap[color];

  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 24 24"
      fill="none"
      className={cn('animate-spin', className)}
      role="status"
      aria-label="Loading"
    >
      <title>Loading...</title>
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={stroke}
        strokeWidth="3"
        strokeOpacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default Spinner;
