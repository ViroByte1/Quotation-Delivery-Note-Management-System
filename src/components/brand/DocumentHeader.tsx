'use client';

import React from 'react';
import { Logo } from './Logo';
import { CompanySettings } from '@/types';

interface DocumentHeaderProps {
  settings: CompanySettings;
}

export function DocumentHeader({ settings }: DocumentHeaderProps) {
  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Top row: Logo + Vertical Line + Arabic & English Company Name */}
      <div className="w-full flex items-center justify-between pb-2 pt-0.5">
        <div className="flex items-center gap-4">
          {/* Circular Gold & Navy Emblem */}
          <Logo size={64} customLogoUrl={settings.logo_url} />

          {/* Thin Vertical Divider */}
          <div className="h-14 w-[1.5px] bg-[#0c2340]/40 flex-shrink-0" />

          {/* Company Names */}
          <div className="flex flex-col justify-center text-left">
            {/* Arabic Name: Connected cursive ligatures, zero letter-spacing to prevent splitting */}
            <h1
              className="text-[23px] font-extrabold text-[#0c2340] leading-tight"
              style={{
                fontFamily: "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif",
                letterSpacing: '0px',
                wordSpacing: 'normal',
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              {settings.company_name_ar || 'مؤسسة قصد وقيمة التجارية'}
            </h1>
            {/* English Name: Bold Navy uppercase */}
            <h2 className="text-[13px] font-black text-[#0c2340] tracking-wide mt-0.5 uppercase font-sans">
              {settings.company_name_en || 'QASD WA QEEMA TRADING EST.'}
            </h2>
          </div>
        </div>
      </div>

      {/* Blue Banner with CR, Location, Phone, Email (Explicit print-color-adjust and dark navy background) */}
      <div
        className="w-full text-white rounded-full py-1.5 px-6 text-center mt-2 shadow-xs border border-[#c5a059]/30"
        style={{
          backgroundColor: '#0c2340',
          color: '#ffffff',
          WebkitPrintColorAdjust: 'exact',
          printColorAdjust: 'exact',
        }}
      >
        <p className="text-[11px] font-semibold tracking-wide flex items-center justify-center gap-3 whitespace-nowrap">
          <span>
            <strong className="text-[#f5e197]">CR No.</strong> {settings.cr_number || '7012340258'}
          </span>
          <span className="text-[#c5a059] font-bold opacity-80">|</span>
          <span>{settings.address || settings.location || 'Ishara Baladeah, Aziziyah, Jeddah 23334'}</span>
          <span className="text-[#c5a059] font-bold opacity-80">|</span>
          <span>
            <strong className="text-[#f5e197]">Phone:</strong> {settings.phone || '053 132 8208'}
          </span>
          <span className="text-[#c5a059] font-bold opacity-80">|</span>
          <span>
            <strong className="text-[#f5e197]">Email:</strong> {settings.email || 'qasdwaqeema@gmail.com'}
          </span>
        </p>
      </div>
    </div>
  );
}
