'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { Quotation, CompanySettings, DocumentStatus } from '@/types';
import { QuotationDocument } from '@/components/documents/QuotationDocument';
import { exportToPDF, printDocument } from '@/lib/pdf-export';
import { getStatusBadgeVariant } from '@/lib/utils';
import {
  Download,
  Printer,
  Edit,
  ArrowLeft,
  Truck,
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuotationViewPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [quotation, setQuotation] = useState<Quotation | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const [quote, setts] = await Promise.all([
        DataService.getQuotationById(id),
        DataService.getCompanySettings(),
      ]);
      setQuotation(quote);
      setSettings(setts);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!quotation) return;
    setDownloading(true);
    toast.info('Generating high-resolution client PDF...');
    try {
      await exportToPDF('quotation-print-area', `Quotation-${quotation.quotation_number}`);
      toast.success('PDF downloaded successfully!');
    } catch (e: any) {
      console.error('PDF error:', e);
      toast.error('Could not generate PDF. Please use the Print button.');
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus: DocumentStatus) => {
    if (!quotation) return;
    try {
      const updated = await DataService.updateQuotation(quotation.id, { status: newStatus });
      if (updated) {
        setQuotation(updated);
        toast.success(`Quotation status changed to "${newStatus}"`);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  const handleCreateDeliveryNoteFromQuote = () => {
    if (!quotation) return;
    // Store reference in session to auto-fill delivery note form
    sessionStorage.setItem('qwq_dn_prefill_quote', JSON.stringify(quotation));
    router.push('/dashboard/delivery-notes/new?from_quote=' + quotation.id);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400">Loading quotation...</div>
      </DashboardLayout>
    );
  }

  if (!quotation || !settings) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-600">Quotation not found.</p>
          <Link
            href="/dashboard/quotations"
            className="text-[#0c2340] font-bold underline"
          >
            Return to Quotations List
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Actions Bar (Hidden on print) */}
        <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/quotations"
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#0c2340]">
                  {quotation.quotation_number}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadgeVariant(
                    quotation.status
                  )}`}
                >
                  {quotation.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Client: {quotation.client_name} &bull; Project: {quotation.project_name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            {/* Status Selector */}
            <select
              value={quotation.status}
              onChange={(e) => handleStatusChange(e.target.value as DocumentStatus)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-bold text-slate-700"
            >
              <option value="draft">Draft</option>
              <option value="sent">Mark Sent</option>
              <option value="accepted">Mark Accepted</option>
              <option value="rejected">Mark Rejected</option>
              <option value="expired">Mark Expired</option>
            </select>

            <Link
              href={`/dashboard/quotations/${quotation.id}/edit`}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5 text-slate-500" /> Edit
            </Link>

            <button
              onClick={() => printDocument()}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" /> Print
            </button>

            <button
              disabled={downloading}
              onClick={handleDownloadPDF}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 border border-[#c5a059]"
            >
              <Download className="w-3.5 h-3.5 text-[#f5e197]" />
              {downloading ? 'Exporting...' : 'Download PDF'}
            </button>

            <button
              onClick={handleCreateDeliveryNoteFromQuote}
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-3 py-2 rounded-xl text-xs shadow-xs flex items-center gap-1.5"
              title="Create corresponding Delivery Note without showing prices"
            >
              <Truck className="w-3.5 h-3.5" />
              Generate Delivery Note
            </button>
          </div>
        </div>

        {/* Live Document Canvas */}
        <div className="overflow-x-auto pb-8">
          <QuotationDocument quotation={quotation} settings={settings} />
        </div>
      </div>
    </DashboardLayout>
  );
}
