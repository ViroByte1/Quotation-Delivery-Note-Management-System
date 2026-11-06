'use client';

import React from 'react';
import { Logo } from './Logo';
import { CompanySettings } from '@/types';

interface DocumentHeaderProps {
  settings: CompanySettings;
}

export function DocumentHeader({ settings }: DocumentHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      {/* Top row: Logo + Separator + Company Name */}
      <div className="w-full flex items-center justify-between pb-2 pt-0.5">
        <div className="flex items-center gap-3 sm:gap-5">
          <Logo size={62} customLogoUrl={settings.logo_url} />
          
          {/* Vertical Separator */}
          <div className="h-12 w-[1.5px] bg-[#c5a059]/40 sm:block hidden" />

          {/* Company Names */}
          <div className="flex flex-col text-left">
            <h1
              className="text-lg sm:text-2xl font-extrabold text-[#0c2340] tracking-tight leading-tight"
              style={{ fontFamily: 'var(--font-cairo), Arial, sans-serif' }}
              dir="rtl"
            >
              {settings.company_name_ar || 'مؤسسة قصد وقيمة التجارية'}
            </h1>
            <h2 className="text-xs sm:text-sm font-black text-[#0c2340] tracking-wide mt-0.5">
              {settings.company_name_en || 'QASD WA QEEMA TRADING EST.'}
            </h2>
          </div>
        </div>
      </div>

      {/* Blue Banner with CR, Location, Phone, Email */}
      <div className="w-full bg-[#0c2340] text-white rounded-full py-1 px-4 text-center mt-0.5 shadow-xs border border-[#c5a059]/30">
        <p className="text-[10px] sm:text-xs font-medium tracking-wide flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5">
          <span>
            <strong className="text-[#f5e197]">CR No.</strong> {settings.cr_number}
          </span>
          <span className="text-[#c5a059] opacity-75">|</span>
          <span>{settings.location}</span>
          <span className="text-[#c5a059] opacity-75">|</span>
          <span>
            <strong className="text-[#f5e197]">Phone:</strong> {settings.phone}
          </span>
          <span className="text-[#c5a059] opacity-75">|</span>
          <span>
            <strong className="text-[#f5e197]">Email:</strong> {settings.email}
          </span>
        </p>
      </div>
    </div>
  );
}
