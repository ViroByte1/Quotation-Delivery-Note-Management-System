'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Info, Sparkles, ShieldCheck } from 'lucide-react';

export function DemoBanner() {
  const { user } = useAuth();

  return (
    <div className="bg-gradient-to-r from-[#0c2340] via-[#12335c] to-[#0c2340] text-white px-4 py-2 border-b border-[#c5a059]/40 text-xs shadow-sm no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="bg-[#c5a059] text-[#0c2340] font-black text-[10px] px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" /> Live Demo Mode
          </span>
          <span className="text-slate-200 hidden sm:inline">
            You are browsing <strong>QASD WA QEEMA TRADING EST.</strong> system in interactive mode.
          </span>
          <span className="text-slate-200 sm:hidden">
            Interactive Client Demo Mode
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sample-quotation"
            className="text-[#f5e197] hover:underline font-semibold flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" /> View Reference Match
          </Link>

          {!user && (
            <Link
              href="/login"
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-bold px-2.5 py-0.5 rounded text-[11px] transition-colors"
            >
              Sign In
            </Link>
          )}

          {user && (
            <span className="text-slate-300 text-[11px] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#f5e197]" />
              {user.email}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
