'use client';

import React from 'react';
import { Navbar } from './Navbar';
import { DemoBanner } from '@/components/ui/DemoBanner';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <DemoBanner />
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} QASD WA QEEMA TRADING EST. (مؤسسة قصد وقيمة التجارية). All rights reserved.</p>
          <p className="text-[#0c2340] font-semibold">Rabigh City, Kingdom of Saudi Arabia | CR: 7012340258</p>
        </div>
      </footer>
    </div>
  );
}

