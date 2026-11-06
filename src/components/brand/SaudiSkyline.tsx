'use client';

import React from 'react';

interface SaudiSkylineProps {
  className?: string;
  height?: number;
  color?: string;
}

export function SaudiSkyline({ className = '', height = 48, color = '#c5a059' }: SaudiSkylineProps) {
  return (
    <div className={`w-full flex items-center justify-center overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 600 80"
        height={height}
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        fill={color}
        xmlns="http://www.w3.org/2000/svg"
        opacity="0.85"
      >
        {/* Base ground line */}
        <rect x="0" y="76" width="600" height="3" fill={color} />

        {/* Skyline building silhouettes - Kingdom Centre, Faisaliah, Towers, Minarets */}
        {/* Far Left small buildings */}
        <rect x="180" y="65" width="14" height="11" />
        <polygon points="187,58 180,65 194,65" />
        <rect x="198" y="55" width="10" height="21" />
        <rect x="212" y="62" width="16" height="14" />
        <rect x="232" y="50" width="12" height="26" />
        <polygon points="238,44 232,50 244,50" />

        {/* Kingdom Centre Silhouette (Tall iconic arched opening) */}
        <g transform="translate(250, 6)">
          {/* Main body */}
          <path d="M 6 70 L 6 12 Q 15 2 24 12 L 24 70 Z" />
          {/* Inverted Arch Opening */}
          <path d="M 10 16 Q 15 24 20 16 Z" fill="#ffffff" />
          {/* Spire at top center of bridge */}
          <rect x="14.5" y="0" width="1" height="5" />
        </g>

        {/* Intermediate modern towers */}
        <rect x="282" y="42" width="14" height="34" />
        <rect x="298" y="52" width="18" height="24" />
        <polygon points="307,46 298,52 316,52" />

        {/* Al Faisaliah Tower (Pyramidal tower with golden globe) */}
        <g transform="translate(320, 14)">
          {/* Tapering pyramid */}
          <polygon points="12,0 0,62 24,62" />
          {/* Golden sphere near top */}
          <circle cx="12" cy="18" r="4.5" fill="#f5e197" />
          {/* Spire tip */}
          <rect x="11.5" y="-6" width="1" height="6" />
        </g>

        {/* Modern financial district skyscrapers */}
        <rect x="350" y="46" width="12" height="30" />
        <rect x="365" y="38" width="15" height="38" />
        <polygon points="372,32 365,38 380,38" />
        <rect x="384" y="54" width="20" height="22" />

        {/* Traditional Minaret & architectural elements */}
        <rect x="408" y="58" width="8" height="18" />
        <polygon points="412,50 408,58 416,58" />
        <circle cx="412" cy="49" r="1.5" />

        <rect x="420" y="64" width="14" height="12" />
        <rect x="438" y="68" width="16" height="8" />
      </svg>
    </div>
  );
}
