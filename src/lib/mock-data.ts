import { Quotation, DeliveryNote, Client } from '@/types';
import { DEFAULT_COMPANY_SETTINGS } from './constants';

export const INITIAL_CLIENTS: Client[] = [
  {
    id: 'client-1',
    name: 'Eng. Tariq Al-Ghamdi',
    company: 'Rabigh Petrochemical Services Co.',
    phone: '055 123 4567',
    email: 'procurement@rabighpetro.sa',
    address: 'Petro Rabigh Industrial Complex, Gate 4, Rabigh',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'client-2',
    name: 'Mohammed Mansoor',
    company: 'KAEC Industrial Valley Logistics',
    phone: '050 987 6543',
    email: 'm.mansoor@kaec-logistics.com',
    address: 'Industrial Valley Phase 2, King Abdullah Economic City',
    created_at: '2026-02-01T09:30:00Z',
  },
];

// Single Initial Quotation (2 Products, exact 1-page fit matching client sample)
export const INITIAL_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-001',
    quotation_number: 'QWQ-2026-0104',
    date: '2026-02-18',
    valid_until: '2026-03-20',
    reference_number: 'RFQ-PETRO-26-889',
    client_name: 'Eng. Tariq Al-Ghamdi',
    client_company: 'Rabigh Petrochemical Services Co.',
    client_phone: '055 123 4567',
    client_email: 'procurement@rabighpetro.sa',
    client_address: 'Petro Rabigh Industrial Complex, Gate 4, Rabigh',
    project_name: 'Refinery Maintenance & Piping Safety Supplies',
    items: [
      {
        id: 'item-101',
        s_no: 1,
        description: 'Heavy Duty Stainless Steel 316 Flange Gaskets (4 Inch ANSI 300#)',
        quantity: 50,
        unit_price: 185.00,
        total: 9250.00,
      },
      {
        id: 'item-102',
        s_no: 2,
        description: 'Industrial Safety Harness Full Body with Shock Absorber (CE Certified)',
        quantity: 25,
        unit_price: 420.00,
        total: 10500.00,
      },
    ],
    subtotal: 19750.00,
    vat_rate: 15,
    vat_amount: 2962.50,
    grand_total: 22712.50,
    terms_and_conditions: [...DEFAULT_COMPANY_SETTINGS.terms_conditions],
    notes: 'Free on-site delivery to Rabigh Petrochemical Complex within 3 business days of LPO.',
    status: 'accepted',
    authorized_person: 'Abid Mughal',
    authorized_designation: 'Managing Director',
    created_at: '2026-02-18T10:00:00Z',
    updated_at: '2026-02-19T14:30:00Z',
  },
];

// Single Initial Delivery Note (Matching the single quotation, 2 items delivered)
export const INITIAL_DELIVERY_NOTES: DeliveryNote[] = [
  {
    id: 'dn-001',
    delivery_note_number: 'QWQ-DN-2026-0042',
    delivery_date: '2026-02-22',
    reference_quotation_id: 'quote-001',
    reference_quotation_number: 'QWQ-2026-0104',
    customer_name: 'Eng. Tariq Al-Ghamdi',
    customer_company: 'Rabigh Petrochemical Services Co.',
    customer_phone: '055 123 4567',
    delivery_address: 'Petro Rabigh Industrial Complex, Gate 4, Rabigh',
    project_name: 'Refinery Maintenance & Piping Safety Supplies',
    items: [
      {
        id: 'dn-item-1',
        s_no: 1,
        description: 'Heavy Duty Stainless Steel 316 Flange Gaskets (4 Inch ANSI 300#)',
        quantity: 50,
        unit: 'Pieces',
        remarks: 'Batch inspected & sealed packaging',
      },
      {
        id: 'dn-item-2',
        s_no: 2,
        description: 'Industrial Safety Harness Full Body with Shock Absorber (CE Certified)',
        quantity: 25,
        unit: 'Sets',
        remarks: 'With individual test inspection certificates',
      },
    ],
    prepared_by: 'Ahmed Noor (Store Officer)',
    delivered_by: 'Rashid Khan (Driver - Truck # 8821 RBA)',
    received_by: 'Eng. Tariq Al-Ghamdi',
    customer_signature: 'Verified & Signed',
    status: 'delivered',
    acknowledgment_text: 'Received the above listed materials/equipment in good condition, correct quantity, and satisfactory specifications.',
    additional_remarks: 'Gate pass verified at Security Gate 4. All cartons intact.',
    created_at: '2026-02-22T08:30:00Z',
    updated_at: '2026-02-22T13:45:00Z',
  },
];
