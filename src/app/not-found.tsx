import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/brand/Logo';
import { ArrowLeft, FileQuestion } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 text-center space-y-5">
        <div className="flex justify-center">
          <Logo size={60} />
        </div>
        <div className="w-12 h-12 rounded-full bg-amber-50 text-[#c5a059] flex items-center justify-center mx-auto">
          <FileQuestion className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-[#0c2340]">Page Not Found</h2>
          <p className="text-xs text-slate-500 mt-1">
            The quotation, document, or page you are looking for does not exist.
          </p>
        </div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-[#0c2340] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs hover:bg-[#12335c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#f5e197]" />
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

