'use client';

import { NavBar } from '@/components/navigation';
import React from 'react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="md:pl-64 pb-16 md:pb-0">
        <div className="max-w-2xl mx-auto px-4 py-6">{children}</div>
      </main>
    </div>
  );
}
