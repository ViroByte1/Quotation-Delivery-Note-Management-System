'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { QuotationItem, CompanySettings, Client, DocumentStatus } from '@/types';
import { calculateQuotationTotals, formatSAR, formatDateISO } from '@/lib/utils';
import {
  FileText,
  Plus,
  Trash2,
  Save,
  Send,
  ArrowLeft,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CreateQuotationPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  // Form State
  const [quotationNumber, setQuotationNumber] = useState('');
  const [date, setDate] = useState(formatDateISO());
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
  const [terms, setTerms] = useState<string[]>([]);
  const [items, setItems] = useState<Omit<QuotationItem, 'id' | 'quotation_id'>[]>([
    { s_no: 1, description: '', quantity: 1, unit_price: 0, total: 0 },
  ]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function init() {
      const [nextNum, setts, cls] = await Promise.all([
        DataService.getNextQuotationNumber(),
        DataService.getCompanySettings(),
        DataService.getClients(),
      ]);
      setQuotationNumber(nextNum);
      setSettings(setts);
      setClients(cls);
      setVatRate(setts.vat_rate || 15);
      setTerms(setts.terms_conditions || []);

      // Calculate default validity date (+30 days)
      const d = new Date();
      d.setDate(d.getDate() + (setts.default_validity_days || 30));
      setValidUntil(formatDateISO(d));
    }
    init();
  }, []);

  // Quick Client Selector
  const handleClientSelect = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setClientName(selected.name);
      setClientCompany(selected.company);
      setClientPhone(selected.phone);
      setClientEmail(selected.email);
      setClientAddress(selected.address);
    }
  };

  // Item Management
  const handleAddItem = () => {
    setItems([
      ...items,
      {
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

  // Calculations
  const totals = calculateQuotationTotals(items, vatRate);

  // Submission
  const handleSave = async (status: DocumentStatus = 'draft') => {
    if (!clientName.trim()) {
      toast.error('Client name is required.');
      return;
    }
    if (!projectName.trim()) {
      toast.error('Project name is required.');
      return;
    }
    const hasEmptyItem = items.some((it) => !it.description.trim());
    if (hasEmptyItem) {
      toast.error('Please provide a description for all items.');
      return;
    }

    setSaving(true);
    try {
      const created = await DataService.createQuotation({
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
        items: items.map((it, idx) => ({
          ...it,
          id: `item-${Date.now()}-${idx}`,
          s_no: idx + 1,
        })),
        subtotal: totals.subtotal,
        vat_rate: totals.vatRate,
        vat_amount: totals.vatAmount,
        grand_total: totals.grandTotal,
        terms_and_conditions: terms,
        notes,
        status,
        authorized_person: settings?.authorized_person_name || 'Abid Mughal',
        authorized_designation: settings?.authorized_person_designation || 'Managing Director',
        signature_url: settings?.signature_url,
      });

      toast.success(
        status === 'sent'
          ? `Quotation ${created.quotation_number} generated & marked Sent!`
          : `Quotation ${created.quotation_number} saved as draft!`
      );

      router.push(`/dashboard/quotations/${created.id}`);
    } catch {
      toast.error('Failed to create quotation.');
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
              href="/dashboard/quotations"
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-[#0c2340] shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
                Create New Quotation
              </h1>
              <p className="text-xs text-slate-500">
                Official Saudi Commercial Quotation for QASD WA QEEMA TRADING EST.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('draft')}
              className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4 text-slate-500" />
              Save Draft
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('sent')}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 border border-[#c5a059]"
            >
              <Send className="w-4 h-4 text-[#f5e197]" />
              Generate &amp; Mark Sent
            </button>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
          {/* Document Metadata Row */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                Quotation Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
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
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-800"
              />
            </div>
          </div>

          {/* Client Details Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
              <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <User className="w-4 h-4 text-[#c5a059]" /> Client &amp; Project Information
              </h2>

              {clients.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Quick fill from existing client:</span>
                  <select
                    onChange={(e) => handleClientSelect(e.target.value)}
                    defaultValue=""
                    className="text-xs bg-slate-50 border border-slate-200 rounded-md px-2 py-1 font-medium"
                  >
                    <option value="" disabled>Select client...</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.company})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Eng. Tariq Al-Ghamdi"
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
                  placeholder="e.g. Rabigh Petrochemical Services Co."
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
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
                  placeholder="e.g. Refinery Piping Supplies"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. 055 123 4567"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  placeholder="e.g. procurement@rabighpetro.sa"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference / RFQ Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. RFQ-PETRO-26-889"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Address / Delivery Site
                </label>
                <input
                  type="text"
                  placeholder="e.g. Petro Rabigh Industrial Complex, Gate 4, Rabigh"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Quotation Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#c5a059]" /> Quotation Items
              </h2>

              <button
                type="button"
                onClick={handleAddItem}
                className="bg-[#0c2340] hover:bg-[#12335c] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs border border-[#c5a059]"
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
                      <tr key={idx} className="hover:bg-amber-50/20">
                        <td className="py-2 px-3 text-center border-r border-[#c5a059] font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-[#c5a059]">
                          <input
                            type="text"
                            required
                            placeholder="e.g. Heavy Duty Flange Gaskets ANSI 300#"
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

            {/* Totals Summary Box (Gold Border matching sample) */}
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

          {/* Terms and Conditions & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                Terms &amp; Conditions (Prefilled &amp; Editable)
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

            <div className="space-y-3">
              <label className="block text-xs font-extrabold text-[#0c2340] uppercase tracking-wider">
                Optional Notes &amp; Scope Remarks
              </label>
              <textarea
                rows={4}
                placeholder="e.g. Delivery included to client site within 3 business days. Warranty 12 months."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0c2340]"
              />
            </div>
          </div>

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
            <Link
              href="/dashboard/quotations"
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              &larr; Cancel and return to list
            </Link>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('draft')}
                className="flex-1 sm:flex-none bg-white hover:bg-slate-50 text-slate-700 font-bold px-5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm shadow-xs"
              >
                Save as Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => handleSave('sent')}
                className="flex-1 sm:flex-none bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm flex items-center justify-center gap-2 border border-[#c5a059]"
              >
                <Send className="w-4 h-4 text-[#f5e197]" />
                Generate Quotation
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
