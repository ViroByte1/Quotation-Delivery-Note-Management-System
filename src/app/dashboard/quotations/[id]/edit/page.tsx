'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { Quotation, QuotationItem, DocumentStatus } from '@/types';
import { calculateQuotationTotals, formatSAR } from '@/lib/utils';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditQuotationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [quotation, setQuotation] = useState<Quotation | null>(null);

  // Form State
  const [quotationNumber, setQuotationNumber] = useState('');
  const [date, setDate] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [vatRate, setVatRate] = useState(15);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<DocumentStatus>('draft');
  const [terms, setTerms] = useState<string[]>([]);
  const [items, setItems] = useState<QuotationItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const [quote, setts] = await Promise.all([
        DataService.getQuotationById(id),
        DataService.getCompanySettings(),
      ]);

      if (quote) {
        setQuotation(quote);
        setQuotationNumber(quote.quotation_number);
        setDate(quote.date);
        setValidUntil(quote.valid_until || '');
        setReferenceNumber(quote.reference_number || '');
        setClientName(quote.client_name);
        setClientCompany(quote.client_company || '');
        setClientPhone(quote.client_phone || '');
        setClientEmail(quote.client_email || '');
        setClientAddress(quote.client_address || '');
        setProjectName(quote.project_name);
        setVatRate(quote.vat_rate || 15);
        setNotes(quote.notes || '');
        setStatus(quote.status);
        setTerms(quote.terms_and_conditions || []);
        setItems(quote.items || []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        s_no: items.length + 1,
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.warning('At least one item is required in the quotation.');
      return;
    }
    const updated = items
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, s_no: idx + 1 }));
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof QuotationItem, value: any) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      const q = field === 'quantity' ? Number(value) || 0 : current.quantity;
      const p = field === 'unit_price' ? Number(value) || 0 : current.unit_price;
      current.total = Math.round(q * p * 100) / 100;
    }
    updated[index] = current;
    setItems(updated);
  };

  const totals = calculateQuotationTotals(items, vatRate);

  const handleUpdate = async () => {
    if (!quotation) return;
    if (!clientName.trim() || !projectName.trim()) {
      toast.error('Client name and Project name are required.');
      return;
    }

    setSaving(true);
    try {
      await DataService.updateQuotation(quotation.id, {
        quotation_number: quotationNumber,
        date,
        valid_until: validUntil,
        reference_number: referenceNumber,
        client_name: clientName,
        client_company: clientCompany,
        client_phone: clientPhone,
        client_email: clientEmail,
        client_address: clientAddress,
        project_name: projectName,
        items: items.map((it, idx) => ({ ...it, s_no: idx + 1 })),
        subtotal: totals.subtotal,
        vat_rate: totals.vatRate,
        vat_amount: totals.vatAmount,
        grand_total: totals.grandTotal,
        terms_and_conditions: terms,
        notes,
        status,
      });

      toast.success('Quotation updated successfully!');
      router.push(`/dashboard/quotations/${quotation.id}`);
    } catch {
      toast.error('Failed to update quotation');
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400">Loading editor...</div>
      </DashboardLayout>
    );
  }

  if (!quotation) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Quotation not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/quotations/${quotation.id}`}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-[#0c2340] shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
                Edit Quotation: {quotation.quotation_number}
              </h1>
              <p className="text-xs text-slate-500">
                Update document values, items, or commercial terms.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={handleUpdate}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 border border-[#c5a059]"
            >
              <Save className="w-4 h-4 text-[#f5e197]" />
              Save Changes
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
          {/* Metadata Row */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Quotation Number
              </label>
              <input
                type="text"
                value={quotationNumber}
                onChange={(e) => setQuotationNumber(e.target.value)}
                className="w-full text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Valid Until
              </label>
              <input
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DocumentStatus)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold capitalize"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Client Details Section */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#c5a059]" /> Client &amp; Project Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference / RFQ No
                </label>
                <input
                  type="text"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Site / Address
                </label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c5a059]" /> Quotation Items
              </h2>

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-[#0c2340] hover:bg-[#12335c] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#c5a059]"
              >
                <Plus className="w-3.5 h-3.5 text-[#f5e197]" /> Add Row
              </button>
            </div>

            <div className="border border-[#c5a059] rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs sm:text-sm">
                  <thead className="bg-[#0c2340] text-white">
                    <tr>
                      <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-12 text-[#f5e197]">
                        S.No
                      </th>
                      <th className="py-2.5 px-4 font-bold border-r border-[#c5a059]">
                        Product / Service Description
                      </th>
                      <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-24 text-[#f5e197]">
                        Qty
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border-r border-[#c5a059] w-36 text-[#f5e197]">
                        Unit Price (SAR)
                      </th>
                      <th className="py-2.5 px-3 font-bold text-right border-r border-[#c5a059] w-36 text-[#f5e197]">
                        Total (SAR)
                      </th>
                      <th className="py-2.5 px-2 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/40 bg-white">
                    {items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-amber-50/20">
                        <td className="py-2 px-3 text-center border-r border-[#c5a059] font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-[#c5a059]">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 p-1 font-medium text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-2 border-r border-[#c5a059]">
                          <input
                            type="number"
                            min="1"
                            step="any"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full text-center bg-transparent border-0 focus:ring-0 p-1 font-semibold text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-2 border-r border-[#c5a059]">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unit_price}
                            onChange={(e) => handleItemChange(idx, 'unit_price', e.target.value)}
                            className="w-full text-right bg-transparent border-0 focus:ring-0 p-1 font-mono font-medium text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-[#0c2340] border-r border-[#c5a059]">
                          {formatSAR(item.total)}
                        </td>
                        <td className="py-2 px-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <div className="w-full sm:w-80 border border-[#c5a059] rounded-xl p-4 bg-amber-50/20 space-y-2 text-sm shadow-xs">
                <div className="flex justify-between items-center text-slate-600 py-1 border-b border-[#c5a059]/30">
                  <span className="font-semibold text-[#0c2340]">Subtotal:</span>
                  <span className="font-mono font-bold">SAR {formatSAR(totals.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-600 py-1 border-b border-[#c5a059]/30">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-[#0c2340]">VAT Rate:</span>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={vatRate}
                      onChange={(e) => setVatRate(Number(e.target.value) || 0)}
                      className="w-12 text-center bg-white border border-slate-300 rounded px-1 py-0.5 text-xs font-bold"
                    />
                    <span>%</span>
                  </div>
                  <span className="font-mono font-bold">SAR {formatSAR(totals.vatAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-base font-black text-[#0c2340] pt-1">
                  <span>Grand Total:</span>
                  <span className="font-mono text-[#0c2340]">SAR {formatSAR(totals.grandTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
              Terms &amp; Conditions
            </label>
            {terms.map((term, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#c5a059] font-bold">&bull;</span>
                <input
                  type="text"
                  value={term}
                  onChange={(e) => {
                    const updated = [...terms];
                    updated[i] = e.target.value;
                    setTerms(updated);
                  }}
                  className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800"
                />
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Link
              href={`/dashboard/quotations/${quotation.id}`}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              &larr; Cancel
            </Link>
            <button
              type="button"
              disabled={saving}
              onClick={handleUpdate}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 border border-[#c5a059]"
            >
              <Save className="w-4 h-4 text-[#f5e197]" />
              Update Quotation
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
