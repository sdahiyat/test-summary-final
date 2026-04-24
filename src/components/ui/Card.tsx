import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const variantMap = {
  default: 'shadow-sm',
  elevated: 'shadow-md',
  outlined: 'border border-gray-200',
};

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'none',
  className,
  onClick,
  children,
}) => {
  return (
    <div
      className={cn(
        'bg-white rounded-xl',
        variantMap[variant],
        paddingMap[padding],
        onClick && 'cursor-pointer hover:shadow-md transition-shadow',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
};

interface CardSectionProps {
  className?: string;
  children: React.ReactNode;
}

export const CardHeader: React.FC<CardSectionProps> = ({ className, children }) => (
  <div className={cn('px-4 pt-4 pb-2 font-semibold text-gray-900', className)}>
    {children}
  </div>
);

export const CardBody: React.FC<CardSectionProps> = ({ className, children }) => (
  <div className={cn('px-4 py-2', className)}>{children}</div>
);

export const CardFooter: React.FC<CardSectionProps> = ({ className, children }) => (
  <div className={cn('px-4 pt-2 pb-4 border-t border-gray-100', className)}>
    {children}
  </div>
);

export default Card;
