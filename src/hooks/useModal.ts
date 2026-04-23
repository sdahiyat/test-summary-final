import { useState } from 'react';

interface UseModalReturn<T> {
  isOpen: boolean;
  data: T | undefined;
  open: (data?: T) => void;
  close: () => void;
  toggle: () => void;
}

export function useModal<T = undefined>(): UseModalReturn<T> {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | undefined>(undefined);

  const open = (payload?: T) => {
    setData(payload);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    // Keep data to avoid flicker during close animation
  };

  const toggle = () => {
    setIsOpen((prev) => !prev);
  };

  return { isOpen, data, open, close, toggle };
}

export default useModal;
