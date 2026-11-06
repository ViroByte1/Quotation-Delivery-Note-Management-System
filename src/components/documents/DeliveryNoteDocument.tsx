'use client';

import React from 'react';
import { DeliveryNote, CompanySettings } from '@/types';
import { formatSAR, formatDateDMY, numberToWordsSAR } from '@/lib/utils';
import { MapPin, Mail, Phone } from 'lucide-react';

interface DeliveryNoteDocumentProps {
  deliveryNote: DeliveryNote;
  settings: CompanySettings;
  id?: string;
}

export function DeliveryNoteDocument({
  deliveryNote,
  settings,
  id = 'delivery-note-print-area',
}: DeliveryNoteDocumentProps) {
  // Calculate totals if not pre-stored
  const calculatedSubtotal =
    deliveryNote.subtotal !== undefined
      ? deliveryNote.subtotal
      : deliveryNote.items.reduce(
          (sum, it) => sum + (Number(it.quantity) || 0) * (Number(it.unit_price) || 0),
          0
        );

  const vatRate = deliveryNote.vat_rate !== undefined ? deliveryNote.vat_rate : (settings.vat_rate || 15);
  const calculatedVat =
    deliveryNote.vat_amount !== undefined
      ? deliveryNote.vat_amount
      : (calculatedSubtotal * vatRate) / 100;

  const calculatedTotal =
    deliveryNote.grand_total !== undefined
      ? deliveryNote.grand_total
      : calculatedSubtotal + calculatedVat;

  const amountInWords =
    deliveryNote.amount_in_words || numberToWordsSAR(calculatedTotal);

  return (
    <div
      id={id}
      className="bg-white text-slate-900 shadow-md border border-slate-200 rounded-none font-sans flex flex-col justify-between"
      style={{
        width: '794px',
        minWidth: '794px',
        maxWidth: '794px',
        padding: '0 0 32px 0',
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
        {/* 1. Multi-color Top Accent Bar (SVG vector rects — NEVER stripped by print or PDF) */}
        <svg className="w-full h-[5px] block" preserveAspectRatio="none" viewBox="0 0 400 5">
          <rect x="0" y="0" width="100" height="5" fill="#2563eb" />
          <rect x="100" y="0" width="100" height="5" fill="#ef4444" />
          <rect x="200" y="0" width="100" height="5" fill="#eab308" />
          <rect x="300" y="0" width="100" height="5" fill="#22c55e" />
        </svg>

        <div className="px-9 pt-5">
          {/* 2. Company Header with Circular Emblem & English / Arabic Names */}
          <div className="flex items-center gap-4">
            {/* Circular Emblem with Star (SVG shapes with fill — ALWAYS prints in dark navy) */}
            <div className="w-14 h-14 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-14 h-14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="48" fill="#0c1a2e" />
                <circle cx="50" cy="50" r="45" stroke="#ffffff" strokeWidth="1.5" opacity="0.3" fill="none" />
                {/* Top star */}
                <polygon points="50,14 52,19 57,19 53,22 55,27 50,24 45,27 47,22 43,19 48,19" fill="#ffffff" />
                {/* Monogram letters */}
                <text x="32" y="65" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="36">
                  n
                </text>
                <text x="50" y="65" fill="#ffffff" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="36">
                  k
                </text>
              </svg>
            </div>

            {/* Company Title */}
            <div className="flex flex-col">
              <h1 className="text-[20px] font-black text-[#111827] tracking-tight uppercase leading-tight font-sans">
                {settings.company_name_en || 'QASD WA QEEMA TRADING EST.'}
              </h1>
              <h2
                className="text-[15px] font-bold text-[#111827] mt-0.5 leading-snug"
                style={{ fontFamily: "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif", letterSpacing: '0px' }}
                dir="rtl"
              >
                {settings.company_name_ar || 'مؤسسة قصد وقيمة التجارية'}
              </h2>
            </div>
          </div>

          {/* Thin Divider Line (SVG rects) */}
          <svg className="w-full h-[2px] block mt-2 mb-2" preserveAspectRatio="none" viewBox="0 0 200 2">
            <rect x="0" y="0" width="100" height="2" fill="#ef4444" />
            <rect x="100" y="0" width="100" height="2" fill="#eab308" />
          </svg>

          {/* 3. Contact & Registration Details */}
          <div className="text-[11px] text-slate-800 font-medium space-y-1">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <MapPin className="w-3 h-3 text-slate-500" />
                {settings.address || 'Ishara Baladeah, Aziziyah, Jeddah 23334'}
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <Mail className="w-3 h-3 text-slate-500" />
                {settings.email || 'qasdwaqeema@gmail.com'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-700">
                <Phone className="w-3 h-3 text-slate-500" />
                Contact: {settings.phone || '053 132 8208'}
              </span>
              <div className="flex items-center gap-3 text-slate-700">
                <span>
                  <strong className="text-slate-900">■ CR No:</strong> {settings.cr_number || '7012340258'}
                </span>
                <span>
                  <strong className="text-slate-900">■ VAT No:</strong> {settings.vat_number || '300695361700003'}
                </span>
              </div>
            </div>
          </div>

          {/* 4. Multi-color Horizontal Stripe (SVG vector) */}
          <svg className="w-full h-[3px] block mt-2.5 mb-4" preserveAspectRatio="none" viewBox="0 0 400 3">
            <rect x="0" y="0" width="120" height="3" fill="#3b82f6" />
            <rect x="120" y="0" width="100" height="3" fill="#f43f5e" />
            <rect x="220" y="0" width="100" height="3" fill="#9ca3af" />
            <rect x="320" y="0" width="80" height="3" fill="#10b981" />
          </svg>

          {/* 5. Document Title: DELIVERY NOTE / إذن تسليم */}
          <div className="text-center my-2">
            <h2 className="text-[24px] font-black text-[#1e3a5f] tracking-wide uppercase font-sans leading-none">
              DELIVERY NOTE
            </h2>
            <div
              className="text-[13px] font-bold text-[#1e3a5f] mt-0.5 leading-snug"
              style={{ fontFamily: "'Cairo', 'Segoe UI', Tahoma, Arial, sans-serif", letterSpacing: '0px' }}
              dir="rtl"
            >
              إذن تسليم
            </div>
            {/* Blue & Green Pill Accent */}
            <svg className="w-14 h-[3.5px] mx-auto mt-1 block" viewBox="0 0 60 4">
              <rect x="0" y="0" width="30" height="4" rx="2" fill="#3b82f6" />
              <rect x="30" y="0" width="30" height="4" rx="2" fill="#10b981" />
            </svg>
          </div>

          {/* 6. Delivery Metadata Grid Box (Clean HTML Table: Zero Flex/Grid bug in PDF export) */}
          <table
            className="w-full border-collapse border border-slate-300 text-[12px] mb-4 mt-3"
            style={{ tableLayout: 'fixed', width: '100%' }}
          >
            <tbody>
              <tr className="border-b border-slate-300">
                <td
                  style={{ width: '18%', padding: '6px 8px', fontWeight: 700, color: '#1e293b', borderRight: '1px solid #cbd5e1' }}
                >
                  Purchase order
                </td>
                <td
                  style={{ width: '32%', padding: '6px 8px', color: '#334155', fontWeight: 500, borderRight: '1px solid #cbd5e1' }}
                >
                  {deliveryNote.purchase_order || deliveryNote.reference_quotation_number || '-'}
                </td>
                <td
                  style={{ width: '18%', padding: '6px 8px', fontWeight: 700, color: '#1e293b', borderRight: '1px solid #cbd5e1' }}
                >
                  Date of delivery
                </td>
                <td
                  style={{ width: '32%', padding: '6px 8px', color: '#334155', fontWeight: 500 }}
                >
                  {formatDateDMY(deliveryNote.delivery_date)}
                </td>
              </tr>
              <tr>
                <td
                  style={{ width: '18%', padding: '6px 8px', fontWeight: 700, color: '#1e293b', borderRight: '1px solid #cbd5e1' }}
                >
                  LOC No./Name
                </td>
                <td
                  style={{ width: '32%', padding: '6px 8px', color: '#334155', fontWeight: 500, borderRight: '1px solid #cbd5e1' }}
                >
                  {deliveryNote.loc_no_name || deliveryNote.project_name || '-'}
                </td>
                <td
                  style={{ width: '18%', padding: '6px 8px', fontWeight: 700, color: '#1e293b', borderRight: '1px solid #cbd5e1' }}
                >
                  Delivered to
                </td>
                <td
                  style={{ width: '32%', padding: '6px 8px', color: '#334155', fontWeight: 500 }}
                >
                  {deliveryNote.delivered_to || deliveryNote.customer_company || deliveryNote.customer_name}
                </td>
              </tr>
            </tbody>
          </table>

          {/* 7. Items Table with Charcoal Header (#374151) and Pricing Columns */}
          <div className="w-full border border-slate-300 rounded-none mb-3">
            <table className="w-full text-left border-collapse text-[12px]" style={{ tableLayout: 'fixed', width: '100%' }}>
              <thead>
                <tr
                  style={{
                    backgroundColor: '#374151',
                    color: '#ffffff',
                    WebkitPrintColorAdjust: 'exact',
                    printColorAdjust: 'exact',
                  }}
                >
                  <th
                    style={{
                      width: '46px',
                      padding: '7px 8px',
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#ffffff',
                      borderRight: '1px solid #6b7280',
                      backgroundColor: '#374151',
                    }}
                  >
                    No.
                  </th>
                  <th
                    style={{
                      padding: '7px 10px',
                      fontWeight: 700,
                      color: '#ffffff',
                      borderRight: '1px solid #6b7280',
                      backgroundColor: '#374151',
                    }}
                  >
                    Description
                  </th>
                  <th
                    style={{
                      width: '70px',
                      padding: '7px 8px',
                      fontWeight: 700,
                      textAlign: 'center',
                      color: '#ffffff',
                      borderRight: '1px solid #6b7280',
                      backgroundColor: '#374151',
                    }}
                  >
                    QTY
                  </th>
                  <th
                    style={{
                      width: '95px',
                      padding: '7px 10px',
                      fontWeight: 700,
                      textAlign: 'right',
                      color: '#ffffff',
                      borderRight: '1px solid #6b7280',
                      backgroundColor: '#374151',
                    }}
                  >
                    U. Price
                  </th>
                  <th
                    style={{
                      width: '105px',
                      padding: '7px 10px',
                      fontWeight: 700,
                      textAlign: 'right',
                      color: '#ffffff',
                      backgroundColor: '#374151',
                    }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {deliveryNote.items.map((item, index) => {
                  const qty = Number(item.quantity) || 0;
                  const uPrice = item.unit_price !== undefined ? Number(item.unit_price) : 0;
                  const lineTotal = item.total !== undefined ? Number(item.total) : qty * uPrice;

                  return (
                    <tr key={item.id || index} className="border-t border-slate-200">
                      <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', color: '#475569' }}>
                        {item.s_no || index + 1}
                      </td>
                      <td style={{ padding: '6px 10px', borderRight: '1px solid #e2e8f0', color: '#1e293b', lineHeight: 1.35 }}>
                        {item.description}
                      </td>
                      <td style={{ padding: '6px 8px', textAlign: 'center', borderRight: '1px solid #e2e8f0', fontWeight: 700, color: '#0f172a' }}>
                        {item.quantity}
                      </td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', borderRight: '1px solid #e2e8f0', fontFamily: 'monospace', color: '#334155' }}>
                        {formatSAR(uPrice)}
                      </td>
                      <td style={{ padding: '6px 10px', textAlign: 'right', fontFamily: 'monospace', fontWeight: 700, color: '#0f172a' }}>
                        {formatSAR(lineTotal)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 8. Bottom Section: IN WORDS on Left, Totals Table on Right */}
          <table className="w-full border-collapse mt-2 mb-8" style={{ tableLayout: 'fixed' }}>
            <tbody>
              <tr>
                {/* Left: IN WORDS */}
                <td style={{ verticalAlign: 'top', width: '58%', paddingRight: '20px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    IN WORDS
                  </span>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', marginTop: '4px', lineHeight: 1.4 }}>
                    {amountInWords}
                  </p>
                </td>

                {/* Right: Totals Box */}
                <td style={{ verticalAlign: 'top', width: '42%' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '4px 0', color: '#475569', fontWeight: 500 }}>Sub Total</td>
                        <td style={{ padding: '4px 0', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                          {formatSAR(calculatedSubtotal)}
                        </td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '4px 0', color: '#475569', fontWeight: 500 }}>15% VAT</td>
                        <td style={{ padding: '4px 0', textAlign: 'right', fontFamily: 'monospace', fontWeight: 600, color: '#0f172a' }}>
                          {formatSAR(calculatedVat)}
                        </td>
                      </tr>
                      <tr style={{ borderTop: '2px solid #0f172a', borderBottom: '2px solid #0f172a', fontWeight: 800 }}>
                        <td style={{ padding: '6px 0', color: '#0f172a', fontSize: '13px' }}>Total</td>
                        <td style={{ padding: '6px 0', textAlign: 'right', fontFamily: 'monospace', fontSize: '13px', color: '#0f172a' }}>
                          {formatSAR(calculatedTotal)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 9. Sign-off / Sales Person (Bottom Left, matching reference image) */}
          <div className="mt-8 w-60">
            <div className="border-t border-slate-400 w-44 mb-1.5" />
            <p className="font-bold text-[13px] text-slate-900 leading-tight">
              {deliveryNote.sales_person || settings.authorized_person_name || 'Abid Mughal'}
            </p>
            <p className="text-[11px] text-slate-600 font-medium leading-tight">
              {settings.authorized_person_designation || 'Sale Person'}
            </p>
            <p className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
              {settings.company_name_en || 'QASD WA QEEMA TRADING EST.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
