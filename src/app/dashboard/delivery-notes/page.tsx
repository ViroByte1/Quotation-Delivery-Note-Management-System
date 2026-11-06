'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { DeliveryNote } from '@/types';
import { formatDate, getStatusBadgeVariant } from '@/lib/utils';
import {
  Truck,
  PlusCircle,
  Search,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function DeliveryNotesListPage() {
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchDeliveryNotes = async () => {
    const data = await DataService.getDeliveryNotes();
    setDeliveryNotes(data);
  };

  useEffect(() => {
    fetchDeliveryNotes();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await DataService.deleteDeliveryNote(id);
      toast.success('Delivery note deleted successfully');
      setDeleteTargetId(null);
      fetchDeliveryNotes();
    } catch {
      toast.error('Failed to delete delivery note');
    }
  };

  const filteredNotes = deliveryNotes.filter((dn) => {
    return (
      dn.delivery_note_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dn.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dn.customer_company && dn.customer_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dn.project_name && dn.project_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (dn.reference_quotation_number && dn.reference_quotation_number.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight flex items-center gap-2">
              <Truck className="w-6 h-6 text-[#c5a059]" />
              Delivery Notes Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Material deliveries with strict price-privacy, signed acknowledgment, and logistics tracking.
            </p>
          </div>

          <Link
            href="/dashboard/delivery-notes/new"
            className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Create Delivery Note
          </Link>
        </div>

        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div className="w-full sm:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by DN #, customer, project..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2340]"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500 hidden sm:block">
            Total: {deliveryNotes.length} delivery notes
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-[#0c2340] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold text-[#f5e197] tracking-wider">DN Number</th>
                  <th className="py-3 px-4 font-bold text-white tracking-wider">Customer / Company</th>
                  <th className="py-3 px-4 font-bold text-white tracking-wider">Project</th>
                  <th className="py-3 px-4 font-bold text-white tracking-wider">Delivery Date</th>
                  <th className="py-3 px-4 font-bold text-center text-[#f5e197] tracking-wider">Ref Quote</th>
                  <th className="py-3 px-4 font-bold text-center text-white tracking-wider">Status</th>
                  <th className="py-3 px-4 font-bold text-right text-white tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredNotes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No delivery notes found.
                    </td>
                  </tr>
                ) : (
                  filteredNotes.map((dn) => (
                    <tr key={dn.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0c2340]">
                        <Link href={`/dashboard/delivery-notes/${dn.id}`} className="hover:text-[#c5a059]">
                          {dn.delivery_note_number}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div>{dn.customer_name}</div>
                        {dn.customer_company && (
                          <div className="text-[11px] text-slate-400">{dn.customer_company}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {dn.project_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDate(dn.delivery_date)}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-xs whitespace-nowrap">
                        {dn.reference_quotation_number ? (
                          <span className="bg-amber-50 text-[#0c2340] border border-[#c5a059]/40 px-2 py-0.5 rounded font-bold">
                            {dn.reference_quotation_number}
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadgeVariant(
                            dn.status
                          )}`}
                        >
                          {dn.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/delivery-notes/${dn.id}`}
                            className="p-1.5 text-slate-600 hover:text-[#0c2340] hover:bg-slate-100 rounded-md transition-colors"
                            title="View Document & Print"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/dashboard/delivery-notes/${dn.id}/edit`}
                            className="p-1.5 text-slate-600 hover:text-[#c5a059] hover:bg-amber-50 rounded-md transition-colors"
                            title="Edit Delivery Note"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => setDeleteTargetId(dn.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to permanently delete this delivery note?
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteTargetId)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg text-xs"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
