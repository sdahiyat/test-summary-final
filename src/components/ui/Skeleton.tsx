import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ width, height, className }) => {
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={cn('animate-pulse bg-gray-200 rounded', className)}
      style={style}
      aria-hidden="true"
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? '60%' : '100%'}
          className="rounded"
        />
      ))}
    </div>
  );
};

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const avatarSizeMap = { sm: 32, md: 40, lg: 48 };

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className,
}) => {
  const px = avatarSizeMap[size];
  return (
    <Skeleton
      width={px}
      height={px}
      className={cn('rounded-full flex-shrink-0', className)}
    />
  );
};

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => {
  return (
    <div
      className={cn('bg-white rounded-xl shadow-sm p-4 space-y-3', className)}
      aria-hidden="true"
    >
      <Skeleton height={20} width="50%" className="rounded" />
      <SkeletonText lines={2} />
      <Skeleton height={16} width="30%" className="rounded" />
    </div>
  );
};

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({
  count = 3,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)} aria-busy="true" aria-label="Loading...">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
