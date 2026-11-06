'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { DeliveryNote, DeliveryNoteItem, DeliveryStatus } from '@/types';
import { formatSAR, numberToWordsSAR } from '@/lib/utils';
import {
  Truck,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

export default function EditDeliveryNotePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [deliveryNote, setDeliveryNote] = useState<DeliveryNote | null>(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [refQuoteNumber, setRefQuoteNumber] = useState('');

  const [purchaseOrder, setPurchaseOrder] = useState('');
  const [locNoName, setLocNoName] = useState('');
  const [deliveredTo, setDeliveredTo] = useState('');
  const [salesPerson, setSalesPerson] = useState('Abid Mughal');

  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [projectName, setProjectName] = useState('');
  const [preparedBy, setPreparedBy] = useState('');
  const [deliveredBy, setDeliveredBy] = useState('');
  const [receivedBy, setReceivedBy] = useState('');
  const [customerSignature, setCustomerSignature] = useState('');
  const [status, setStatus] = useState<DeliveryStatus>('delivered');
  const [acknowledgmentText, setAcknowledgmentText] = useState('');
  const [additionalRemarks, setAdditionalRemarks] = useState('');

  const [items, setItems] = useState<DeliveryNoteItem[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      if (!id) return;
      setLoading(true);
      const dn = await DataService.getDeliveryNoteById(id);
      if (dn) {
        setDeliveryNote(dn);
        setDeliveryNoteNumber(dn.delivery_note_number);
        setDeliveryDate(dn.delivery_date);
        setRefQuoteNumber(dn.reference_quotation_number || '');
        setPurchaseOrder(dn.purchase_order || 'PO-2026-881');
        setLocNoName(dn.loc_no_name || 'LOC-233 / Aziziyah District');
        setDeliveredTo(dn.delivered_to || dn.customer_company || dn.customer_name);
        setSalesPerson(dn.sales_person || 'Abid Mughal');
        setCustomerName(dn.customer_name);
        setCustomerCompany(dn.customer_company || '');
        setCustomerPhone(dn.customer_phone || '');
        setDeliveryAddress(dn.delivery_address || '');
        setProjectName(dn.project_name);
        setPreparedBy(dn.prepared_by);
        setDeliveredBy(dn.delivered_by);
        setReceivedBy(dn.received_by || '');
        setCustomerSignature(dn.customer_signature || '');
        setStatus(dn.status);
        setAcknowledgmentText(dn.acknowledgment_text);
        setAdditionalRemarks(dn.additional_remarks || '');
        setItems(
          dn.items && dn.items.length > 0
            ? dn.items.map((it) => ({
                ...it,
                unit_price: it.unit_price ?? 0,
                total: it.total ?? ((Number(it.quantity) || 0) * (Number(it.unit_price) || 0)),
              }))
            : [{ id: '1', s_no: 1, description: '', quantity: 1, unit_price: 0, total: 0, unit: 'Pieces', remarks: '' }]
        );
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAddItem = () => {
    const nextSNo = items.length + 1;
    setItems([
      ...items,
      {
        id: `dn-item-edit-${Date.now()}`,
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

  const subtotal = items.reduce(
    (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
    0
  );
  const vatRate = 15;
  const vatAmount = (subtotal * vatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  const handleSave = async () => {
    if (!customerName.trim() || !projectName.trim()) {
      toast.error('Customer name and Project name are required.');
      return;
    }
    setSaving(true);
    try {
      const updated = await DataService.updateDeliveryNote(id, {
        delivery_note_number: deliveryNoteNumber,
        delivery_date: deliveryDate,
        purchase_order: purchaseOrder,
        loc_no_name: locNoName,
        delivered_to: deliveredTo,
        sales_person: salesPerson,
        customer_name: customerName,
        customer_company: customerCompany,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        project_name: projectName,
        items,
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

      if (updated) {
        toast.success('Delivery note updated successfully!');
        router.push(`/dashboard/delivery-notes/${id}`);
      } else {
        toast.error('Could not update delivery note.');
      }
    } catch {
      toast.error('Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400">Loading delivery note...</div>
      </DashboardLayout>
    );
  }

  if (!deliveryNote) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-600">Delivery note not found.</p>
          <Link href="/dashboard/delivery-notes" className="text-[#0c2340] font-bold underline">
            Return to Delivery Notes
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/delivery-notes/${id}`}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-[#0c2340] shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
                Edit Delivery Note: {deliveryNote.delivery_note_number}
              </h1>
              <p className="text-xs text-slate-500">Update items, pricing, or destination.</p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save Changes'}
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
                value={purchaseOrder}
                onChange={(e) => setPurchaseOrder(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Reference Quotation
              </label>
              <input
                type="text"
                disabled
                value={refQuoteNumber || 'None'}
                className="w-full text-sm bg-slate-100 border border-slate-200 rounded-lg px-3 py-2 text-slate-500"
              />
            </div>
          </div>

          {/* Customer & Destination */}
          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#c5a059]" /> Customer &amp; Destination Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
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
                  value={locNoName}
                  onChange={(e) => setLocNoName(e.target.value)}
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
                  Contact Phone
                </label>
                <input
                  type="text"
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
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Delivery Items Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c5a059]" /> Delivery Items &amp; Pricing
              </h2>
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
                      <tr key={item.id || idx} className="hover:bg-slate-50">
                        <td className="py-2 px-3 text-center border-r border-slate-200 font-bold text-slate-500">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3 border-r border-slate-200">
                          <input
                            type="text"
                            required
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

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              href={`/dashboard/delivery-notes/${id}`}
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
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
