'use client';

import React from 'react';
import { DeliveryNote, CompanySettings } from '@/types';
import { formatSAR, formatDateDMY, numberToWordsSAR } from '@/lib/utils';

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
        {/* 1. Multi-color Top Accent Bar (HTML divs with explicit background colors — 100% reliable in both html2canvas and print) */}
        <div
          style={{
            display: 'flex',
            width: '100%',
            height: '6px',
            lineHeight: 0,
            fontSize: 0,
            WebkitPrintColorAdjust: 'exact',
            printColorAdjust: 'exact',
          }}
        >
          <div style={{ flex: 1, backgroundColor: '#2563eb', height: '6px' }} />
          <div style={{ flex: 1, backgroundColor: '#ef4444', height: '6px' }} />
          <div style={{ flex: 1, backgroundColor: '#eab308', height: '6px' }} />
          <div style={{ flex: 1, backgroundColor: '#22c55e', height: '6px' }} />
        </div>

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

          {/* Thin Divider Line (HTML divs with explicit background colors — 100% reliable in both html2canvas and print) */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '2px',
              marginTop: '8px',
              marginBottom: '8px',
              lineHeight: 0,
              fontSize: 0,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <div style={{ flex: 1, backgroundColor: '#ef4444', height: '2px' }} />
            <div style={{ flex: 1, backgroundColor: '#eab308', height: '2px' }} />
          </div>

          {/* 3. Contact & Registration Details (Table layout for 100% rock-solid alignment in html2canvas & print) */}
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px',
              color: '#334155',
              fontWeight: 500,
              tableLayout: 'fixed',
            }}
          >
            <tbody>
              <tr>
                <td style={{ verticalAlign: 'middle', padding: '2px 0', width: '56%' }}>
                  <table style={{ borderCollapse: 'collapse', display: 'inline-table', verticalAlign: 'middle' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'middle', padding: '0 6px 0 0', lineHeight: 0, width: '16px' }}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#64748b"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ display: 'block' }}
                          >
                            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                        </td>
                        <td style={{ verticalAlign: 'middle', padding: 0, lineHeight: '14px', fontSize: '11px', color: '#334155' }}>
                          {settings.address || 'Ishara Baladeah, Aziziyah, Jeddah 23334'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '2px 0', width: '44%', textAlign: 'right' }}>
                  <table style={{ borderCollapse: 'collapse', display: 'inline-table', verticalAlign: 'middle', marginLeft: 'auto' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'middle', padding: '0 6px 0 0', lineHeight: 0, width: '16px' }}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#64748b"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ display: 'block' }}
                          >
                            <rect width="20" height="16" x="2" y="4" rx="2" />
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                          </svg>
                        </td>
                        <td style={{ verticalAlign: 'middle', padding: 0, lineHeight: '14px', fontSize: '11px', color: '#334155' }}>
                          {settings.email || 'qasdwaqeema@gmail.com'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td style={{ verticalAlign: 'middle', padding: '2px 0' }}>
                  <table style={{ borderCollapse: 'collapse', display: 'inline-table', verticalAlign: 'middle' }}>
                    <tbody>
                      <tr>
                        <td style={{ verticalAlign: 'middle', padding: '0 6px 0 0', lineHeight: 0, width: '16px' }}>
                          <svg
                            width="13"
                            height="13"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#64748b"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ display: 'block' }}
                          >
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </td>
                        <td style={{ verticalAlign: 'middle', padding: 0, lineHeight: '14px', fontSize: '11px', color: '#334155' }}>
                          Contact: {settings.phone || '053 132 8208'}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
                <td style={{ verticalAlign: 'middle', padding: '2px 0', textAlign: 'right' }}>
                  <span style={{ marginRight: '14px', fontSize: '11px', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>■ CR No:</strong> {settings.cr_number || '7012340258'}
                  </span>
                  <span style={{ fontSize: '11px', color: '#334155' }}>
                    <strong style={{ color: '#0f172a' }}>■ VAT No:</strong> {settings.vat_number || '300695361700003'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>

          {/* 4. Multi-color Horizontal Stripe (HTML divs with explicit background colors — 100% reliable in both html2canvas and print) */}
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: '3px',
              marginTop: '10px',
              marginBottom: '16px',
              lineHeight: 0,
              fontSize: 0,
              WebkitPrintColorAdjust: 'exact',
              printColorAdjust: 'exact',
            }}
          >
            <div style={{ width: '30%', backgroundColor: '#3b82f6', height: '3px' }} />
            <div style={{ width: '25%', backgroundColor: '#f43f5e', height: '3px' }} />
            <div style={{ width: '25%', backgroundColor: '#9ca3af', height: '3px' }} />
            <div style={{ width: '20%', backgroundColor: '#10b981', height: '3px' }} />
          </div>

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
            <div
              style={{
                display: 'flex',
                width: '56px',
                height: '3.5px',
                margin: '4px auto 0 auto',
                borderRadius: '2px',
                overflow: 'hidden',
                lineHeight: 0,
                fontSize: 0,
                WebkitPrintColorAdjust: 'exact',
                printColorAdjust: 'exact',
              }}
            >
              <div style={{ flex: 1, backgroundColor: '#3b82f6', height: '3.5px' }} />
              <div style={{ flex: 1, backgroundColor: '#10b981', height: '3.5px' }} />
            </div>
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
