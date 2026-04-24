import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
  children: React.ReactNode;
}

const sizeMap = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  full: 'sm:max-w-full sm:m-4',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnBackdrop = true,
  showCloseButton = true,
  children,
}) => {
  const [mounted, setMounted] = React.useState(false);
  const [visible, setVisible] = React.useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      document.body.classList.add('overflow-hidden');
    } else {
      setVisible(false);
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  if (!mounted) return null;

  const modal = (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-end sm:items-center justify-center',
        'transition-opacity duration-200',
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className={cn(
          'relative bg-white rounded-t-2xl sm:rounded-2xl w-full shadow-xl',
          'transition-transform duration-300',
          sizeMap[size],
          visible ? 'translate-y-0' : 'translate-y-full sm:translate-y-4'
        )}
      >
        {(title || showCloseButton) && (
          <ModalHeader onClose={showCloseButton ? onClose : undefined}>
            {title}
          </ModalHeader>
        )}
        {children}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
};

interface ModalHeaderProps {
  onClose?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export const ModalHeader: React.FC<ModalHeaderProps> = ({
  onClose,
  className,
  children,
}) => (
  <div
    className={cn(
      'flex items-center justify-between px-4 py-4 border-b border-gray-100',
      className
    )}
  >
    <h2 className="text-base font-semibold text-gray-900">{children}</h2>
    {onClose && (
      <button
        onClick={onClose}
        className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Close modal"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
);

interface ModalSectionProps {
  className?: string;
  children: React.ReactNode;
}

export const ModalBody: React.FC<ModalSectionProps> = ({ className, children }) => (
  <div className={cn('p-4 overflow-y-auto', className)}>{children}</div>
);

export const ModalFooter: React.FC<ModalSectionProps> = ({ className, children }) => (
  <div className={cn('p-4 pt-0 flex gap-2 justify-end', className)}>{children}</div>
);

export default Modal;
