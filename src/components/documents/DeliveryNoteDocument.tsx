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
  return (
    <div
      id={id}
      className="bg-white text-slate-900 w-full max-w-[820px] mx-auto p-4 sm:p-7 shadow-lg border border-slate-200 rounded-sm print:shadow-none print:border-none print:p-2 font-sans flex flex-col justify-between"
      style={{ minHeight: 'auto', pageBreakInside: 'avoid', breakInside: 'avoid' }}
    >
      <div>
        {/* 1. Branded Header */}
        <DocumentHeader settings={settings} />

        {/* 2. Document Title */}
        <div className="text-center my-3 sm:my-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-wider uppercase">
            DELIVERY NOTE
          </h2>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-[#c5a059] font-bold">
            Material Delivery &amp; Receiving Acknowledgment
          </span>
        </div>

        {/* 3. Delivery Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-xs sm:text-sm mb-3.5 pb-1 text-[#0c2340]">
          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-32 sm:w-36 flex-shrink-0">Delivery Note No:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
              {deliveryNote.delivery_note_number}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-20 sm:w-24 flex-shrink-0">Date:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
              {formatDate(deliveryNote.delivery_date)}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-32 sm:w-36 flex-shrink-0">Customer / Client:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 truncate">
              {deliveryNote.customer_name} {deliveryNote.customer_company ? `(${deliveryNote.customer_company})` : ''}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-20 sm:w-24 flex-shrink-0">Project:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 truncate">
              {deliveryNote.project_name || 'Commercial Delivery'}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs w-32 sm:w-36 flex-shrink-0">Delivery Location:</span>
            <span className="text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 text-xs truncate">
              {deliveryNote.delivery_address || settings.location}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs w-20 sm:w-24 flex-shrink-0">Ref Quotation:</span>
            <span className="text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 text-xs font-semibold">
              {deliveryNote.reference_quotation_number || 'N/A'}
            </span>
          </div>
        </div>

        {/* 4. Items Table (NO PRICES) */}
        <div className="w-full overflow-hidden border border-[#c5a059] rounded-sm mb-3">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0c2340] text-white">
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-12 text-[#f5e197]">
                  S.No
                </th>
                <th className="py-2 px-3 font-bold border-r border-[#c5a059] text-white">
                  Item / Material Description
                </th>
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-20 text-[#f5e197]">
                  Quantity
                </th>
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-24 text-[#f5e197]">
                  Unit
                </th>
                <th className="py-2 px-3 font-bold text-left w-40 text-[#f5e197]">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryNote.items.map((item, index) => (
                <tr key={item.id || index} className="border-t border-[#c5a059]/60 hover:bg-slate-50/50">
                  <td className="py-2 px-3 text-center border-r border-[#c5a059] font-medium text-slate-700">
                    {item.s_no || index + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-[#c5a059] font-medium text-slate-800 leading-snug">
                    {item.description}
                  </td>
                  <td className="py-2 px-3 text-center border-r border-[#c5a059] font-bold text-slate-900">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 text-center border-r border-[#c5a059] text-slate-700">
                    {item.unit || 'Pieces'}
                  </td>
                  <td className="py-2 px-3 text-left text-slate-600 text-xs">
                    {item.remarks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Customer Acknowledgment Box */}
        <div className="mb-3 p-2.5 bg-amber-50/30 border border-[#c5a059] rounded-sm text-xs text-slate-800">
          <h4 className="font-extrabold text-[#0c2340] mb-0.5 uppercase tracking-wide flex items-center gap-1.5 text-[11px] sm:text-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> Customer Acknowledgment
          </h4>
          <p className="italic text-slate-700 leading-relaxed text-[11px] sm:text-xs">
            &quot;{deliveryNote.acknowledgment_text || 'Received the above listed materials/equipment in good condition, correct quantity, and satisfactory specifications.'}&quot;
          </p>

          {deliveryNote.additional_remarks && (
            <div className="mt-1.5 pt-1 border-t border-[#c5a059]/30 text-[10px] text-slate-600">
              <strong>Notes / Instructions: </strong>{deliveryNote.additional_remarks}
            </div>
          )}
        </div>

        {/* 6. Signatures Grid (4 columns) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3 text-xs text-[#0c2340]">
          <div className="border border-slate-300 rounded p-2 bg-slate-50/60 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-slate-500">Prepared By</span>
            <span className="font-bold text-slate-900 text-xs truncate">
              {deliveryNote.prepared_by || 'Store Officer'}
            </span>
            <div className="border-t border-dotted border-slate-400 pt-0.5 text-[9px] text-slate-400">
              Signature &amp; Date
            </div>
          </div>

          <div className="border border-slate-300 rounded p-2 bg-slate-50/60 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-slate-500">Delivered By</span>
            <span className="font-bold text-slate-900 text-xs truncate">
              {deliveryNote.delivered_by || 'Driver'}
            </span>
            <div className="border-t border-dotted border-slate-400 pt-0.5 text-[9px] text-slate-400">
              Signature &amp; Date
            </div>
          </div>

          <div className="border border-slate-300 rounded p-2 bg-slate-50/60 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-slate-500">Received By</span>
            <span className="font-bold text-slate-900 text-xs truncate">
              {deliveryNote.received_by || deliveryNote.customer_name}
            </span>
            <div className="border-t border-dotted border-slate-400 pt-0.5 text-[9px] text-slate-400">
              Name &amp; Designation
            </div>
          </div>

          <div className="border border-[#c5a059] rounded p-2 bg-amber-50/20 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-[#0c2340]">Customer Stamp / Signature</span>
            <span className="text-[10px] font-semibold text-emerald-700 truncate">
              {deliveryNote.customer_signature || '[ Stamp / Sign ]'}
            </span>
            <div className="border-t border-dotted border-[#c5a059] pt-0.5 text-[9px] text-slate-400">
              Authorized Receiver
            </div>
          </div>
        </div>
      </div>

      {/* 7. Branded Footer */}
      <div className="mt-1 pt-1 border-t border-slate-100">
        <DocumentFooter tagline={settings.tagline} />
      </div>
    </div>
  );
}
