'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { DeliveryNote, DeliveryNoteItem, DeliveryStatus } from '@/types';
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

  // Form State
  const [deliveryNoteNumber, setDeliveryNoteNumber] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [refQuoteNumber, setRefQuoteNumber] = useState('');
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
  const [loading, setLoading] = useState(true);

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
        setCustomerName(dn.customer_name);
        setCustomerCompany(dn.customer_company || '');
        setCustomerPhone(dn.customer_phone || '');
        setDeliveryAddress(dn.delivery_address || '');
        setProjectName(dn.project_name);
        setPreparedBy(dn.prepared_by || '');
        setDeliveredBy(dn.delivered_by || '');
        setReceivedBy(dn.received_by || '');
        setCustomerSignature(dn.customer_signature || '');
        setStatus(dn.status);
        setAcknowledgmentText(dn.acknowledgment_text || '');
        setAdditionalRemarks(dn.additional_remarks || '');
        setItems(dn.items || []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `dn-item-${Date.now()}`,
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

  const handleUpdate = async () => {
    if (!deliveryNote) return;
    if (!customerName.trim() || !projectName.trim()) {
      toast.error('Customer name and Project name are required.');
      return;
    }

    setSaving(true);
    try {
      await DataService.updateDeliveryNote(deliveryNote.id, {
        delivery_note_number: deliveryNoteNumber,
        delivery_date: deliveryDate,
        reference_quotation_number: refQuoteNumber,
        customer_name: customerName,
        customer_company: customerCompany,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        project_name: projectName,
        prepared_by: preparedBy,
        delivered_by: deliveredBy,
        received_by: receivedBy,
        customer_signature: customerSignature,
        status,
        acknowledgment_text: acknowledgmentText,
        additional_remarks: additionalRemarks,
        items: items.map((it, idx) => ({ ...it, s_no: idx + 1 })),
      });

      toast.success('Delivery note updated successfully!');
      router.push(`/dashboard/delivery-notes/${deliveryNote.id}`);
    } catch {
      toast.error('Failed to update delivery note');
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

  if (!deliveryNote) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center">Delivery note not found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/delivery-notes/${deliveryNote.id}`}
              className="p-2 bg-white rounded-xl border border-slate-200 text-slate-600 hover:text-[#0c2340] shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight">
                Edit Delivery Note: {deliveryNote.delivery_note_number}
              </h1>
              <p className="text-xs text-slate-500">
                Update delivery items, drop-off location, or recipient verification.
              </p>
            </div>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleUpdate}
            className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                DN Number
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
                Date
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
                Ref Quotation
              </label>
              <input
                type="text"
                value={refQuoteNumber}
                onChange={(e) => setRefQuoteNumber(e.target.value)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as DeliveryStatus)}
                className="w-full text-sm bg-white border border-slate-300 rounded-lg px-3 py-2 font-bold capitalize"
              >
                <option value="delivered">Delivered</option>
                <option value="pending">Pending</option>
                <option value="partially_delivered">Partially Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <User className="w-4 h-4 text-[#c5a059]" /> Customer Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  Company Name
                </label>
                <input
                  type="text"
                  value={customerCompany}
                  onChange={(e) => setCustomerCompany(e.target.value)}
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
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Drop-off Address
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

          {/* Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#c5a059]" /> Delivery Items
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
                        Item Description
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
                            value={item.remarks || ''}
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

          <div className="flex items-center justify-between pt-6 border-t border-slate-200">
            <Link
              href={`/dashboard/delivery-notes/${deliveryNote.id}`}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              &larr; Cancel
            </Link>

            <button
              type="button"
              disabled={saving}
              onClick={handleUpdate}
              className="bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] font-extrabold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Update Delivery Note
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
