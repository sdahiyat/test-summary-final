'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const textSizeMap = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
};

function getInitials(name?: string): string {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0]?.toUpperCase() ?? '';
  return ((words[0][0] ?? '') + (words[words.length - 1][0] ?? '')).toUpperCase();
}

const UserIcon: React.FC<{ size: number }> = ({ size }) => (
  <svg
    width={size * 0.6}
    height={size * 0.6}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  name,
  size = 'md',
  className,
}) => {
  const [imgError, setImgError] = useState(false);
  const px = sizeMap[size];
  const initials = getInitials(name);
  const showImage = src && !imgError;

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden flex items-center justify-center flex-shrink-0',
        !showImage && 'bg-green-500 text-white',
        className
      )}
      style={{ width: px, height: px }}
      aria-label={alt || name || 'User avatar'}
    >
      {showImage ? (
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          width={px}
          height={px}
          className="object-cover w-full h-full"
          onError={() => setImgError(true)}
        />
      ) : initials ? (
        <span className={cn('font-semibold', textSizeMap[size])}>{initials}</span>
      ) : (
        <span className="text-white">
          <UserIcon size={px} />
        </span>
      )}
    </div>
  );
};

export default Avatar;
