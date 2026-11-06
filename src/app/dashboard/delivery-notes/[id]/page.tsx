'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { DeliveryNote, CompanySettings, DeliveryStatus } from '@/types';
import { DeliveryNoteDocument } from '@/components/documents/DeliveryNoteDocument';
import { exportToPDF, printDocument } from '@/lib/pdf-export';
import { getStatusBadgeVariant } from '@/lib/utils';
import {
  Download,
  Printer,
  Edit,
  ArrowLeft,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryNoteViewPage() {
  const params = useParams();
  const id = params?.id as string;

  const [deliveryNote, setDeliveryNote] = useState<DeliveryNote | null>(null);
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const [dn, setts] = await Promise.all([
        DataService.getDeliveryNoteById(id),
        DataService.getCompanySettings(),
      ]);
      setDeliveryNote(dn);
      setSettings(setts);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleDownloadPDF = async () => {
    if (!deliveryNote) return;
    setDownloading(true);
    toast.info('Generating high-resolution Delivery Note PDF...');
    try {
      await exportToPDF('delivery-note-print-area', `DeliveryNote-${deliveryNote.delivery_note_number}`);
      toast.success('PDF downloaded successfully!');
    } catch (e: any) {
      console.error('PDF error:', e);
      toast.error('Could not generate PDF. Please use the Print button.');
    } finally {
      setDownloading(false);
    }
  };

  const handleStatusChange = async (newStatus: DeliveryStatus) => {
    if (!deliveryNote) return;
    try {
      const updated = await DataService.updateDeliveryNote(deliveryNote.id, { status: newStatus });
      if (updated) {
        setDeliveryNote(updated);
        toast.success(`Delivery note status updated to "${newStatus}"`);
      }
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400">Loading delivery note...</div>
      </DashboardLayout>
    );
  }

  if (!deliveryNote || !settings) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-600">Delivery note not found.</p>
          <Link
            href="/dashboard/delivery-notes"
            className="text-[#0c2340] font-bold underline"
          >
            Return to Delivery Notes List
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <Link
              href="/dashboard/delivery-notes"
              className="p-2 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 text-slate-600 transition-colors"
              title="Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#0c2340]">
                  {deliveryNote.delivery_note_number}
                </h1>
                <span
                  className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadgeVariant(
                    deliveryNote.status
                  )}`}
                >
                  {deliveryNote.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Customer: {deliveryNote.customer_name} &bull; Project: {deliveryNote.project_name}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <select
              value={deliveryNote.status}
              onChange={(e) => handleStatusChange(e.target.value as DeliveryStatus)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 font-bold text-slate-700"
            >
              <option value="delivered">Delivered</option>
              <option value="pending">Pending</option>
              <option value="partially_delivered">Partially Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <Link
              href={`/dashboard/delivery-notes/${deliveryNote.id}/edit`}
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
          </div>
        </div>

        {/* Live Document Canvas */}
        <div className="overflow-x-auto pb-8">
          <DeliveryNoteDocument deliveryNote={deliveryNote} settings={settings} />
        </div>
      </div>
    </DashboardLayout>
  );
}
