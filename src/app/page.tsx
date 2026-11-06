'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { SaudiSkyline } from '@/components/brand/SaudiSkyline';
import { useAuth } from '@/lib/auth-context';
import {
  FileText,
  Truck,
  Download,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Eye,
  Sparkles,
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const { demoLogin } = useAuth();

  const handleEnterDemo = () => {
    demoLogin();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-[#c5a059]/30">
      {/* Top Banner */}
      <div className="bg-[#0c2340] text-slate-200 text-xs py-2 px-4 border-b border-[#c5a059]/30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse" />
            <span className="font-semibold text-white">Rabigh City, Kingdom of Saudi Arabia</span>
            <span className="text-[#c5a059] hidden sm:inline">•</span>
            <span className="hidden sm:inline">CR No. 7012340258</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Phone: <strong>059 946 8908</strong></span>
            <span className="hidden md:inline">Email: <strong>info@brightwaytrading.sa</strong></span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo size={52} />
            <div className="flex flex-col">
              <span
                className="font-extrabold text-[#0c2340] text-lg sm:text-xl tracking-tight leading-none"
                style={{ fontFamily: 'var(--font-cairo), sans-serif' }}
              >
                مؤسسة قصد وقيمة التجارية
              </span>
              <span className="text-xs sm:text-sm font-black text-[#0c2340] tracking-wider mt-0.5">
                QASD WA QEEMA TRADING EST.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/sample-quotation"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold text-[#0c2340] hover:text-[#c5a059] px-3 py-2 rounded-md transition-colors"
            >
              <Eye className="w-4 h-4 text-[#c5a059]" /> Sample Match
            </Link>

            <button
              onClick={handleEnterDemo}
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-lg shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Explore Live Demo
            </button>

            <Link
              href="/login"
              className="bg-[#0c2340] hover:bg-[#12335c] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-lg transition-colors border border-[#c5a059]/40"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-white via-slate-50 to-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-[#0c2340]/5 border border-[#c5a059]/50 rounded-full px-4 py-1.5 text-xs font-semibold text-[#0c2340]">
                <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                Official Business Document System &mdash; 100% Client Visual Match
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#0c2340] tracking-tight leading-tight">
                Enterprise Quotation &amp; Delivery Note Management
              </h1>

              <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl">
                Purpose-built for <strong>QASD WA QEEMA TRADING EST.</strong> in Rabigh City.
                Generate client-ready Saudi standard quotations with automatic 15% VAT, manage material delivery notes with strict price privacy, and export pixel-perfect printable PDFs.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={handleEnterDemo}
                  className="w-full sm:w-auto bg-[#0c2340] hover:bg-[#12335c] text-white text-base font-bold px-8 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-3 border-2 border-[#c5a059]"
                >
                  <Sparkles className="w-5 h-5 text-[#f5e197]" />
                  Launch Interactive Demo
                  <ArrowRight className="w-5 h-5 text-[#f5e197]" />
                </button>

                <Link
                  href="/sample-quotation"
                  className="w-full sm:w-auto bg-white hover:bg-slate-50 text-[#0c2340] font-bold text-base px-6 py-3.5 rounded-xl shadow-xs border border-slate-300 flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-5 h-5 text-[#c5a059]" />
                  Inspect Original Reference Match
                </Link>
              </div>

              {/* Feature Highlights Bullets */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span>Saudi 15% VAT Ready</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span>Price-Free Delivery Notes</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span>Crisp A4 PDF Generation</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span>Bilingual Arabic &amp; English</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span>Digital Sign &amp; Stamp</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-[#c5a059] flex-shrink-0" />
                  <span>Mobile &amp; Tablet Ready</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Card Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-5 transform transition-transform hover:scale-[1.01]">
                {/* Header Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-extrabold text-[#0c2340]">QUOTATION PREVIEW</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#c5a059] bg-amber-50 px-2 py-0.5 rounded border border-[#c5a059]/30">
                    QWQ-2026-0104
                  </span>
                </div>

                {/* Sample Document Snippet */}
                <div className="mt-3 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <Logo size={36} />
                    <span className="text-xs font-black text-[#0c2340]">مؤسسة قصد وقيمة</span>
                  </div>

                  <div className="text-center py-1 bg-[#0c2340] text-white rounded font-black text-xs tracking-wider">
                    QUOTATION
                  </div>

                  <div className="text-[11px] text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Client:</span>
                      <span>Rabigh Petrochemical Services Co.</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-800">Project:</span>
                      <span>Refinery Maintenance Supplies</span>
                    </div>
                  </div>

                  {/* Micro Table */}
                  <table className="w-full text-[10px] border border-[#c5a059]/40 rounded overflow-hidden">
                    <thead className="bg-[#0c2340] text-white">
                      <tr>
                        <th className="p-1 text-left">Item</th>
                        <th className="p-1 text-center">Qty</th>
                        <th className="p-1 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      <tr className="border-t border-[#c5a059]/30">
                        <td className="p-1 font-medium text-slate-800">SS 316 Flange Gaskets</td>
                        <td className="p-1 text-center">50</td>
                        <td className="p-1 text-right font-mono">185.00</td>
                      </tr>
                      <tr className="border-t border-[#c5a059]/30">
                        <td className="p-1 font-medium text-slate-800">Full Body Safety Harness</td>
                        <td className="p-1 text-center">25</td>
                        <td className="p-1 text-right font-mono">420.00</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Micro Totals */}
                  <div className="bg-amber-50/60 border border-[#c5a059] rounded p-2 text-[10px] space-y-0.5 font-mono">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal:</span>
                      <span>SAR 40,150.00</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>VAT 15%:</span>
                      <span>SAR 6,022.50</span>
                    </div>
                    <div className="flex justify-between font-bold text-[#0c2340] pt-1 border-t border-[#c5a059]/30 text-xs">
                      <span>Grand Total:</span>
                      <span>SAR 46,172.50</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">Click to inspect full document</span>
                  <Link
                    href="/dashboard/quotations/quote-001"
                    className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] flex items-center gap-1"
                  >
                    View Document <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Golden Skyline Decorative Base */}
        <div className="mt-12 opacity-40">
          <SaudiSkyline height={60} color="#c5a059" />
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-tight">
              Designed For Saudi Commercial Operations
            </h2>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Every workflow has been crafted to match the exact visual style and commercial requirements of QASD WA QEEMA TRADING EST.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-[#c5a059] transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#0c2340] text-[#f5e197] flex items-center justify-center mb-4 shadow-sm">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0c2340] mb-2">Automated Quotations</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Add multiple items with automatic quantity calculations, subtotal summation, configurable 15% VAT, prefilled standard terms, and authorized Managing Director signature.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <Link href="/dashboard/quotations/new" className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] inline-flex items-center gap-1">
                  Create Quotation <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-[#c5a059] transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#c5a059] text-[#0c2340] flex items-center justify-center mb-4 shadow-sm">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0c2340] mb-2">Delivery Notes (No Prices)</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Keep pricing completely private from site delivery drivers and receiving crews. Includes material descriptions, quantities, units, driver info, and signed acknowledgment.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <Link href="/dashboard/delivery-notes/new" className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] inline-flex items-center gap-1">
                  Generate Delivery Note <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 hover:border-[#c5a059] transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-xl bg-[#0c2340] text-[#f5e197] flex items-center justify-center mb-4 shadow-sm">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-[#0c2340] mb-2">Client PDF &amp; Print Engine</h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Export high-resolution A4 portrait PDFs that exactly match the client&apos;s physical reference document, with dark navy headers, gold accents, and Saudi skyline branding.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <Link href="/sample-quotation" className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] inline-flex items-center gap-1">
                  Compare Reference Image <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0c2340] text-white py-10 mt-auto border-t-2 border-[#c5a059]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <Logo size={46} />
              <div>
                <h4 className="font-extrabold text-base text-white tracking-wide">
                  QASD WA QEEMA TRADING EST.
                </h4>
                <p className="text-xs text-[#f5e197]" dir="rtl">
                  مؤسسة قصد وقيمة التجارية &mdash; Rabigh City, KSA
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
              <Link href="/dashboard/quotations" className="hover:text-white transition-colors">Quotations</Link>
              <Link href="/dashboard/delivery-notes" className="hover:text-white transition-colors">Delivery Notes</Link>
              <Link href="/sample-quotation" className="hover:text-white transition-colors">Sample Match</Link>
              <Link href="/login" className="hover:text-white transition-colors">Admin Login</Link>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
            <p>© {new Date().getFullYear()} QASD WA QEEMA TRADING EST. All rights reserved.</p>
            <p className="text-[#f5e197] font-medium">Tagline: Building a Brighter Future Together</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
