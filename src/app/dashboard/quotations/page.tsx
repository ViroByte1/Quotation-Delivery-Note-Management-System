'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { Quotation } from '@/types';
import { formatSAR, formatDate, getStatusBadgeVariant } from '@/lib/utils';
import {
  FileText,
  PlusCircle,
  Search,
  Filter,
  Eye,
  Edit,
  Copy,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

export default function QuotationsListPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const fetchQuotations = async () => {
    const data = await DataService.getQuotations();
    setQuotations(data);
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  const handleDuplicate = async (quote: Quotation) => {
    try {
      const nextNum = await DataService.getNextQuotationNumber();
      const duplicated = await DataService.createQuotation({
        ...quote,
        quotation_number: nextNum,
        date: new Date().toISOString().split('T')[0],
        status: 'draft',
      });
      toast.success(`Duplicated quotation as ${duplicated.quotation_number}`);
      fetchQuotations();
    } catch {
      toast.error('Failed to duplicate quotation');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await DataService.deleteQuotation(id);
      toast.success('Quotation deleted successfully');
      setDeleteTargetId(null);
      fetchQuotations();
    } catch {
      toast.error('Failed to delete quotation');
    }
  };

  const filteredQuotations = quotations.filter((q) => {
    const matchesSearch =
      q.quotation_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.client_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.client_company && q.client_company.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (q.project_name && q.project_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header with Title and Create Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#c5a059]" />
              Quotations Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Manage, search, export, and print official Saudi commercial quotations.
            </p>
          </div>

          <Link
            href="/dashboard/quotations/new"
            className="bg-[#0c2340] hover:bg-[#12335c] text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 border border-[#c5a059]"
          >
            <PlusCircle className="w-4 h-4 text-[#f5e197]" />
            Create Quotation
          </Link>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="w-full md:w-80 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by quote #, client, project..."
              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0c2340]"
            />
          </div>

          <div className="w-full md:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <span className="text-xs font-bold text-slate-500 hidden sm:inline">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-[#0c2340]"
            >
              <option value="all">All Statuses ({quotations.length})</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead className="bg-[#0c2340] text-white">
                <tr>
                  <th className="py-3 px-4 font-bold text-[#f5e197] tracking-wider">Quotation No</th>
                  <th className="py-3 px-4 font-bold text-white tracking-wider">Client &amp; Company</th>
                  <th className="py-3 px-4 font-bold text-white tracking-wider">Project</th>
                  <th className="py-3 px-4 font-bold text-white tracking-wider">Date</th>
                  <th className="py-3 px-4 font-bold text-right text-[#f5e197] tracking-wider">Total (SAR)</th>
                  <th className="py-3 px-4 font-bold text-center text-white tracking-wider">Status</th>
                  <th className="py-3 px-4 font-bold text-right text-white tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredQuotations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-slate-400">
                      No quotations found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQuotations.map((q) => (
                    <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0c2340]">
                        <Link href={`/dashboard/quotations/${q.id}`} className="hover:text-[#c5a059]">
                          {q.quotation_number}
                        </Link>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        <div>{q.client_name}</div>
                        {q.client_company && (
                          <div className="text-[11px] text-slate-400">{q.client_company}</div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                        {q.project_name}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                        {formatDate(q.date)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-[#0c2340] whitespace-nowrap">
                        SAR {formatSAR(q.grand_total)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border capitalize ${getStatusBadgeVariant(
                            q.status
                          )}`}
                        >
                          {q.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/dashboard/quotations/${q.id}`}
                            className="p-1.5 text-slate-600 hover:text-[#0c2340] hover:bg-slate-100 rounded-md transition-colors"
                            title="View Document & Download PDF"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/dashboard/quotations/${q.id}/edit`}
                            className="p-1.5 text-slate-600 hover:text-[#c5a059] hover:bg-amber-50 rounded-md transition-colors"
                            title="Edit Quotation"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          <button
                            onClick={() => handleDuplicate(q)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                            title="Duplicate as new quotation"
                          >
                            <Copy className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setDeleteTargetId(q.id)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete quotation"
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

        {/* Delete Confirmation Modal */}
        {deleteTargetId && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center">
                <h3 className="text-base font-bold text-slate-900">Confirm Deletion</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to permanently delete this quotation? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setDeleteTargetId(null)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2 rounded-lg text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteTargetId)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-2 rounded-lg text-xs transition-colors"
                >
                  Delete Quotation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
