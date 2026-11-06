'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  customLogoUrl?: string;
  showText?: boolean;
}

export function Logo({ className = '', size = 56, customLogoUrl, showText = false }: LogoProps) {
  if (customLogoUrl) {
    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={customLogoUrl}
          alt="QASD WA QEEMA TRADING EST."
          style={{ width: size, height: size, objectFit: 'contain' }}
          className="rounded-full shadow-sm"
        />
        {showText && (
          <div className="flex flex-col">
            <span className="font-bold text-[#0c2340] text-sm tracking-wide">
              مؤسسة قصد وقيمة التجارية
            </span>
            <span className="font-extrabold text-[#0c2340] text-xs tracking-wider">
              QASD WA QEEMA TRADING EST.
            </span>
          </div>
        )}
      </div>
    );
  }

  // Exact vector reproduction of the client's circular gold & navy emblem
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="filter drop-shadow-sm"
        >
          {/* Outer Gold Ring */}
          <circle cx="50" cy="46" r="42" stroke="url(#goldGrad)" strokeWidth="3.5" fill="#0c2340" />
          <circle cx="50" cy="46" r="39" stroke="url(#goldGrad)" strokeWidth="1" fill="#0c2340" opacity="0.6" />

          {/* Golden Interlinked Stylized QQ Monogram */}
          <g transform="translate(18, 14)">
            {/* Left Q */}
            <ellipse cx="26" cy="32" rx="16" ry="19" stroke="url(#goldGrad)" strokeWidth="4.2" fill="none" />
            <path d="M 33 42 L 44 48" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />

            {/* Right Q (intertwined) */}
            <ellipse cx="38" cy="32" rx="16" ry="19" stroke="url(#goldGrad)" strokeWidth="4.2" fill="none" />
            <path d="M 45 42 L 54 48" stroke="url(#goldGrad)" strokeWidth="4.5" strokeLinecap="round" />

            {/* Top Star Accent */}
            <polygon points="32,9 33.5,13 38,13 34,16 35.5,20 32,17.5 28.5,20 30,16 26,13 30.5,13" fill="url(#goldGrad)" />
          </g>

          {/* Underneath Gold Ribbon/Swoosh */}
          <path
            d="M 12 76 C 30 92, 70 92, 88 76 C 75 84, 25 84, 12 76 Z"
            fill="url(#goldGrad)"
          />

          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f5e197" />
              <stop offset="50%" stopColor="#c5a059" />
              <stop offset="100%" stopColor="#9a7428" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span className="font-bold text-[#0c2340] text-sm tracking-wide" style={{ fontFamily: 'var(--font-cairo), sans-serif' }}>
            مؤسسة قصد وقيمة التجارية
          </span>
          <span className="font-black text-[#0c2340] text-xs tracking-wider">
            QASD WA QEEMA TRADING EST.
          </span>
        </div>
      )}
    </div>
  );
}

