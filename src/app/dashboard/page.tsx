'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { Quotation, DeliveryNote, CompanySettings } from '@/types';
import { formatSAR, formatDate, getStatusBadgeVariant } from '@/lib/utils';
import {
  FileText,
  Truck,
  PlusCircle,
  TrendingUp,
  CheckCircle2,
  Send,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export default function DashboardPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
  const [settings, setSettings] = useState<CompanySettings | null>(null);

  useEffect(() => {
    async function loadData() {
      const [quotes, notes, setts] = await Promise.all([
        DataService.getQuotations(),
        DataService.getDeliveryNotes(),
        DataService.getCompanySettings(),
      ]);
      setQuotations(quotes);
      setDeliveryNotes(notes);
      setSettings(setts);
    }
    loadData();
  }, []);

  const totalQuotes = quotations.length;
  const draftQuotes = quotations.filter((q) => q.status === 'draft').length;
  const sentQuotes = quotations.filter((q) => q.status === 'sent').length;
  const acceptedQuotes = quotations.filter((q) => q.status === 'accepted').length;
  const totalSARValue = quotations.reduce((acc, q) => acc + (q.grand_total || 0), 0);
  const totalDeliveryNotes = deliveryNotes.length;

  return (
    <DashboardLayout>
      <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
        {/* Welcome & Quick Action Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
                Operations Dashboard
              </h1>
              <span className="bg-amber-100 text-[#0c2340] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#c5a059]/40">
                Rabigh Branch
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <strong>{settings?.authorized_person_name || 'Abid Mughal'}</strong> ({settings?.authorized_person_designation || 'Managing Director'})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/dashboard/quotations/new"
              className="bg-[#0c2340] hover:bg-[#12335c] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 border border-[#c5a059]"
            >
              <PlusCircle className="w-4 h-4 text-[#f5e197]" />
              Create Quotation
            </Link>

            <Link
              href="/dashboard/delivery-notes/new"
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Create Delivery Note
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {/* Total Value */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#c5a059] transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Value</span>
              <div className="p-2 rounded-lg bg-amber-50 text-[#c5a059]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#0c2340] font-mono">
              SAR {formatSAR(totalSARValue)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span>Across {totalQuotes} quotations</span>
            </div>
          </div>

          {/* Accepted Quotes */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Accepted Quotes</span>
              <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-2xl font-black text-emerald-700 font-mono">
              {acceptedQuotes}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              Active commercial commitments
            </div>
          </div>

          {/* Sent / In-Review */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sent to Clients</span>
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Send className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-2xl font-black text-blue-700 font-mono">
              {sentQuotes}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {draftQuotes} draft pending review
            </div>
          </div>

          {/* Delivery Notes */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-[#c5a059] transition-all">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Delivery Notes</span>
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="text-lg sm:text-2xl font-black text-[#0c2340] font-mono">
              {totalDeliveryNotes}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              All with verified receipts
            </div>
          </div>
        </div>

        {/* Recent Documents Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Recent Quotations */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0c2340]" />
                <h2 className="text-sm sm:text-base font-extrabold text-[#0c2340]">
                  Recent Quotations
                </h2>
              </div>
              <Link
                href="/dashboard/quotations"
                className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] flex items-center gap-1 transition-colors"
              >
                View All ({totalQuotes}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {quotations.slice(0, 4).map((q) => (
                <div
                  key={q.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0c2340]">
                        {q.quotation_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${getStatusBadgeVariant(
                          q.status
                        )}`}
                      >
                        {q.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {q.client_name}
                      {q.client_company && (
                        <span className="text-slate-500 font-normal"> &bull; {q.client_company}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(q.date)} &bull; Project: {q.project_name}
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div>
                      <div className="font-mono font-black text-xs sm:text-sm text-[#0c2340]">
                        SAR {formatSAR(q.grand_total)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {q.items.length} items &bull; incl. 15% VAT
                      </div>
                    </div>

                    <Link
                      href={`/dashboard/quotations/${q.id}`}
                      className="p-2 text-slate-500 hover:text-[#0c2340] hover:bg-slate-200/60 rounded-lg transition-colors"
                      title="Inspect Document & PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Delivery Notes */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c5a059]" />
                <h2 className="text-sm sm:text-base font-extrabold text-[#0c2340]">
                  Recent Delivery Notes
                </h2>
              </div>
              <Link
                href="/dashboard/delivery-notes"
                className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] flex items-center gap-1 transition-colors"
              >
                View All ({totalDeliveryNotes}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 flex-1">
              {deliveryNotes.slice(0, 4).map((dn) => (
                <div
                  key={dn.id}
                  className="p-4 hover:bg-slate-50/80 transition-colors flex items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-[#0c2340]">
                        {dn.delivery_note_number}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${getStatusBadgeVariant(
                          dn.status
                        )}`}
                      >
                        {dn.status}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-800">
                      {dn.customer_name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {formatDate(dn.delivery_date)} &bull; {dn.items.length} items (no prices)
                    </div>
                  </div>

                  <Link
                    href={`/dashboard/delivery-notes/${dn.id}`}
                    className="p-2 text-slate-500 hover:text-[#0c2340] hover:bg-slate-200/60 rounded-lg transition-colors"
                    title="View & PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
