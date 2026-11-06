'use client';

import React from 'react';
import { DeliveryNote, CompanySettings } from '@/types';
import { DocumentHeader } from '@/components/brand/DocumentHeader';
import { DocumentFooter } from '@/components/brand/DocumentFooter';
import { formatDate } from '@/lib/utils';

interface DeliveryNoteDocumentProps {
  deliveryNote: DeliveryNote;
  settings: CompanySettings;
  id?: string;
}

export function DeliveryNoteDocument({ deliveryNote, settings, id = 'delivery-note-print-area' }: DeliveryNoteDocumentProps) {
  const minRows = 5;
  const emptyRowsCount = Math.max(0, minRows - deliveryNote.items.length);
  const emptyRows = Array.from({ length: emptyRowsCount });

  return (
    <div
      id={id}
      className="bg-white text-slate-900 w-full max-w-[820px] mx-auto p-6 sm:p-10 shadow-lg border border-slate-200 rounded-sm print:shadow-none print:border-none print:p-8 font-sans"
      style={{ minHeight: '1080px', display: 'flex', flexDirection: 'column' }}
    >
      {/* 1. Branded Header */}
      <DocumentHeader settings={settings} />

      {/* 2. Document Title */}
      <div className="text-center my-5">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0c2340] tracking-wider uppercase">
          DELIVERY NOTE
        </h2>
        <span className="text-xs uppercase tracking-widest text-[#c5a059] font-bold">
          Material Delivery & Receiving Acknowledgment
        </span>
      </div>

      {/* 3. Delivery Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm mb-6 pb-2 text-[#0c2340]">
        <div className="flex items-baseline">
          <span className="font-bold text-base w-36 flex-shrink-0">Delivery Note No:</span>
          <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
            {deliveryNote.delivery_note_number}
          </span>
        </div>

        <div className="flex items-baseline">
          <span className="font-bold text-base w-24 flex-shrink-0">Date:</span>
          <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
            {formatDate(deliveryNote.delivery_date)}
          </span>
        </div>

        <div className="flex items-baseline">
          <span className="font-bold text-base w-36 flex-shrink-0">Customer / Client:</span>
          <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
            {deliveryNote.customer_name} {deliveryNote.customer_company ? `(${deliveryNote.customer_company})` : ''}
          </span>
        </div>

        <div className="flex items-baseline">
          <span className="font-bold text-base w-24 flex-shrink-0">Project:</span>
          <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
            {deliveryNote.project_name || 'Commercial Delivery'}
          </span>
        </div>

        <div className="flex items-baseline">
          <span className="font-bold text-sm w-36 flex-shrink-0">Delivery Location:</span>
          <span className="text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 text-xs">
            {deliveryNote.delivery_address || settings.location}
          </span>
        </div>

        <div className="flex items-baseline">
          <span className="font-bold text-sm w-24 flex-shrink-0">Ref Quotation:</span>
          <span className="text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 text-xs font-semibold">
            {deliveryNote.reference_quotation_number || 'N/A'}
          </span>
        </div>
      </div>

      {/* 4. Items Table (NO PRICES) */}
      <div className="w-full overflow-hidden border border-[#c5a059] rounded-sm mb-4">
        <table className="w-full text-left border-collapse text-xs sm:text-sm">
          <thead>
            <tr className="bg-[#0c2340] text-white">
              <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-12 text-[#f5e197]">
                S.No
              </th>
              <th className="py-2.5 px-4 font-bold border-r border-[#c5a059] text-white">
                Item / Material Description
              </th>
              <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-20 text-[#f5e197]">
                Quantity
              </th>
              <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-24 text-[#f5e197]">
                Unit
              </th>
              <th className="py-2.5 px-3 font-bold text-left w-40 text-[#f5e197]">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {deliveryNote.items.map((item, index) => (
              <tr key={item.id || index} className="border-t border-[#c5a059]/60 hover:bg-slate-50/50">
                <td className="py-2.5 px-3 text-center border-r border-[#c5a059] font-medium text-slate-700">
                  {item.s_no || index + 1}
                </td>
                <td className="py-2.5 px-4 border-r border-[#c5a059] font-medium text-slate-800 leading-snug">
                  {item.description}
                </td>
                <td className="py-2.5 px-3 text-center border-r border-[#c5a059] font-bold text-slate-900">
                  {item.quantity}
                </td>
                <td className="py-2.5 px-3 text-center border-r border-[#c5a059] text-slate-700">
                  {item.unit || 'Pieces'}
                </td>
                <td className="py-2.5 px-3 text-left text-slate-600 text-xs">
                  {item.remarks || '-'}
                </td>
              </tr>
            ))}

            {emptyRows.map((_, i) => (
              <tr key={`dn-empty-${i}`} className="border-t border-[#c5a059]/40 h-8">
                <td className="border-r border-[#c5a059]">&nbsp;</td>
                <td className="border-r border-[#c5a059]">&nbsp;</td>
                <td className="border-r border-[#c5a059]">&nbsp;</td>
                <td className="border-r border-[#c5a059]">&nbsp;</td>
                <td>&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 5. Customer Acknowledgment Box */}
      <div className="mb-6 p-3 bg-amber-50/30 border border-[#c5a059] rounded-sm text-xs sm:text-sm text-slate-800">
        <h4 className="font-extrabold text-[#0c2340] mb-1 uppercase tracking-wide flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#c5a059]" /> Customer Acknowledgment
        </h4>
        <p className="italic text-slate-700 leading-relaxed">
          &quot;{deliveryNote.acknowledgment_text || 'Received the above listed materials/equipment in good condition, correct quantity, and satisfactory specifications.'}&quot;
        </p>

        {deliveryNote.additional_remarks && (
          <div className="mt-2 pt-2 border-t border-[#c5a059]/30 text-xs text-slate-600">
            <strong>Notes / Instructions: </strong>{deliveryNote.additional_remarks}
          </div>
        )}
      </div>

      {/* 6. Signatures Grid (4 columns: Prepared, Delivered, Received, Signature) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 text-xs text-[#0c2340]">
        {/* Prepared By */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60 flex flex-col justify-between h-24">
          <span className="font-bold text-[11px] uppercase text-slate-500">Prepared By</span>
          <span className="font-bold text-slate-900 text-xs truncate">
            {deliveryNote.prepared_by || 'Store Officer'}
          </span>
          <div className="border-t border-dotted border-slate-400 pt-0.5 text-[10px] text-slate-400">
            Signature & Date
          </div>
        </div>

        {/* Delivered By */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60 flex flex-col justify-between h-24">
          <span className="font-bold text-[11px] uppercase text-slate-500">Delivered By</span>
          <span className="font-bold text-slate-900 text-xs truncate">
            {deliveryNote.delivered_by || 'Driver'}
          </span>
          <div className="border-t border-dotted border-slate-400 pt-0.5 text-[10px] text-slate-400">
            Signature & Date
          </div>
        </div>

        {/* Received By */}
        <div className="border border-slate-300 rounded p-2.5 bg-slate-50/60 flex flex-col justify-between h-24">
          <span className="font-bold text-[11px] uppercase text-slate-500">Received By</span>
          <span className="font-bold text-slate-900 text-xs truncate">
            {deliveryNote.received_by || deliveryNote.customer_name}
          </span>
          <div className="border-t border-dotted border-slate-400 pt-0.5 text-[10px] text-slate-400">
            Name & Designation
          </div>
        </div>

        {/* Customer Signature & Stamp */}
        <div className="border border-[#c5a059] rounded p-2.5 bg-amber-50/20 flex flex-col justify-between h-24">
          <span className="font-bold text-[11px] uppercase text-[#0c2340]">Customer Signature / Stamp</span>
          <span className="text-[11px] font-semibold text-emerald-700">
            {deliveryNote.customer_signature || '[ Stamp / Sign ]'}
          </span>
          <div className="border-t border-dotted border-[#c5a059] pt-0.5 text-[10px] text-slate-400">
            Authorized Receiver
          </div>
        </div>
      </div>

      {/* 7. Branded Footer */}
      <DocumentFooter tagline={settings.tagline} />
    </div>
  );
}

