import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { QuotationItem } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSAR(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.00';
  }
  return new Intl.NumberFormat('en-SA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function formatDateISO(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function calculateQuotationTotals(
  items: Pick<QuotationItem, 'quantity' | 'unit_price'>[],
  vatRate: number = 15
) {
  const subtotal = items.reduce((sum, item) => {
    const qty = Number(item.quantity) || 0;
    const price = Number(item.unit_price) || 0;
    return sum + qty * price;
  }, 0);

  const vatAmount = (subtotal * vatRate) / 100;
  const grandTotal = subtotal + vatAmount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vatRate,
    vatAmount: Math.round(vatAmount * 100) / 100,
    grandTotal: Math.round(grandTotal * 100) / 100,
  };
}

export function getStatusBadgeVariant(status: string) {
  switch (status.toLowerCase()) {
    case 'accepted':
    case 'delivered':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'sent':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'draft':
    case 'pending':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'rejected':
    case 'cancelled':
      return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'expired':
      return 'bg-slate-100 text-slate-600 border-slate-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
