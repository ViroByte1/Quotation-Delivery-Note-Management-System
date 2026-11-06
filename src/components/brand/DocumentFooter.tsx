'use client';

import React from 'react';
import { SaudiSkyline } from './SaudiSkyline';

interface DocumentFooterProps {
  tagline?: string;
}

export function DocumentFooter({ tagline = 'Building a Brighter Future Together' }: DocumentFooterProps) {
  return (
    <div className="w-full flex flex-col items-center pt-1 pb-1 mt-auto">
      <SaudiSkyline height={28} color="#c5a059" />
      <p className="text-[11px] sm:text-xs font-semibold text-[#0c2340] tracking-wide mt-0.5 text-center">
        {tagline}
      </p>
    </div>
  );
}
