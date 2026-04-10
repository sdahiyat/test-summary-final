'use client';

import React from 'react';
import { Card } from './Card';

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <svg
      className={['animate-spin text-primary-600', sizeClasses[size], className]
        .filter(Boolean)
        .join(' ')}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
};

export interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

export const SkeletonLine: React.FC<SkeletonLineProps> = ({
  width = '100%',
  height = '1rem',
  className = '',
}) => {
  return (
    <div
      className={['animate-pulse bg-gray-200 rounded', className].filter(Boolean).join(' ')}
      style={{ width, height }}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <SkeletonLine width="40%" height="1.25rem" />
        <SkeletonLine width="20%" height="1.25rem" />
      </div>
      <SkeletonLine width="60%" height="1rem" />
      <div className="flex gap-3">
        <SkeletonLine width="30%" height="0.875rem" />
        <SkeletonLine width="30%" height="0.875rem" />
        <SkeletonLine width="30%" height="0.875rem" />
      </div>
      <div className="flex gap-2 pt-1">
        <SkeletonLine width="45%" height="2rem" />
        <SkeletonLine width="45%" height="2rem" />
      </div>
    </Card>
  );
};

export const PageLoader: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};
