'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { cn } from '@/lib/utils';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastItem = { ...toast, id };
      setToasts((prev) => [...prev, newToast]);

      const duration = toast.duration ?? 4000;
      if (duration > 0) {
        const timer = setTimeout(() => removeToast(id), duration);
        timers.current.set(id, timer);
      }
    },
    [removeToast]
  );

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

const toastIconMap: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const toastBorderMap: Record<ToastType, string> = {
  success: 'border-l-4 border-green-500',
  error: 'border-l-4 border-red-500',
  warning: 'border-l-4 border-yellow-500',
  info: 'border-l-4 border-blue-500',
};

interface ToastItemComponentProps {
  toast: ToastItem;
  onDismiss: (id: string) => void;
}

const ToastItemComponent: React.FC<ToastItemComponentProps> = ({
  toast,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger slide-in animation
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={cn(
        'bg-white rounded-lg shadow-lg overflow-hidden',
        'flex items-start gap-3 p-3 pr-2',
        'transition-all duration-200',
        toastBorderMap[toast.type],
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
      role="alert"
      aria-live="assertive"
    >
      <span className="text-base flex-shrink-0 mt-0.5" aria-hidden="true">
        {toastIconMap[toast.type]}
      </span>
      <div className="flex-1 min-w-0">
        {toast.title && (
          <p className="text-sm font-semibold text-gray-900">{toast.title}</p>
        )}
        <p className="text-sm text-gray-600">{toast.message}</p>
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="flex-shrink-0 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
        aria-label="Dismiss notification"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onDismiss,
}) => {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-4 right-4 z-[60] flex flex-col gap-2 max-w-sm w-full px-4 sm:px-0 sm:w-auto pointer-events-none"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItemComponent toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  const { addToast, removeToast } = ctx;

  return {
    addToast,
    removeToast,
    success: (message: string, title?: string) =>
      addToast({ type: 'success', message, title }),
    error: (message: string, title?: string) =>
      addToast({ type: 'error', message, title }),
    warning: (message: string, title?: string) =>
      addToast({ type: 'warning', message, title }),
    info: (message: string, title?: string) =>
      addToast({ type: 'info', message, title }),
  };
}
