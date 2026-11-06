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
      className="bg-white text-slate-900 w-full max-w-[820px] mx-auto p-4 sm:p-7 shadow-lg border border-slate-200 rounded-sm print:shadow-none print:border-none print:p-2 font-sans flex flex-col justify-between"
      style={{ minHeight: 'auto', pageBreakInside: 'avoid', breakInside: 'avoid' }}
    >
      <div>
        {/* 1. Branded Header */}
        <DocumentHeader settings={settings} />

        {/* 2. Document Title */}
        <div className="text-center my-3 sm:my-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0c2340] tracking-wider uppercase">
            QUOTATION
          </h2>
        </div>

        {/* 3. Document Details & Client Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-6 text-xs sm:text-sm mb-3.5 pb-1 text-[#0c2340]">
          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-28 sm:w-32 flex-shrink-0">Quotation No:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
              {quotation.quotation_number}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-16 sm:w-20 flex-shrink-0">Date:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5">
              {formatDate(quotation.date)}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-28 sm:w-32 flex-shrink-0">To Client Name:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 truncate">
              {quotation.client_name} {quotation.client_company ? `(${quotation.client_company})` : ''}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="font-bold text-xs sm:text-sm w-16 sm:w-20 flex-shrink-0">Project:</span>
            <span className="font-semibold text-slate-800 border-b border-dotted border-slate-400 flex-1 pb-0.5 truncate">
              {quotation.project_name || 'General Supply & Services'}
            </span>
          </div>

          {quotation.reference_number && (
            <div className="flex items-baseline col-span-1 sm:col-span-2">
              <span className="font-bold text-xs w-28 sm:w-32 flex-shrink-0">Ref / RFQ No:</span>
              <span className="text-slate-700 border-b border-dotted border-slate-400 flex-1 pb-0.5 text-xs">
                {quotation.reference_number}
              </span>
            </div>
          )}
        </div>

        {/* 4. Items Table (Dynamic: Only user's actual items rendered) */}
        <div className="w-full overflow-hidden border border-[#c5a059] rounded-sm mb-3">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0c2340] text-white">
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-12 text-[#f5e197]">
                  S.No
                </th>
                <th className="py-2 px-3 font-bold border-r border-[#c5a059] text-white">
                  Description
                </th>
                <th className="py-2 px-3 font-bold text-center border-r border-[#c5a059] w-16 text-[#f5e197]">
                  Qty
                </th>
                <th className="py-2 px-3 font-bold text-right border-r border-[#c5a059] w-28 text-[#f5e197]">
                  Unit Price<br /><span className="text-[10px] text-white/80">SAR</span>
                </th>
                <th className="py-2 px-3 font-bold text-right w-32 text-[#f5e197]">
                  Total<br /><span className="text-[10px] text-white/80">SAR</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id || index} className="border-t border-[#c5a059]/60 hover:bg-slate-50/50">
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

        {/* 5. Totals Block (Right Aligned, Gold Bordered Box) */}
        <div className="flex justify-end mb-3.5">
          <div className="w-56 sm:w-64 border border-[#c5a059] rounded-sm p-2 sm:p-2.5 bg-amber-50/20 text-xs shadow-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-[#c5a059]/40">
              <span className="font-bold text-[#0c2340]">Subtotal:</span>
              <span className="font-mono font-semibold text-slate-800">
                SAR {formatSAR(quotation.subtotal)}
              </span>
            </div>
            <div className="flex justify-between items-center py-0.5 border-b border-[#c5a059]/40">
              <span className="font-bold text-[#0c2340]">VAT {quotation.vat_rate || 15}%:</span>
              <span className="font-mono font-semibold text-slate-800">
                SAR {formatSAR(quotation.vat_amount)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-1 text-[#0c2340]">
              <span className="font-extrabold text-xs sm:text-sm">Grand Total:</span>
              <span className="font-mono font-extrabold text-xs sm:text-sm text-[#0c2340]">
                SAR {formatSAR(quotation.grand_total)}
              </span>
            </div>
          </div>
        </div>

        {/* 6. Terms & Conditions */}
        <div className="mb-3 text-xs text-slate-800">
          <h4 className="font-extrabold text-[#0c2340] mb-1 text-xs uppercase tracking-wide">
            Terms &amp; Conditions:
          </h4>
          <ul className="space-y-0.5 pl-1 text-[11px] sm:text-xs">
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
        <div className="mb-2 pt-1">
          <div className="w-56 sm:w-60">
            <p className="text-xs text-[#0c2340] font-semibold mb-1">
              Authorized Signature:
            </p>
            <div className="h-8 border-b border-slate-400 mb-1 flex items-end">
              {quotation.signature_url || settings.signature_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={quotation.signature_url || settings.signature_url}
                  alt="Authorized Signature"
                  className="max-h-8 max-w-full object-contain"
                />
              ) : null}
            </div>
            <p className="font-extrabold text-[#0c2340] text-xs sm:text-sm leading-tight">
              {quotation.authorized_person || settings.authorized_person_name || 'Abid Mughal'}
            </p>
            <p className="text-[11px] text-slate-600 font-medium leading-none">
              {quotation.authorized_designation || settings.authorized_person_designation || 'Managing Director'}
            </p>
          </div>
        </div>
      </div>

      {/* 8. Branded Footer with Golden Saudi Skyline */}
      <div className="mt-2 pt-1 border-t border-slate-100">
        <DocumentFooter tagline={settings.tagline} />
      </div>
    </div>
  );
}
