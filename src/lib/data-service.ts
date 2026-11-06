import { Quotation, DeliveryNote, CompanySettings, Client } from '@/types';
import { DEFAULT_COMPANY_SETTINGS } from './constants';
import { INITIAL_QUOTATIONS, INITIAL_DELIVERY_NOTES, INITIAL_CLIENTS } from './mock-data';
import { isSupabaseConfigured, supabase } from './supabase/client';

// Local storage keys for persistent demo/fallback mode
const STORAGE_KEYS = {
  SETTINGS: 'qwq_company_settings',
  QUOTATIONS: 'qwq_quotations',
  DELIVERY_NOTES: 'qwq_delivery_notes',
  CLIENTS: 'qwq_clients',
  DEMO_MODE: 'qwq_is_demo_mode',
};

// In-memory fallback caches
let memorySettings: CompanySettings = { ...DEFAULT_COMPANY_SETTINGS };
let memoryQuotations: Quotation[] = [...INITIAL_QUOTATIONS];
let memoryDeliveryNotes: DeliveryNote[] = [...INITIAL_DELIVERY_NOTES];
let memoryClients: Client[] = [...INITIAL_CLIENTS];

function getLocalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save to localStorage:', e);
  }
}

export const DataService = {
  isConfigured: () => isSupabaseConfigured(),

  // ================= COMPANY SETTINGS =================
  async getCompanySettings(): Promise<CompanySettings> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('company_settings')
          .select('*')
          .limit(1)
          .single();
        if (!error && data) {
          return {
            id: data.id,
            company_name_en: data.company_name_en,
            company_name_ar: data.company_name_ar,
            cr_number: data.cr_number,
            location: data.location,
            address: data.address,
            phone: data.phone,
            email: data.email,
            currency: data.currency,
            vat_rate: Number(data.vat_rate) || 15,
            tagline: data.tagline,
            default_payment_terms: data.default_payment_terms,
            default_validity_days: data.default_validity_days,
            authorized_person_name: data.authorized_person_name,
            authorized_person_designation: data.authorized_person_designation,
            logo_url: data.logo_url || '',
            signature_url: data.signature_url || '',
            header_banner_text: data.header_banner_text,
            terms_conditions: data.terms_conditions || DEFAULT_COMPANY_SETTINGS.terms_conditions,
          };
        }
      } catch (err) {
        console.warn('Supabase fetch failed for settings, falling back:', err);
      }
    }
    return getLocalData(STORAGE_KEYS.SETTINGS, memorySettings);
  },

  async updateCompanySettings(settings: Partial<CompanySettings>): Promise<CompanySettings> {
    const current = await this.getCompanySettings();
    const updated: CompanySettings = { ...current, ...settings };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('company_settings')
          .upsert({
            id: updated.id,
            company_name_en: updated.company_name_en,
            company_name_ar: updated.company_name_ar,
            cr_number: updated.cr_number,
            location: updated.location,
            address: updated.address,
            phone: updated.phone,
            email: updated.email,
            currency: updated.currency,
            vat_rate: updated.vat_rate,
            tagline: updated.tagline,
            default_payment_terms: updated.default_payment_terms,
            default_validity_days: updated.default_validity_days,
            authorized_person_name: updated.authorized_person_name,
            authorized_person_designation: updated.authorized_person_designation,
            logo_url: updated.logo_url,
            signature_url: updated.signature_url,
            header_banner_text: updated.header_banner_text,
            terms_conditions: updated.terms_conditions,
            updated_at: new Date().toISOString(),
          });
      } catch (e) {
        console.error('Supabase update failed:', e);
      }
    }

    memorySettings = updated;
    setLocalData(STORAGE_KEYS.SETTINGS, updated);
    return updated;
  },

  // ================= QUOTATIONS =================
  async getQuotations(): Promise<Quotation[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('quotations')
          .select('*, items:quotation_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((q: any) => ({
            id: q.id,
            quotation_number: q.quotation_number,
            date: q.date,
            valid_until: q.valid_until,
            reference_number: q.reference_number,
            client_name: q.client_name,
            client_company: q.client_company,
            client_phone: q.client_phone,
            client_email: q.client_email,
            client_address: q.client_address,
            project_name: q.project_name,
            subtotal: Number(q.subtotal),
            vat_rate: Number(q.vat_rate),
            vat_amount: Number(q.vat_amount),
            grand_total: Number(q.grand_total),
            terms_and_conditions: q.terms_and_conditions || [],
            notes: q.notes,
            status: q.status,
            authorized_person: q.authorized_person,
            authorized_designation: q.authorized_designation,
            signature_url: q.signature_url,
            created_at: q.created_at,
            updated_at: q.updated_at,
            items: (q.items || []).map((it: any) => ({
              id: it.id,
              quotation_id: it.quotation_id,
              s_no: it.s_no,
              description: it.description,
              quantity: Number(it.quantity),
              unit_price: Number(it.unit_price),
              total: Number(it.total),
            })),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for quotations:', err);
      }
    }
    const stored = getLocalData<Quotation[]>(STORAGE_KEYS.QUOTATIONS, memoryQuotations);
    memoryQuotations = stored;
    return stored;
  },

  async getQuotationById(id: string): Promise<Quotation | null> {
    const list = await this.getQuotations();
    return list.find((q) => q.id === id) || null;
  },

  async createQuotation(data: Omit<Quotation, 'id' | 'created_at' | 'updated_at'>): Promise<Quotation> {
    const id = `quote-${Date.now()}`;
    const now = new Date().toISOString();
    const newQuotation: Quotation = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      items: data.items.map((it, idx) => ({
        ...it,
        id: it.id || `item-${Date.now()}-${idx}`,
        s_no: idx + 1,
        total: Number(it.quantity) * Number(it.unit_price),
      })),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        const { error: quoteErr } = await supabase.from('quotations').insert({
          id: newQuotation.id,
          quotation_number: newQuotation.quotation_number,
          date: newQuotation.date,
          valid_until: newQuotation.valid_until,
          reference_number: newQuotation.reference_number,
          client_name: newQuotation.client_name,
          client_company: newQuotation.client_company,
          client_phone: newQuotation.client_phone,
          client_email: newQuotation.client_email,
          client_address: newQuotation.client_address,
          project_name: newQuotation.project_name,
          subtotal: newQuotation.subtotal,
          vat_rate: newQuotation.vat_rate,
          vat_amount: newQuotation.vat_amount,
          grand_total: newQuotation.grand_total,
          terms_and_conditions: newQuotation.terms_and_conditions,
          notes: newQuotation.notes,
          status: newQuotation.status,
          authorized_person: newQuotation.authorized_person,
          authorized_designation: newQuotation.authorized_designation,
          signature_url: newQuotation.signature_url,
        });

        if (!quoteErr && newQuotation.items.length > 0) {
          await supabase.from('quotation_items').insert(
            newQuotation.items.map((it) => ({
              id: it.id,
              quotation_id: newQuotation.id,
              s_no: it.s_no,
              description: it.description,
              quantity: it.quantity,
              unit_price: it.unit_price,
              total: it.total,
            }))
          );
        }
      } catch (e) {
        console.error('Supabase quotation insert failed:', e);
      }
    }

    const currentList = await this.getQuotations();
    const updatedList = [newQuotation, ...currentList];
    memoryQuotations = updatedList;
    setLocalData(STORAGE_KEYS.QUOTATIONS, updatedList);
    return newQuotation;
  },

  async updateQuotation(id: string, updates: Partial<Quotation>): Promise<Quotation | null> {
    const list = await this.getQuotations();
    const index = list.findIndex((q) => q.id === id);
    if (index === -1) return null;

    const updated: Quotation = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('quotations')
          .update({
            quotation_number: updated.quotation_number,
            date: updated.date,
            valid_until: updated.valid_until,
            reference_number: updated.reference_number,
            client_name: updated.client_name,
            client_company: updated.client_company,
            client_phone: updated.client_phone,
            client_email: updated.client_email,
            client_address: updated.client_address,
            project_name: updated.project_name,
            subtotal: updated.subtotal,
            vat_rate: updated.vat_rate,
            vat_amount: updated.vat_amount,
            grand_total: updated.grand_total,
            terms_and_conditions: updated.terms_and_conditions,
            notes: updated.notes,
            status: updated.status,
            authorized_person: updated.authorized_person,
            authorized_designation: updated.authorized_designation,
            signature_url: updated.signature_url,
            updated_at: updated.updated_at,
          })
          .eq('id', id);

        if (updates.items) {
          await supabase.from('quotation_items').delete().eq('quotation_id', id);
          await supabase.from('quotation_items').insert(
            updates.items.map((it, idx) => ({
              id: it.id || `item-${Date.now()}-${idx}`,
              quotation_id: id,
              s_no: idx + 1,
              description: it.description,
              quantity: it.quantity,
              unit_price: it.unit_price,
              total: it.total,
            }))
          );
        }
      } catch (e) {
        console.error('Supabase update failed:', e);
      }
    }

    list[index] = updated;
    memoryQuotations = list;
    setLocalData(STORAGE_KEYS.QUOTATIONS, list);
    return updated;
  },

  async deleteQuotation(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('quotations').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete error:', e);
      }
    }

    const list = await this.getQuotations();
    const filtered = list.filter((q) => q.id !== id);
    memoryQuotations = filtered;
    setLocalData(STORAGE_KEYS.QUOTATIONS, filtered);
    return true;
  },

  // ================= DELIVERY NOTES =================
  async getDeliveryNotes(): Promise<DeliveryNote[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('delivery_notes')
          .select('*, items:delivery_note_items(*)')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          return data.map((d: any) => ({
            id: d.id,
            delivery_note_number: d.delivery_note_number,
            delivery_date: d.delivery_date,
            reference_quotation_id: d.reference_quotation_id,
            reference_quotation_number: d.reference_quotation_number,
            customer_name: d.customer_name,
            customer_company: d.customer_company,
            customer_phone: d.customer_phone,
            delivery_address: d.delivery_address,
            project_name: d.project_name,
            prepared_by: d.prepared_by,
            delivered_by: d.delivered_by,
            received_by: d.received_by,
            customer_signature: d.customer_signature,
            status: d.status,
            acknowledgment_text: d.acknowledgment_text,
            additional_remarks: d.additional_remarks,
            created_at: d.created_at,
            updated_at: d.updated_at,
            items: (d.items || []).map((it: any) => ({
              id: it.id,
              delivery_note_id: it.delivery_note_id,
              s_no: it.s_no,
              description: it.description,
              quantity: Number(it.quantity),
              unit: it.unit,
              remarks: it.remarks,
            })),
          }));
        }
      } catch (err) {
        console.warn('Supabase fetch failed for delivery notes:', err);
      }
    }
    const stored = getLocalData<DeliveryNote[]>(STORAGE_KEYS.DELIVERY_NOTES, memoryDeliveryNotes);
    memoryDeliveryNotes = stored;
    return stored;
  },

  async getDeliveryNoteById(id: string): Promise<DeliveryNote | null> {
    const list = await this.getDeliveryNotes();
    return list.find((d) => d.id === id) || null;
  },

  async createDeliveryNote(data: Omit<DeliveryNote, 'id' | 'created_at' | 'updated_at'>): Promise<DeliveryNote> {
    const id = `dn-${Date.now()}`;
    const now = new Date().toISOString();
    const newDN: DeliveryNote = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      items: data.items.map((it, idx) => ({
        ...it,
        id: it.id || `dn-item-${Date.now()}-${idx}`,
        s_no: idx + 1,
      })),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('delivery_notes').insert({
          id: newDN.id,
          delivery_note_number: newDN.delivery_note_number,
          delivery_date: newDN.delivery_date,
          reference_quotation_id: newDN.reference_quotation_id,
          reference_quotation_number: newDN.reference_quotation_number,
          customer_name: newDN.customer_name,
          customer_company: newDN.customer_company,
          customer_phone: newDN.customer_phone,
          delivery_address: newDN.delivery_address,
          project_name: newDN.project_name,
          prepared_by: newDN.prepared_by,
          delivered_by: newDN.delivered_by,
          received_by: newDN.received_by,
          customer_signature: newDN.customer_signature,
          status: newDN.status,
          acknowledgment_text: newDN.acknowledgment_text,
          additional_remarks: newDN.additional_remarks,
        });

        if (newDN.items.length > 0) {
          await supabase.from('delivery_note_items').insert(
            newDN.items.map((it) => ({
              id: it.id,
              delivery_note_id: newDN.id,
              s_no: it.s_no,
              description: it.description,
              quantity: it.quantity,
              unit: it.unit,
              remarks: it.remarks,
            }))
          );
        }
      } catch (e) {
        console.error('Supabase DN insert error:', e);
      }
    }

    const currentList = await this.getDeliveryNotes();
    const updatedList = [newDN, ...currentList];
    memoryDeliveryNotes = updatedList;
    setLocalData(STORAGE_KEYS.DELIVERY_NOTES, updatedList);
    return newDN;
  },

  async updateDeliveryNote(id: string, updates: Partial<DeliveryNote>): Promise<DeliveryNote | null> {
    const list = await this.getDeliveryNotes();
    const index = list.findIndex((d) => d.id === id);
    if (index === -1) return null;

    const updated: DeliveryNote = {
      ...list[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase
          .from('delivery_notes')
          .update({
            delivery_note_number: updated.delivery_note_number,
            delivery_date: updated.delivery_date,
            reference_quotation_id: updated.reference_quotation_id,
            reference_quotation_number: updated.reference_quotation_number,
            customer_name: updated.customer_name,
            customer_company: updated.customer_company,
            customer_phone: updated.customer_phone,
            delivery_address: updated.delivery_address,
            project_name: updated.project_name,
            prepared_by: updated.prepared_by,
            delivered_by: updated.delivered_by,
            received_by: updated.received_by,
            customer_signature: updated.customer_signature,
            status: updated.status,
            acknowledgment_text: updated.acknowledgment_text,
            additional_remarks: updated.additional_remarks,
            updated_at: updated.updated_at,
          })
          .eq('id', id);

        if (updates.items) {
          await supabase.from('delivery_note_items').delete().eq('delivery_note_id', id);
          await supabase.from('delivery_note_items').insert(
            updates.items.map((it, idx) => ({
              id: it.id || `dn-item-${Date.now()}-${idx}`,
              delivery_note_id: id,
              s_no: idx + 1,
              description: it.description,
              quantity: it.quantity,
              unit: it.unit,
              remarks: it.remarks,
            }))
          );
        }
      } catch (e) {
        console.error('Supabase update failed:', e);
      }
    }

    list[index] = updated;
    memoryDeliveryNotes = list;
    setLocalData(STORAGE_KEYS.DELIVERY_NOTES, list);
    return updated;
  },

  async deleteDeliveryNote(id: string): Promise<boolean> {
    if (isSupabaseConfigured() && supabase) {
      try {
        await supabase.from('delivery_notes').delete().eq('id', id);
      } catch (e) {
        console.error('Supabase DN delete error:', e);
      }
    }

    const list = await this.getDeliveryNotes();
    const filtered = list.filter((d) => d.id !== id);
    memoryDeliveryNotes = filtered;
    setLocalData(STORAGE_KEYS.DELIVERY_NOTES, filtered);
    return true;
  },

  // ================= CLIENTS =================
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase.from('clients').select('*').order('name');
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Supabase clients fetch error:', e);
      }
    }
    return getLocalData(STORAGE_KEYS.CLIENTS, memoryClients);
  },

  // Document Number Generators
  async getNextQuotationNumber(): Promise<string> {
    const list = await this.getQuotations();
    const year = new Date().getFullYear();
    const count = list.length + 104; // starts from 104
    return `QWQ-${year}-${String(count).padStart(4, '0')}`;
  },

  async getNextDeliveryNoteNumber(): Promise<string> {
    const list = await this.getDeliveryNotes();
    const year = new Date().getFullYear();
    const count = list.length + 44;
    return `QWQ-DN-${year}-${String(count).padStart(4, '0')}`;
  },

  // Reset to original demo data
  resetDemoData(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEYS.QUOTATIONS);
      localStorage.removeItem(STORAGE_KEYS.DELIVERY_NOTES);
      localStorage.removeItem(STORAGE_KEYS.SETTINGS);
      localStorage.removeItem(STORAGE_KEYS.CLIENTS);
      memorySettings = { ...DEFAULT_COMPANY_SETTINGS };
      memoryQuotations = [...INITIAL_QUOTATIONS];
      memoryDeliveryNotes = [...INITIAL_DELIVERY_NOTES];
      memoryClients = [...INITIAL_CLIENTS];
    }
  },
};

