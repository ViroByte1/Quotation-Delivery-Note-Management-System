'use client';

import React from 'react';
import { Quotation, CompanySettings } from '@/types';
import { DocumentHeader } from '@/components/brand/DocumentHeader';
import { DocumentFooter } from '@/components/brand/DocumentFooter';
import { formatSAR, formatDate } from '@/lib/utils';

interface QuotationDocumentProps {
  quotation: Quotation;
  settings: CompanySettings;
  id?: string;
}

export function QuotationDocument({ quotation, settings, id = 'quotation-print-area' }: QuotationDocumentProps) {
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
        {/* 1. Branded Header (Logo, Company Arabic/English Name & CR Navy Banner) */}
        <DocumentHeader settings={settings} />

        {/* 2. Document Title */}
        <div className="text-center my-4">
          <h2 className="text-[30px] font-black text-[#0c2340] tracking-wider uppercase font-sans">
            QUOTATION
          </h2>
        </div>

        {/* 3. Document Details & Client Info Grid (2 Columns, matching reference sample) */}
        <div className="grid grid-cols-2 gap-y-2.5 gap-x-8 text-[13px] mb-4 text-[#0c2340]">
          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-28 flex-shrink-0">Quotation No:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {quotation.quotation_number}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-14 flex-shrink-0">Date:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {formatDate(quotation.date)}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-28 flex-shrink-0">To: Client Name:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {quotation.client_name} {quotation.client_company ? `(${quotation.client_company})` : ''}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-[13px] w-14 flex-shrink-0">Project:</span>
            <span className="font-semibold text-slate-800 border-b border-slate-400 flex-1 pb-0.5 px-1 truncate">
              {quotation.project_name || 'General Supply & Services'}
            </span>
          </div>

          {quotation.reference_number && (
            <div className="flex items-baseline col-span-2">
              <span className="font-bold text-[12px] w-28 flex-shrink-0">Ref / RFQ No:</span>
              <span className="text-slate-700 border-b border-slate-400 flex-1 pb-0.5 px-1 text-[12px]">
                {quotation.reference_number}
              </span>
            </div>
          )}
        </div>

        {/* 4. Items Table (Dynamic: Only user's actual items rendered, gold borders) */}
        <div className="w-full border border-[#c5a059] rounded-none mb-3">
          <table className="w-full text-left border-collapse text-[12px]">
            <thead>
              <tr className="bg-[#0c2340] text-white">
                <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-14 text-[#f5e197]">
                  S.No
                </th>
                <th className="py-2.5 px-3 font-bold border-r border-[#c5a059] text-[#f5e197]">
                  Description
                </th>
                <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-16 text-[#f5e197]">
                  Qty
                </th>
                <th className="py-2.5 px-3 font-bold text-center border-r border-[#c5a059] w-28 text-[#f5e197] leading-tight">
                  Unit Price<br /><span className="text-[10px] text-white/90">SAR</span>
                </th>
                <th className="py-2.5 px-3 font-bold text-center w-32 text-[#f5e197] leading-tight">
                  Total<br /><span className="text-[10px] text-white/90">SAR</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id || index} className="border-t border-[#c5a059]">
                  <td className="py-2 px-3 text-center border-r border-[#c5a059] font-medium text-slate-700">
                    {item.s_no || index + 1}
                  </td>
                  <td className="py-2 px-3 border-r border-[#c5a059] font-medium text-slate-800 leading-snug">
                    {item.description}
                  </td>
                  <td className="py-2 px-3 text-center border-r border-[#c5a059] font-semibold text-slate-800">
                    {item.quantity}
                  </td>
                  <td className="py-2 px-3 text-right border-r border-[#c5a059] font-mono text-slate-800">
                    {formatSAR(item.unit_price)}
                  </td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#0c2340]">
                    {formatSAR(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 5. Totals Block (Right Aligned, Gold Bordered Box matching reference) */}
        <div className="flex justify-end mb-4">
          <div className="w-64 border border-[#c5a059] p-2.5 bg-white text-[12px]">
            <div className="flex justify-between items-baseline py-1">
              <span className="font-bold text-[#0c2340] flex-shrink-0">Subtotal: SAR</span>
              <span className="font-mono font-bold text-slate-900 border-b border-slate-300 flex-1 text-right ml-2 pb-0.5">
                {formatSAR(quotation.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-baseline py-1">
              <span className="font-bold text-[#0c2340] flex-shrink-0">VAT {quotation.vat_rate || 15}%: SAR</span>
              <span className="font-mono font-bold text-slate-900 border-b border-slate-300 flex-1 text-right ml-2 pb-0.5">
                {formatSAR(quotation.vat_amount)}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-1.5 text-[#0c2340]">
              <span className="font-black text-[13px] flex-shrink-0">Grand Total: SAR</span>
              <span className="font-mono font-black text-[13px] text-[#0c2340] border-b border-slate-300 flex-1 text-right ml-2 pb-0.5">
                {formatSAR(quotation.grand_total)}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Terms & Conditions */}
        <div className="mb-4 text-[12px] text-slate-800">
          <h4 className="font-black text-[#0c2340] mb-1.5 text-[12px] uppercase tracking-wide">
            Terms &amp; Conditions:
          </h4>
          <ul className="space-y-1 pl-1 text-[11px]">
            {quotation.terms_and_conditions && quotation.terms_and_conditions.length > 0 ? (
              quotation.terms_and_conditions.map((term, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-[#c5a059] mr-1.5 font-bold">•</span>
                  <span className="leading-tight">{term}</span>
                </li>
              ))
            ) : (
              <>
                <li className="flex items-start">
                  <span className="text-[#c5a059] mr-1.5 font-bold">•</span>
                  <span className="leading-tight">Payment Terms: 50% advance, 50% upon completion of work.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c5a059] mr-1.5 font-bold">•</span>
                  <span className="leading-tight">Quotation is valid for 30 days from the date of issuance.</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#c5a059] mr-1.5 font-bold">•</span>
                  <span className="leading-tight">All prices are quoted in Saudi Riyals and inclusive of standard services unless otherwise stated.</span>
                </li>
              </>
            )}
          </ul>

          {quotation.notes && (
            <div className="mt-2 p-1.5 bg-slate-50 border-l-2 border-[#0c2340] text-[11px] text-slate-600 rounded-r">
              <strong className="text-[#0c2340]">Note: </strong>{quotation.notes}
            </div>
          )}
        </div>

        {/* 7. Authorized Signature */}
        <div className="mb-3">
          <div className="w-64">
            <div className="flex items-baseline mb-1">
              <span className="text-[12px] text-[#0c2340] font-bold flex-shrink-0">Authorized Signature:</span>
              <div className="border-b border-slate-400 flex-1 ml-2 h-4 flex items-end">
                {quotation.signature_url || settings.signature_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={quotation.signature_url || settings.signature_url}
                    alt="Authorized Signature"
                    className="max-h-6 max-w-full object-contain"
                  />
                ) : null}
              </div>
            </div>
            <p className="font-black text-[#0c2340] text-[13px] leading-tight mt-1">
              {quotation.authorized_person || settings.authorized_person_name || 'Abid Mughal'}
            </p>
            <p className="text-[11px] text-slate-600 font-medium leading-none">
              {quotation.authorized_designation || settings.authorized_person_designation || 'Managing Director'}
            </p>
          </div>
        </div>
      </div>

      {/* 8. Branded Footer with Golden Saudi Skyline */}
      <div className="mt-3 pt-1 border-t border-slate-100">
        <DocumentFooter tagline={settings.tagline} />
      </div>
    </div>
  );
}
