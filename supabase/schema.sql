-- ==============================================================================
-- QASD WA QEEMA TRADING EST. (مؤسسة قصد وقيمة التجارية)
-- Quotation & Delivery Note Management System Database Schema
-- Supabase PostgreSQL with Row Level Security (RLS) & Sequential Document Generators
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles Table (linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'staff', 'viewer')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Company Settings Table
CREATE TABLE IF NOT EXISTS company_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name_en TEXT NOT NULL DEFAULT 'QASD WA QEEMA TRADING EST.',
  company_name_ar TEXT NOT NULL DEFAULT 'مؤسسة قصد وقيمة التجارية',
  cr_number TEXT NOT NULL DEFAULT '7012340258',
  location TEXT NOT NULL DEFAULT 'Rabigh City, Kingdom of Saudi Arabia',
  address TEXT NOT NULL DEFAULT 'King Abdulaziz Road, Rabigh City, Makkah Region, KSA',
  phone TEXT NOT NULL DEFAULT '059 946 8908',
  email TEXT NOT NULL DEFAULT 'info@brightwaytrading.sa',
  currency TEXT NOT NULL DEFAULT 'SAR',
  vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  tagline TEXT NOT NULL DEFAULT 'Building a Brighter Future Together',
  default_payment_terms TEXT NOT NULL DEFAULT '50% advance, 50% upon completion of work.',
  default_validity_days INT NOT NULL DEFAULT 30,
  authorized_person_name TEXT NOT NULL DEFAULT 'Abid Mughal',
  authorized_person_designation TEXT NOT NULL DEFAULT 'Managing Director',
  logo_url TEXT,
  signature_url TEXT,
  header_banner_text TEXT NOT NULL DEFAULT 'CR No. 7012340258 | Rabigh City, Kingdom of Saudi Arabia | Phone: 059 946 8908 | Email: info@brightwaytrading.sa',
  terms_conditions JSONB NOT NULL DEFAULT '[
    "Payment Terms: 50% advance, 50% upon completion of work.",
    "Quotation is valid for 30 days from the date of issuance.",
    "All prices are quoted in Saudi Riyals and inclusive of standard services unless otherwise stated."
  ]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Clients Directory
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Quotations Table
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_number TEXT NOT NULL UNIQUE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  valid_until DATE,
  reference_number TEXT,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  client_name TEXT NOT NULL,
  client_company TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  client_address TEXT NOT NULL,
  project_name TEXT NOT NULL,
  subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  vat_rate NUMERIC(5, 2) NOT NULL DEFAULT 15.00,
  vat_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  grand_total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  terms_and_conditions JSONB NOT NULL DEFAULT '[]'::jsonb,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'rejected', 'expired')),
  authorized_person TEXT NOT NULL DEFAULT 'Abid Mughal',
  authorized_designation TEXT NOT NULL DEFAULT 'Managing Director',
  signature_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Quotation Items Table
CREATE TABLE IF NOT EXISTS quotation_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
  s_no INT NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  total NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Delivery Notes Table
CREATE TABLE IF NOT EXISTS delivery_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_note_number TEXT NOT NULL UNIQUE,
  delivery_date DATE NOT NULL DEFAULT CURRENT_DATE,
  reference_quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
  reference_quotation_number TEXT,
  customer_name TEXT NOT NULL,
  customer_company TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  project_name TEXT NOT NULL,
  prepared_by TEXT NOT NULL DEFAULT 'Store In-Charge',
  delivered_by TEXT NOT NULL DEFAULT 'Delivery Driver',
  received_by TEXT,
  customer_signature TEXT,
  status TEXT NOT NULL DEFAULT 'delivered' CHECK (status IN ('pending', 'delivered', 'partially_delivered', 'cancelled')),
  acknowledgment_text TEXT NOT NULL DEFAULT 'Received the above listed materials/equipment in good condition, correct quantity, and satisfactory specifications.',
  additional_remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Delivery Note Items Table
CREATE TABLE IF NOT EXISTS delivery_note_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  delivery_note_id UUID NOT NULL REFERENCES delivery_notes(id) ON DELETE CASCADE,
  s_no INT NOT NULL,
  description TEXT NOT NULL,
  quantity NUMERIC(10, 2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'Pieces',
  remarks TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_quotations_number ON quotations(quotation_number);
CREATE INDEX IF NOT EXISTS idx_quotations_date ON quotations(date DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_quotation_id ON quotation_items(quotation_id);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_number ON delivery_notes(delivery_note_number);
CREATE INDEX IF NOT EXISTS idx_delivery_notes_date ON delivery_notes(delivery_date DESC);
CREATE INDEX IF NOT EXISTS idx_delivery_note_items_dn_id ON delivery_note_items(delivery_note_id);

-- ==============================================================================
-- DOCUMENT NUMBER SEQUENCERS
-- ==============================================================================
CREATE SEQUENCE IF NOT EXISTS quotation_number_seq START WITH 100 INCREMENT BY 1;
CREATE SEQUENCE IF NOT EXISTS delivery_note_number_seq START WITH 50 INCREMENT BY 1;

CREATE OR REPLACE FUNCTION get_next_quotation_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'QWQ-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('quotation_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_next_delivery_note_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'QWQ-DN-' || TO_CHAR(CURRENT_DATE, 'YYYY') || '-' || LPAD(nextval('delivery_note_number_seq')::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_note_items ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full read/write access to business documents
CREATE POLICY "Authenticated users can manage profiles" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage company_settings" ON company_settings FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage clients" ON clients FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage quotations" ON quotations FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage quotation_items" ON quotation_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage delivery_notes" ON delivery_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can manage delivery_note_items" ON delivery_note_items FOR ALL TO authenticated USING (true);

-- Allow public read access to company_settings for branded document view and read-only demo mode
CREATE POLICY "Public read for company settings" ON company_settings FOR SELECT TO anon USING (true);
CREATE POLICY "Public read for demo quotations" ON quotations FOR SELECT TO anon USING (true);
CREATE POLICY "Public read for demo quotation_items" ON quotation_items FOR SELECT TO anon USING (true);
CREATE POLICY "Public read for demo delivery_notes" ON delivery_notes FOR SELECT TO anon USING (true);
CREATE POLICY "Public read for demo delivery_note_items" ON delivery_note_items FOR SELECT TO anon USING (true);

-- ==============================================================================
-- SEED INITIAL DATA
-- ==============================================================================
INSERT INTO company_settings (
  company_name_en, company_name_ar, cr_number, location, address, phone, email,
  currency, vat_rate, tagline, authorized_person_name, authorized_person_designation
) VALUES (
  'QASD WA QEEMA TRADING EST.',
  'مؤسسة قصد وقيمة التجارية',
  '7012340258',
  'Rabigh City, Kingdom of Saudi Arabia',
  'King Abdulaziz Road, Rabigh City, Makkah Region, KSA',
  '059 946 8908',
  'info@brightwaytrading.sa',
  'SAR',
  15.00,
  'Building a Brighter Future Together',
  'Abid Mughal',
  'Managing Director'
) ON CONFLICT DO NOTHING;
