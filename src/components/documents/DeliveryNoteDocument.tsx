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
      className="bg-white text-slate-900 shadow-md border border-slate-200 rounded-none font-sans flex flex-col justify-between"
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        padding: '32px 36px',
        margin: '0 auto',
        minHeight: 'auto',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        boxSizing: 'border-box',
      }}
    >
      <div>
        {/* 1. Branded Header */}
        <DocumentHeader settings={settings} />

        {/* 2. Document Title */}
        <div className="text-center my-3.5">
          <h2 className="text-[30px] font-black text-[#0c2340] tracking-wider uppercase font-sans">
            DELIVERY NOTE
          </h2>
          <span className="text-[11px] uppercase tracking-widest text-[#c5a059] font-bold">
            Material Delivery &amp; Receiving Acknowledgment
          </span>
        </div>

        {/* 3. Delivery Details Grid (2 columns, non-collapsing) */}
        <div className="grid grid-cols-2 gap-y-2 gap-x-8 text-[13px] mb-3.5 text-[#0c2340]">
          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-32 flex-shrink-0">Delivery Note No:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {deliveryNote.delivery_note_number}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-16 flex-shrink-0">Date:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {formatDate(deliveryNote.delivery_date)}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-32 flex-shrink-0">Customer / Client:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {deliveryNote.customer_name} {deliveryNote.customer_company ? `(${deliveryNote.customer_company})` : ''}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-16 flex-shrink-0">Project:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {deliveryNote.project_name || 'Commercial Delivery'}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[12px] w-32 flex-shrink-0">Delivery Location:</span>
            <span className="text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 text-[12px] truncate">
              {deliveryNote.delivery_address || settings.location}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[12px] w-16 flex-shrink-0">Ref Quote:</span>
            <span className="text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 text-[12px] font-semibold">
              {deliveryNote.reference_quotation_number || 'N/A'}
            </span>
          </div>
        </div>

        {/* 4. Items Table (NO PRICES) */}
        <div className="w-full border border-[#c5a059] rounded-none mb-3">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#0c2340] text-white">
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-14 text-[#f5e197]">
                  S.No
                </th>
                <th className="py-2 px-3 font-bold border-r border-[#c5a059] text-[#f5e197]">
                  Item / Material Description
                </th>
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-20 text-[#f5e197]">
                  Quantity
                </th>
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-24 text-[#f5e197]">
                  Unit
                </th>
                <th className="py-2 px-3 font-bold text-left w-44 text-[#f5e197]">
                  Remarks
                </th>
              </tr>
            </thead>
            <tbody>
              {deliveryNote.items.map((item, index) => (
                <tr key={item.id || index} className="border-t border-[#c5a059]">
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
                  <td className="py-2 px-3 text-left text-slate-600 text-[11px]">
                    {item.remarks || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Customer Acknowledgment Box */}
        <div className="mb-3.5 p-2.5 bg-amber-50/20 border border-[#c5a059] text-[11px] text-slate-800">
          <h4 className="font-black text-[#0c2340] mb-0.5 uppercase tracking-wide flex items-center gap-1.5 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" /> Customer Acknowledgment
          </h4>
          <p className="italic text-slate-700 leading-relaxed text-[11px]">
            &quot;{deliveryNote.acknowledgment_text || 'Received the above listed materials/equipment in good condition, correct quantity, and satisfactory specifications.'}&quot;
          </p>

          {deliveryNote.additional_remarks && (
            <div className="mt-1 pt-1 border-t border-[#c5a059]/30 text-[10px] text-slate-600">
              <strong>Notes / Instructions: </strong>{deliveryNote.additional_remarks}
            </div>
          )}
        </div>

        {/* 6. Signatures Grid (4 columns) */}
        <div className="grid grid-cols-4 gap-2.5 mb-3 text-[11px] text-[#0c2340]">
          <div className="border border-slate-300 rounded-none p-2 bg-slate-50/60 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-slate-500">Prepared By</span>
            <span className="font-bold text-slate-900 text-[11px] truncate">
              {deliveryNote.prepared_by || 'Store Officer'}
            </span>
            <div className="border-t border-dotted border-slate-400 pt-0.5 text-[9px] text-slate-400">
              Signature &amp; Date
            </div>
          </div>

          <div className="border border-slate-300 rounded-none p-2 bg-slate-50/60 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-slate-500">Delivered By</span>
            <span className="font-bold text-slate-900 text-[11px] truncate">
              {deliveryNote.delivered_by || 'Driver'}
            </span>
            <div className="border-t border-dotted border-slate-400 pt-0.5 text-[9px] text-slate-400">
              Signature &amp; Date
            </div>
          </div>

          <div className="border border-slate-300 rounded-none p-2 bg-slate-50/60 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-slate-500">Received By</span>
            <span className="font-bold text-slate-900 text-[11px] truncate">
              {deliveryNote.received_by || deliveryNote.customer_name}
            </span>
            <div className="border-t border-dotted border-slate-400 pt-0.5 text-[9px] text-slate-400">
              Name &amp; Designation
            </div>
          </div>

          <div className="border border-[#c5a059] rounded-none p-2 bg-amber-50/10 flex flex-col justify-between h-20">
            <span className="font-bold text-[10px] uppercase text-[#0c2340]">Customer Stamp / Sign</span>
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
      <div className="mt-2 pt-1 border-t border-slate-100">
        <DocumentFooter tagline={settings.tagline} />
      </div>
    </div>
  );
}
