import React from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantMap = {
  primary: 'bg-green-500 hover:bg-green-600 text-white focus:ring-green-500',
  secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-400',
  ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
  danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500',
  outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-400',
};

const sizeMap = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

const spinnerSizeMap: Record<string, 'xs' | 'sm' | 'md'> = {
  sm: 'xs',
  md: 'sm',
  lg: 'md',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  className,
  children,
  ...props
}) => {
  const isDisabled = disabled || loading;
  const spinnerColor = variant === 'primary' || variant === 'danger' ? 'white' : 'gray';

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium',
        'focus:outline-none focus:ring-2 focus:ring-offset-1',
        'transition-colors duration-150',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variantMap[variant],
        sizeMap[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <Spinner size={spinnerSizeMap[size]} color={spinnerColor} />
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  );
};

export default Button;
