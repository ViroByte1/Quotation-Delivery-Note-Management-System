export type DocumentStatus = 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
export type DeliveryStatus = 'pending' | 'delivered' | 'partially_delivered' | 'cancelled';

export interface QuotationItem {
  id: string;
  quotation_id?: string;
  s_no: number;
  description: string;
  quantity: number;
  unit_price: number;
  total: number;
}

export interface Quotation {
  id: string;
  quotation_number: string;
  date: string;
  valid_until?: string;
  reference_number?: string;
  client_name: string;
  client_company: string;
  client_phone: string;
  client_email?: string;
  client_address: string;
  project_name: string;
  items: QuotationItem[];
  subtotal: number;
  vat_rate: number; // e.g. 15
  vat_amount: number;
  grand_total: number;
  terms_and_conditions: string[];
  notes?: string;
  status: DocumentStatus;
  authorized_person: string;
  authorized_designation: string;
  signature_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DeliveryNoteItem {
  id: string;
  delivery_note_id?: string;
  s_no: number;
  description: string;
  quantity: number;
  unit?: string; // e.g. Pcs, Sets, Boxes, Meters, Lots
  unit_price?: number;
  total?: number;
  remarks?: string;
}

export interface DeliveryNote {
  id: string;
  delivery_note_number: string;
  delivery_date: string;
  reference_quotation_id?: string;
  reference_quotation_number?: string;
  purchase_order?: string;
  loc_no_name?: string;
  delivered_to?: string;
  customer_name: string;
  customer_company: string;
  customer_phone: string;
  delivery_address: string;
  project_name: string;
  items: DeliveryNoteItem[];
  subtotal?: number;
  vat_rate?: number;
  vat_amount?: number;
  grand_total?: number;
  amount_in_words?: string;
  prepared_by: string;
  delivered_by: string;
  received_by?: string;
  customer_signature?: string;
  status: DeliveryStatus;
  acknowledgment_text: string;
  additional_remarks?: string;
  sales_person?: string;
  created_at: string;
  updated_at: string;
}

export interface CompanySettings {
  id: string;
  company_name_en: string;
  company_name_ar: string;
  cr_number: string;
  vat_number?: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  currency: string;
  vat_rate: number;
  tagline: string;
  default_payment_terms: string;
  default_validity_days: number;
  authorized_person_name: string;
  authorized_person_designation: string;
  logo_url?: string;
  signature_url?: string;
  stamp_url?: string;
  header_banner_text?: string;
  terms_conditions: string[];
}

export interface Client {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  address: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'staff';
  is_demo?: boolean;
}
