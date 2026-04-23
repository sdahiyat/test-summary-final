import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  sublabel?: string;
  color?: 'green' | 'yellow' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const colorMap = {
  green: 'bg-green-500',
  yellow: 'bg-yellow-500',
  red: 'bg-red-500',
  blue: 'bg-blue-500',
};

const heightMap = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  sublabel,
  color = 'green',
  size = 'md',
  showValue = false,
  animated = true,
  className,
}) => {
  const percentage = Math.min(Math.max((value / (max || 100)) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          <div>
            {label && (
              <span className="text-sm font-medium text-gray-700">{label}</span>
            )}
            {sublabel && (
              <span className="text-xs text-gray-500 ml-1.5">{sublabel}</span>
            )}
          </div>
          {showValue && (
            <span className="text-xs text-gray-500">
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div
        className={cn('w-full bg-gray-100 rounded-full overflow-hidden', heightMap[size])}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div
          className={cn(
            'h-full rounded-full',
            colorMap[color],
            animated && 'transition-all duration-500 ease-out'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
