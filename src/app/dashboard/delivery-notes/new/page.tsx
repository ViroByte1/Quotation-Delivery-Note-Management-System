'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { DeliveryNoteItem, Quotation, DeliveryStatus } from '@/types';
import { formatDateISO, numberToWordsSAR, formatSAR } from '@/lib/utils';
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

  // Client's exact fields from reference delivery note
  const [purchaseOrder, setPurchaseOrder] = useState('PO-2026-881');
  const [locNoName, setLocNoName] = useState('LOC-233 / Aziziyah District');
  const [deliveredTo, setDeliveredTo] = useState('');
  const [salesPerson, setSalesPerson] = useState('Abid Mughal');

  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [preparedBy, setPreparedBy] = useState('Ahmed Noor (Store Officer)');
  const [deliveredBy, setDeliveredBy] = useState('Rashid Khan (Driver)');
  const [receivedBy, setReceivedBy] = useState('');
  const customerSignature = 'Customer Verified & Signed';
  const [status, setStatus] = useState<DeliveryStatus>('delivered');
  const [acknowledgmentText, setAcknowledgmentText] = useState(DEFAULT_ACKNOWLEDGMENT_TEXT);
  const [additionalRemarks, setAdditionalRemarks] = useState('');

  const [items, setItems] = useState<Omit<DeliveryNoteItem, 'id' | 'delivery_note_id'>[]>([
    { s_no: 1, description: 'Industrial Flange Valve Assembly (Model 1)', quantity: 20, unit_price: 1045, total: 20900, unit: 'Pieces', remarks: '' },
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
    setDeliveredTo(q.client_company || q.client_name);
    setPurchaseOrder(q.reference_number || `PO-${q.quotation_number.replace('QWQ-', '')}`);
    setLocNoName(q.project_name);

    if (q.items && q.items.length > 0) {
      setItems(
        q.items.map((it, idx) => ({
          s_no: idx + 1,
          description: it.description,
          quantity: it.quantity,
          unit_price: it.unit_price || 0,
          total: it.total || (it.quantity * (it.unit_price || 0)),
          unit: 'Pieces',
          remarks: '',
        }))
      );
    }
    toast.success(`Loaded details from Quotation ${q.quotation_number}`);
  };

  const handleSelectQuote = (quoteId: string) => {
    setRefQuoteId(quoteId);
    if (!quoteId) {
      setRefQuoteNumber('');
      return;
    }
    const matching = quotations.find((q) => q.id === quoteId);
    if (matching) {
      loadFromQuote(matching);
    }
  };

  // Item Management
  const handleAddItem = () => {
    const nextSNo = items.length + 1;
    setItems([
      ...items,
      {
        s_no: nextSNo,
        description: '',
        quantity: 1,
        unit_price: 0,
        total: 0,
        unit: 'Pieces',
        remarks: '',
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      toast.warning('A delivery note must contain at least one item.');
      return;
    }
    const updated = items
      .filter((_, i) => i !== index)
      .map((item, idx) => ({ ...item, s_no: idx + 1 }));
    setItems(updated);
  };

  const handleItemChange = (index: number, field: keyof DeliveryNoteItem, value: any) => {
    const updated = [...items];
    const cur = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      const q = Number(field === 'quantity' ? value : cur.quantity) || 0;
      const p = Number(field === 'unit_price' ? value : cur.unit_price) || 0;
      cur.total = q * p;
    }
    updated[index] = cur;
    setItems(updated);
  };

  // Calculated Totals
  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
    0
  );
  const vatRate = 15;
  const vatAmount = (subtotal * vatRate) / 100;
  const grandTotal = subtotal + vatAmount;

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
        purchase_order: purchaseOrder,
        loc_no_name: locNoName,
        delivered_to: deliveredTo || customerCompany || customerName,
        sales_person: salesPerson,
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
        subtotal,
        vat_rate: vatRate,
        vat_amount: vatAmount,
        grand_total: grandTotal,
        amount_in_words: numberToWordsSAR(grandTotal),
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
    <div className="space-y-6">
      {/* Header */}
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
              Generate official delivery note matching QASD WA QEEMA reference layout.
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
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
              Purchase Order (PO)
            </label>
            <input
              type="text"
              placeholder="e.g. PO-2026-881"
              value={purchaseOrder}
              onChange={(e) => setPurchaseOrder(e.target.value)}
              className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
              Reference Quotation
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
            <User className="w-4 h-4 text-[#c5a059]" /> Customer &amp; Destination Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Customer Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Mohammed Mansoor"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivered To (Company / Site)
              </label>
              <input
                type="text"
                placeholder="e.g. Modern Industrial Services Ltd."
                value={deliveredTo}
                onChange={(e) => setDeliveredTo(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                LOC No. / District Name
              </label>
              <input
                type="text"
                placeholder="e.g. LOC-233 / Aziziyah District"
                value={locNoName}
                onChange={(e) => setLocNoName(e.target.value)}
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
                placeholder="e.g. Industrial Valve & Pipeline Fitting"
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
                placeholder="e.g. 050 987 6543"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sales Person / Sign-off
              </label>
              <input
                type="text"
                value={salesPerson}
                onChange={(e) => setSalesPerson(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 font-medium"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Delivery Site / Drop-off Address
              </label>
              <input
                type="text"
                placeholder="e.g. Ishara Baladeah, Aziziyah, Jeddah 23334"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Delivery Items Table (with QTY, Unit Price, and Line Total) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div>
              <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c5a059]" /> Delivery Items &amp; Pricing
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">
                Amounts calculate automatically in SAR matching the client reference document.
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

          <div className="border border-slate-300 rounded-xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-[#374151] text-white">
                  <tr>
                    <th className="py-2.5 px-3 font-bold text-center border-r border-slate-500 w-12">
                      No.
                    </th>
                    <th className="py-2.5 px-4 font-bold border-r border-slate-500">
                      Description
                    </th>
                    <th className="py-2.5 px-3 font-bold text-center border-r border-slate-500 w-24">
                      QTY
                    </th>
                    <th className="py-2.5 px-3 font-bold text-right border-r border-slate-500 w-32">
                      U. Price (SAR)
                    </th>
                    <th className="py-2.5 px-3 font-bold text-right border-r border-slate-500 w-32">
                      Total (SAR)
                    </th>
                    <th className="py-2.5 px-2 text-center w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2 px-3 text-center border-r border-slate-200 font-bold text-slate-500">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200">
                        <input
                          type="text"
                          required
                          placeholder="e.g. Industrial Flange Valve Assembly (Model 1)"
                          value={item.description}
                          onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                          className="w-full bg-transparent border-0 focus:ring-0 p-1 font-medium text-slate-900"
                        />
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200">
                        <input
                          type="number"
                          min="1"
                          step="any"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value) || 0)}
                          className="w-full text-center bg-transparent border-0 focus:ring-0 p-1 font-bold text-slate-900"
                        />
                      </td>
                      <td className="py-2 px-2 border-r border-slate-200">
                        <input
                          type="number"
                          min="0"
                          step="any"
                          value={item.unit_price ?? 0}
                          onChange={(e) => handleItemChange(idx, 'unit_price', Number(e.target.value) || 0)}
                          className="w-full text-right bg-transparent border-0 focus:ring-0 p-1 font-mono font-medium text-slate-900"
                        />
                      </td>
                      <td className="py-2 px-3 text-right border-r border-slate-200 font-mono font-bold text-slate-900">
                        {formatSAR((Number(item.quantity) || 0) * (Number(item.unit_price) || 0))}
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md transition-colors"
                          title="Remove row"
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

          {/* Totals Summary */}
          <div className="flex justify-end pt-2">
            <div className="w-72 bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Sub Total:</span>
                <span className="font-mono font-bold text-slate-900">{formatSAR(subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-slate-600">
                <span>15% VAT:</span>
                <span className="font-mono font-bold text-slate-900">{formatSAR(vatAmount)}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-black text-[#0c2340] border-t border-slate-300 pt-2">
                <span>Total:</span>
                <span className="font-mono">{formatSAR(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Link
            href="/dashboard/delivery-notes"
            className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 text-xs sm:text-sm font-semibold"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-md flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            {saving ? 'Generating...' : 'Save & View Delivery Note'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CreateDeliveryNotePage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="py-20 text-center text-slate-400">Loading form...</div>}>
        <CreateDeliveryNoteContent />
      </Suspense>
    </DashboardLayout>
  );
}
