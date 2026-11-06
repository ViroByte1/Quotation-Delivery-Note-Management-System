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

  // Use solid colors everywhere — NO url(#gradient) references.
  // SVG gradient `url()` refs are stripped by browser print engines and html2canvas clones.
  const gold = '#c5a059';
  const navy = '#0c2340';
  const goldLight = '#f5e197';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div style={{ width: size, height: size }} className="relative flex-shrink-0">
        <svg
          viewBox="0 0 100 100"
          width={size}
          height={size}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Navy background circle */}
          <circle cx="50" cy="46" r="44" fill={navy} />

          {/* Outer gold border ring */}
          <circle cx="50" cy="46" r="43" stroke={gold} strokeWidth="2.5" fill="none" />
          <circle cx="50" cy="46" r="39" stroke={gold} strokeWidth="0.8" fill="none" opacity="0.5" />

          {/* Left Q */}
          <ellipse cx="37" cy="46" rx="14" ry="17" stroke={gold} strokeWidth="4" fill="none" />
          <line x1="45" y1="56" x2="52" y2="62" stroke={gold} strokeWidth="4.5" strokeLinecap="round" />

          {/* Right Q (overlapping) */}
          <ellipse cx="51" cy="46" rx="14" ry="17" stroke={goldLight} strokeWidth="4" fill="none" opacity="0.85" />
          <line x1="59" y1="56" x2="66" y2="62" stroke={goldLight} strokeWidth="4.5" strokeLinecap="round" opacity="0.85" />

          {/* Top 5-point Star */}
          <polygon
            points="44,16 45.5,21 51,21 46.5,24 48,29 44,26.5 40,29 41.5,24 37,21 42.5,21"
            fill={gold}
          />

          {/* Gold bottom swoosh / ribbon */}
          <path
            d="M 14 76 C 30 90, 70 90, 86 76 C 72 83, 28 83, 14 76 Z"
            fill={gold}
          />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col">
          <span
            className="font-bold text-[#0c2340] text-sm tracking-wide"
            style={{ fontFamily: 'var(--font-cairo), sans-serif' }}
          >
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
