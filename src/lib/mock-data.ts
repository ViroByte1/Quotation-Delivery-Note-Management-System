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
    company: 'Modern Industrial Services Ltd.',
    phone: '050 987 6543',
    email: 'm.mansoor@modernindustrial.sa',
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

// Single Initial Delivery Note (Exact match to client's reference delivery document)
export const INITIAL_DELIVERY_NOTES: DeliveryNote[] = [
  {
    id: 'dn-001',
    delivery_note_number: 'QWQ-DN-2026-0042',
    delivery_date: '2026-11-06',
    reference_quotation_id: 'quote-001',
    reference_quotation_number: 'QWQ-2026-0104',
    purchase_order: 'PO-2026-881',
    loc_no_name: 'LOC-233 / Aziziyah District',
    delivered_to: 'Modern Industrial Services Ltd.',
    customer_name: 'Mohammed Mansoor',
    customer_company: 'Modern Industrial Services Ltd.',
    customer_phone: '050 987 6543',
    delivery_address: 'Ishara Baladeah, Aziziyah, Jeddah 23334',
    project_name: 'Industrial Valve & Pipeline Fitting',
    items: [
      {
        id: 'dn-item-1',
        s_no: 1,
        description: 'Industrial Flange Valve Assembly (Model 1)',
        quantity: 20,
        unit_price: 1045.0,
        total: 20900.0,
        unit: 'Pieces',
        remarks: 'Delivered in standard export packaging',
      },
    ],
    subtotal: 20900.0,
    vat_rate: 15,
    vat_amount: 3135.0,
    grand_total: 24035.0,
    amount_in_words: 'Twenty Four Thousand Thirty Five Saudi Riyals Only',
    sales_person: 'Abid Mughal',
    prepared_by: 'Ahmed Noor (Store Officer)',
    delivered_by: 'Rashid Khan (Driver)',
    received_by: 'Mohammed Mansoor',
    customer_signature: 'Verified & Signed',
    status: 'delivered',
    acknowledgment_text:
      'Received the above listed materials/equipment in good condition, correct quantity, and satisfactory specifications.',
    additional_remarks: 'Gate pass verified. All units inspected.',
    created_at: '2026-11-06T08:30:00Z',
    updated_at: '2026-11-06T13:45:00Z',
  },
];
