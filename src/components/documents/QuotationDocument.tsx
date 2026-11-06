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
        padding: '28px 36px',
        margin: '0 auto',
        minHeight: 'auto',
        pageBreakInside: 'avoid',
        breakInside: 'avoid',
        boxSizing: 'border-box',
        WebkitPrintColorAdjust: 'exact',
        printColorAdjust: 'exact',
      } as React.CSSProperties}
    >
      <div>
        {/* 1. Branded Header (Logo, Company Arabic/English Name & CR Navy Banner) */}
        <DocumentHeader settings={settings} />

        {/* 2. Document Title */}
        <div className="text-center my-3">
          <h2 className="text-[28px] font-black text-[#0c2340] tracking-wider uppercase font-sans leading-none">
            QUOTATION
          </h2>
        </div>

        {/* 3. Document Details & Client Info Grid (Table Layout: Zero Flex/Grid baseline drift in PDF) */}
        <table
          className="w-full border-collapse mb-4 text-[13px] text-[#0c2340]"
          style={{ tableLayout: 'fixed', width: '100%' }}
        >
          <tbody>
            <tr>
              <td style={{ width: '16%', fontWeight: 700, padding: '4px 0', verticalAlign: 'middle' }}>
                Quotation No:
              </td>
              <td style={{ width: '34%', padding: '4px 12px 4px 4px', borderBottom: '1px solid #94a3b8', fontWeight: 600, color: '#1e293b' }}>
                {quotation.quotation_number}
              </td>
              <td style={{ width: '10%', fontWeight: 700, padding: '4px 0 4px 16px', verticalAlign: 'middle' }}>
                Date:
              </td>
              <td style={{ width: '40%', padding: '4px 4px 4px 4px', borderBottom: '1px solid #94a3b8', fontWeight: 600, color: '#1e293b' }}>
                {formatDate(quotation.date)}
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 700, padding: '8px 0 4px 0', verticalAlign: 'middle' }}>
                To: Client Name:
              </td>
              <td style={{ padding: '8px 12px 4px 4px', borderBottom: '1px solid #94a3b8', fontWeight: 600, color: '#1e293b' }}>
                {quotation.client_name} {quotation.client_company ? `(${quotation.client_company})` : ''}
              </td>
              <td style={{ fontWeight: 700, padding: '8px 0 4px 16px', verticalAlign: 'middle' }}>
                Project:
              </td>
              <td style={{ padding: '8px 4px 4px 4px', borderBottom: '1px solid #94a3b8', fontWeight: 600, color: '#1e293b' }}>
                {quotation.project_name || 'General Supply & Services'}
              </td>
            </tr>
            {quotation.reference_number && (
              <tr>
                <td style={{ fontWeight: 700, padding: '8px 0 4px 0', verticalAlign: 'middle' }}>
                  Ref / RFQ No:
                </td>
                <td colSpan={3} style={{ padding: '8px 4px 4px 4px', borderBottom: '1px solid #94a3b8', color: '#475569' }}>
                  {quotation.reference_number}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 4. Items Table (Dynamic: Only user's actual items rendered, gold borders, explicit inline print backgrounds) */}
        <div className="w-full border border-[#c5a059] rounded-none mb-3">
          <table className="w-full text-left border-collapse text-[12px]" style={{ tableLayout: 'fixed', width: '100%' }}>
            <thead>
              <tr
                style={{
                  backgroundColor: '#0c2340',
                  color: '#ffffff',
                  WebkitPrintColorAdjust: 'exact',
                  printColorAdjust: 'exact',
                }}
              >
                <th
                  style={{
                    width: '50px',
                    padding: '8px 6px',
                    fontWeight: 700,
                    textAlign: 'center',
                    borderRight: '1px solid #c5a059',
                    color: '#f5e197',
                    backgroundColor: '#0c2340',
                  }}
                >
                  S.No
                </th>
                <th
                  style={{
                    padding: '8px 12px',
                    fontWeight: 700,
                    borderRight: '1px solid #c5a059',
                    color: '#f5e197',
                    backgroundColor: '#0c2340',
                  }}
                >
                  Description
                </th>
                <th
                  style={{
                    width: '65px',
                    padding: '8px 6px',
                    fontWeight: 700,
                    textAlign: 'center',
                    borderRight: '1px solid #c5a059',
                    color: '#f5e197',
                    backgroundColor: '#0c2340',
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    width: '105px',
                    padding: '8px 8px',
                    fontWeight: 700,
                    textAlign: 'center',
                    borderRight: '1px solid #c5a059',
                    color: '#f5e197',
                    backgroundColor: '#0c2340',
                    lineHeight: 1.2,
                  }}
                >
                  Unit Price<br /><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}>SAR</span>
                </th>
                <th
                  style={{
                    width: '115px',
                    padding: '8px 8px',
                    fontWeight: 700,
                    textAlign: 'center',
                    color: '#f5e197',
                    backgroundColor: '#0c2340',
                    lineHeight: 1.2,
                  }}
                >
                  Total<br /><span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.9)' }}>SAR</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {quotation.items.map((item, index) => (
                <tr key={item.id || index} className="border-t border-[#c5a059]">
                  <td style={{ padding: '7px 6px', textAlign: 'center', borderRight: '1px solid #c5a059', color: '#475569', fontWeight: 500 }}>
                    {item.s_no || index + 1}
                  </td>
                  <td style={{ padding: '7px 12px', borderRight: '1px solid #c5a059', color: '#0f172a', fontWeight: 500, lineHeight: 1.35 }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '7px 6px', textAlign: 'center', borderRight: '1px solid #c5a059', fontWeight: 700, color: '#0f172a' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', borderRight: '1px solid #c5a059', fontFamily: 'monospace', color: '#1e293b' }}>
                    {formatSAR(item.unit_price)}
                  </td>
                  <td style={{ padding: '7px 8px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#0c2340' }}>
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
        <div className="mb-2">
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
      <div className="mt-2 pt-1 border-t border-slate-100">
        <DocumentFooter tagline={settings.tagline} />
      </div>
    </div>
  );
}
