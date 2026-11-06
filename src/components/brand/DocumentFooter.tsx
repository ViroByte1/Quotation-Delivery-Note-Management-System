'use client';

import React from 'react';
import { SaudiSkyline } from './SaudiSkyline';

interface DocumentFooterProps {
  tagline?: string;
}

export function DocumentFooter({ tagline = 'Building a Brighter Future Together' }: DocumentFooterProps) {
  return (
    <div className="w-full flex flex-col items-center pt-3 pb-2 mt-auto">
      <SaudiSkyline height={36} color="#c5a059" />
      <p className="text-xs sm:text-sm font-semibold text-[#0c2340] tracking-wide mt-1 text-center">
        {tagline}
      </p>
    </div>
  );
}

