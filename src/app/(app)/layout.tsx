import React from 'react';
import { NavBar } from '@/components/navigation/NavBar';
import { ToastProvider } from '@/components/ui/Toast';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="pb-20 md:pb-0 md:ml-64 min-h-screen">
          {children}
        </main>
      </div>
    </ToastProvider>
  );
}
