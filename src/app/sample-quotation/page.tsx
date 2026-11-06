'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { DemoBanner } from '@/components/ui/DemoBanner';
import { QuotationDocument } from '@/components/documents/QuotationDocument';
import { DEFAULT_COMPANY_SETTINGS } from '@/lib/constants';
import { Quotation } from '@/types';
import { exportToPDF, printDocument } from '@/lib/pdf-export';
import {
  Eye,
  Download,
  Printer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Columns,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

// Sample matching the reference visual
const SAMPLE_MATCH_QUOTATION: Quotation = {
  id: 'sample-reference-match',
  quotation_number: 'QWQ-2026-0104',
  date: '2026-02-18',
  valid_until: '2026-03-20',
  reference_number: 'RFQ-PETRO-26-889',
  client_name: 'Eng. Tariq Al-Ghamdi',
  client_company: 'Rabigh Petrochemical Services Co.',
  client_phone: '055 946 8908',
  client_email: 'procurement@rabighpetro.sa',
  client_address: 'Petro Rabigh Industrial Complex, Gate 4, Rabigh City',
  project_name: 'Refinery Maintenance & Piping Safety Supplies',
  items: [
    {
      id: 's-1',
      s_no: 1,
      description: 'Heavy Duty Stainless Steel 316 Flange Gaskets (4 Inch ANSI 300#)',
      quantity: 50,
      unit_price: 185.00,
      total: 9250.00,
    },
    {
      id: 's-2',
      s_no: 2,
      description: 'Industrial Safety Harness Full Body with Shock Absorber (CE Certified)',
      quantity: 25,
      unit_price: 420.00,
      total: 10500.00,
    },
    {
      id: 's-3',
      s_no: 3,
      description: 'High Pressure Hydraulic Hose Assembly (1/2" x 15m, 5000 PSI)',
      quantity: 12,
      unit_price: 650.00,
      total: 7800.00,
    },
    {
      id: 's-4',
      s_no: 4,
      description: 'Fire Retardant Anti-Static Coveralls (Navy Blue, Size L & XL)',
      quantity: 60,
      unit_price: 210.00,
      total: 12600.00,
    },
  ],
  subtotal: 40150.00,
  vat_rate: 15,
  vat_amount: 6022.50,
  grand_total: 46172.50,
  terms_and_conditions: [
    'Payment Terms: 50% advance, 50% upon completion of work.',
    'Quotation is valid for 30 days from the date of issuance.',
    'All prices are quoted in Saudi Riyals and inclusive of standard services unless otherwise stated.',
  ],
  status: 'accepted',
  authorized_person: 'Abid Mughal',
  authorized_designation: 'Managing Director',
  created_at: '2026-02-18T10:00:00Z',
  updated_at: '2026-02-18T10:00:00Z',
};

export default function SampleQuotationMatchPage() {
  const [viewMode, setViewMode] = useState<'comparison' | 'recreated_only' | 'original_only'>('comparison');
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    toast.info('Generating high-resolution client PDF...');
    try {
      await exportToPDF('quotation-print-area', 'QASD-WA-QEEMA-Reference-Quotation');
      toast.success('Downloaded client quotation PDF!');
    } catch {
      toast.error('PDF export failed. You can use the Print button.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <DemoBanner />
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Banner Section */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-amber-50 text-[#0c2340] border border-[#c5a059]/40 px-3 py-1 rounded-full text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#c5a059]" />
              Client Reference Fidelity Verification
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
              Sample Quotation &mdash; Visual Match Inspection
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
              Inspect how the client&apos;s physical reference document has been recreated in clean, responsive HTML/PDF elements with dark navy headers, gold borders, 15% VAT calculations, and Saudi skyline branding.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => printDocument()}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
            </button>

            <button
              disabled={downloading}
              onClick={handleDownload}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 border border-[#c5a059]"
            >
              <Download className="w-3.5 h-3.5 text-[#f5e197]" />
              {downloading ? 'Exporting...' : 'Download PDF'}
            </button>

            <Link
              href="/dashboard/quotations/new"
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-4 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
            >
              Create New Quotation <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center justify-center gap-2">
          <div className="bg-white border border-slate-200 p-1 rounded-xl shadow-xs inline-flex">
            <button
              onClick={() => setViewMode('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'comparison'
                  ? 'bg-[#0c2340] text-[#f5e197]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Columns className="w-3.5 h-3.5" /> Side-by-Side Comparison
            </button>
            <button
              onClick={() => setViewMode('recreated_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'recreated_only'
                  ? 'bg-[#0c2340] text-[#f5e197]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Recreated Document
            </button>
            <button
              onClick={() => setViewMode('original_only')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                viewMode === 'original_only'
                  ? 'bg-[#0c2340] text-[#f5e197]'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" /> Client Reference Image
            </button>
          </div>
        </div>

        {/* Content Views */}
        {viewMode === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Original Reference Image */}
            <div className="space-y-3">
              <div className="bg-[#0c2340] text-white p-3 rounded-xl flex items-center justify-between text-xs font-bold border border-[#c5a059]/40">
                <span>CLIENT REFERENCE SAMPLE</span>
                <span className="text-[#f5e197] font-normal text-[11px]">Supplied by client</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/sample-quotation-reference.jpg"
                  alt="Client Original Quotation Sample"
                  className="w-full h-auto rounded border border-slate-200 object-contain shadow-xs"
                />
              </div>
            </div>

            {/* Right: Recreated Dynamic Document */}
            <div className="space-y-3">
              <div className="bg-[#0c2340] text-white p-3 rounded-xl flex items-center justify-between text-xs font-bold border border-[#c5a059]/40">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059]" /> SYSTEM GENERATED PDF VIEW
                </span>
                <span className="text-[#f5e197] font-normal text-[11px]">100% Vector &amp; Live Data</span>
              </div>
              <div className="overflow-x-auto">
                <QuotationDocument
                  quotation={SAMPLE_MATCH_QUOTATION}
                  settings={DEFAULT_COMPANY_SETTINGS}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'recreated_only' && (
          <div className="overflow-x-auto flex justify-center pb-8">
            <QuotationDocument
              quotation={SAMPLE_MATCH_QUOTATION}
              settings={DEFAULT_COMPANY_SETTINGS}
            />
          </div>
        )}

        {viewMode === 'original_only' && (
          <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/sample-quotation-reference.jpg"
              alt="Client Original Reference"
              className="w-full h-auto rounded border border-slate-200 shadow-sm"
            />
          </div>
        )}
      </main>
    </div>
  );
}
