'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { DeliveryNoteItem, Quotation, DeliveryStatus } from '@/types';
import { formatDateISO } from '@/lib/utils';
import { DEFAULT_ACKNOWLEDGMENT_TEXT } from '@/lib/constants';
import {
  Truck,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  User,
  CheckCircle2,
} from 'lucide-react';
import { toast } from 'sonner';

function CreateDeliveryNoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromQuoteId = searchParams.get('from_quote');

  const [quotations, setQuotations] = useState<Quotation[]>([]);

  // Form State
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(formatDateISO());
  const [refQuoteId, setRefQuoteId] = useState(fromQuoteId || '');
  const [refQuoteNumber, setRefQuoteNumber] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [preparedBy, setPreparedBy] = useState('Ahmed Noor (Store In-Charge)');
  const [deliveredBy, setDeliveredBy] = useState('Rashid Khan (Logistics Driver)');
  const [receivedBy, setReceivedBy] = useState('');
  const customerSignature = 'Customer Verified & Signed';
  const [status, setStatus] = useState<DeliveryStatus>('delivered');
  const [acknowledgmentText, setAcknowledgmentText] = useState(DEFAULT_ACKNOWLEDGMENT_TEXT);
  const [additionalRemarks, setAdditionalRemarks] = useState('');

  const [items, setItems] = useState<Omit<DeliveryNoteItem, 'id' | 'delivery_note_id'>[]>([
    { s_no: 1, description: '', quantity: 1, unit: 'Pieces', remarks: '' },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const [nextNum, quotes] = await Promise.all([
        DataService.getNextDeliveryNoteNumber(),
        DataService.getQuotations(),
      ]);
      setDeliveryNoteNumber(nextNum);
      setQuotations(quotes);

      // Check if sessionStorage has prefill quote data
      const storedQuote = sessionStorage.getItem('qwq_dn_prefill_quote');
      if (storedQuote) {
        try {
          const parsedQuote: Quotation = JSON.parse(storedQuote);
          sessionStorage.removeItem('qwq_dn_prefill_quote');
          loadFromQuote(parsedQuote);
          return;
        } catch {
          // ignore
        }
      }

      if (fromQuoteId) {
        const matching = quotes.find((q) => q.id === fromQuoteId);
        if (matching) {
          loadFromQuote(matching);
        }
      }
    }
    init();
  }, [fromQuoteId]);

  const loadFromQuote = (q: Quotation) => {
    setRefQuoteId(q.id);
    setRefQuoteNumber(q.quotation_number);
    setCustomerName(q.client_name);
    setCustomerCompany(q.client_company || '');
    setCustomerPhone(q.client_phone || '');
    setDeliveryAddress(q.client_address || '');
    setProjectName(q.project_name);
    setReceivedBy(q.client_name);

    if (q.items && q.items.length > 0) {
      setItems(
        q.items.map((it, idx) => ({
          s_no: idx + 1,
          description: it.description,
          quantity: it.quantity,
          unit: 'Pieces',
          remarks: 'As per approved quotation specifications',
        }))
      );
    }
    toast.success(`Imported ${q.items.length} items from Quotation ${q.quotation_number}`);
  };

  const handleSelectQuote = (quoteId: string) => {
    setRefQuoteId(quoteId);
    const q = quotations.find((item) => item.id === quoteId);
    if (q) {
      loadFromQuote(q);
    }
  };

  // Item management
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        s_no: items.length + 1,
        description: '',
        quantity: 1,
        unit: 'Pieces',
        remarks: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.warning('At least one item is required in the delivery note.');
      return;
    }
    const updated = items
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, s_no: idx + 1 }));
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof DeliveryNoteItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  // Submission
  const handleSave = async () => {
    if (!customerName.trim()) {
      toast.error('Customer name is required.');
      return;
    }
    if (!projectName.trim()) {
      toast.error('Project name is required.');
      return;
    }
    const hasEmptyItem = items.some((it) => !it.description.trim());
    if (hasEmptyItem) {
      toast.error('Please provide a description for all delivery items.');
      return;
    }

    setSaving(true);
    try {
      const created = await DataService.createDeliveryNote({
        delivery_note_number: deliveryNoteNumber,
        delivery_date: deliveryDate,
        reference_quotation_id: refQuoteId,
        reference_quotation_number: refQuoteNumber,
        customer_name: customerName,
        customer_company: customerCompany,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        project_name: projectName,
        items: items.map((it, idx) => ({
          ...it,
          id: `dn-item-${Date.now()}-${idx}`,
          s_no: idx + 1,
        })),
        prepared_by: preparedBy,
        delivered_by: deliveredBy,
        received_by: receivedBy,
        customer_signature: customerSignature,
        status,
        acknowledgment_text: acknowledgmentText,
        additional_remarks: additionalRemarks,
      });

      toast.success(`Delivery Note ${created.delivery_note_number} created successfully!`);
      router.push(`/dashboard/delivery-notes/${created.id}`);
    } catch {
      toast.error('Failed to create delivery note.');
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/delivery-notes"
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-[#0c2340] shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
                Create Delivery Note
              </h1>
              <p className="text-xs text-slate-500">
                Generate official material delivery documentation with strict price privacy.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Generate Delivery Note
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
          {/* Metadata Row */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Delivery Note Number
              </label>
              <input
                type="text"
                value={deliveryNoteNumber}
                onChange={(e) => setDeliveryNoteNumber(e.target.value)}
                className="w-full text-sm font-mono font-bold bg-white border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Reference Quotation (Optional)
              </label>
              <select
                value={refQuoteId}
                onChange={(e) => handleSelectQuote(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              >
                <option value="">None / Standalone Delivery</option>
                {quotations.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.quotation_number} - {q.client_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer & Destination Information */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#c5a059]" /> Customer &amp; Delivery Destination
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer / Receiver Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Tariq Al-Ghamdi"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Company
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rabigh Petrochemical Services Co."
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Refinery Piping Maintenance"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. 055 123 4567"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Site / Drop-off Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Petro Rabigh Industrial Complex, Gate 4, Rabigh"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Delivery Items Table (NO PRICES) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#c5a059]" /> Delivery Items
                </h2>
                <span className="text-[11px] text-emerald-600 font-semibold">
                  &bull; Strict Price Privacy: Unit and total prices are hidden on delivery notes
                </span>
              </div>

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
                        Item / Material Description
                      </th>
                      <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-24 text-[#f5e197]">
                        Quantity
                      </th>
                      <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-28 text-[#f5e197]">
                        Unit
                      </th>
                      <th className="py-2.5 px-3 font-bold border-r border-[#c5a059] w-48 text-[#f5e197]">
                        Remarks
                      </th>
                      <th className="py-2.5 px-2 text-center w-12"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#c5a059]/40 bg-white">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/20">
                        <td className="py-2 px-3 text-center border-r border-[#c5a059] font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-[#c5a059]">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Stainless Steel 316 Flange Gaskets (4 Inch)"
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
                            onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value) || 0)}
                            className="w-full text-center bg-transparent border-0 focus:ring-0 p-1 font-bold text-slate-900"
                          />
                        </td>
                        <td className="py-2 px-2 border-r border-[#c5a059]">
                          <select
                            value={item.unit}
                            onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 p-1 font-medium text-slate-700"
                          >
                            <option value="Pieces">Pieces</option>
                            <option value="Sets">Sets</option>
                            <option value="Boxes">Boxes</option>
                            <option value="Meters">Meters</option>
                            <option value="Units">Units</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Drums">Drums</option>
                            <option value="Lots">Lots</option>
                          </select>
                        </td>
                        <td className="py-2 px-3 border-r border-[#c5a059]">
                          <input
                            type="text"
                            placeholder="e.g. Inspected batch packaging"
                            value={item.remarks}
                            onChange={(e) => handleItemChange(idx, 'remarks', e.target.value)}
                            className="w-full bg-transparent border-0 focus:ring-0 p-1 text-slate-600"
                          />
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
          </div>

          {/* Signatures & Logistics Roles */}
          <div className="space-y-4 pt-2">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <CheckCircle2 className="w-4 h-4 text-[#c5a059]" /> Sign-off &amp; Logistics Personnel
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Prepared By (Store)
                </label>
                <input
                  type="text"
                  value={preparedBy}
                  onChange={(e) => setPreparedBy(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivered By (Driver)
                </label>
                <input
                  type="text"
                  value={deliveredBy}
                  onChange={(e) => setDeliveredBy(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Received By (Client)
                </label>
                <input
                  type="text"
                  value={receivedBy}
                  onChange={(e) => setReceivedBy(e.target.value)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-bold"
                >
                  <option value="delivered">Delivered</option>
                  <option value="pending">Pending</option>
                  <option value="partially_delivered">Partially Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

          {/* Customer Acknowledgment Statement */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
              Customer Acknowledgment Clause
            </label>
            <input
              type="text"
              value={acknowledgmentText}
              onChange={(e) => setAcknowledgmentText(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
            />
          </div>

          {/* Additional Remarks */}
          <div className="space-y-2">
            <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
              Additional Remarks / Gate Pass Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Gate pass # GP-8812 verified at site security. All boxes sealed."
              value={additionalRemarks}
              onChange={(e) => setAdditionalRemarks(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800"
            />
          </div>

          {/* Bottom Action Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Link
              href="/dashboard/delivery-notes"
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              &larr; Cancel
            </Link>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Generate Delivery Note
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function CreateDeliveryNotePage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="py-20 text-center text-slate-400">Loading form...</div>
        </DashboardLayout>
      }
    >
      <CreateDeliveryNoteContent />
    </Suspense>
  );
}
