'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataService } from '@/lib/data-service';
import { CompanySettings } from '@/types';
import { DocumentHeader } from '@/components/brand/DocumentHeader';
import {
  Settings,
  Save,
  RotateCcw,
  Building,
  Phone,
  ShieldCheck,
  Upload,
  Sparkles,
  FileCheck2,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CompanySettingsPage() {
  const [settings, setSettings] = useState<CompanySettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      setLoading(true);
      const data = await DataService.getCompanySettings();
      setSettings(data);
      setLoading(false);
    }
    fetchSettings();
  }, []);

  const handleChange = (field: keyof CompanySettings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('logo_url', reader.result as string);
        toast.success('Custom logo loaded! Click Save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        handleChange('signature_url', reader.result as string);
        toast.success('Signature image loaded! Click Save to apply.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setSaving(true);
    try {
      await DataService.updateCompanySettings(settings);
      toast.success('Company settings saved successfully! All documents updated.');
    } catch {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all company settings and documents to original defaults?')) {
      DataService.resetDemoData();
      toast.success('Reset to original factory demo data');
      window.location.reload();
    }
  };

  if (loading || !settings) {
    return (
      <DashboardLayout>
        <div className="py-20 text-center text-slate-400">Loading settings...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#0c2340] tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-[#c5a059]" />
              Company Settings &amp; Branding
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Configure company profile, CR details, VAT rates, signatures, and document headers.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="bg-white hover:bg-slate-50 text-slate-600 font-semibold px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-5 py-2 rounded-xl text-xs sm:text-sm shadow-sm flex items-center gap-2 border border-[#c5a059]"
            >
              <Save className="w-4 h-4 text-[#f5e197]" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        {/* Live Preview Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#c5a059]" /> Live Document Header Preview
            </span>
            <span className="text-[11px] text-slate-400">Updates dynamically</span>
          </div>

          <div className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl">
            <DocumentHeader settings={settings} />
          </div>
        </div>

        {/* Main Settings Form */}
        <form onSubmit={handleSave} className="space-y-8">
          {/* 1. Identity & Legal */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building className="w-4 h-4 text-[#c5a059]" /> Company Legal Identity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name (English)
                </label>
                <input
                  type="text"
                  required
                  value={settings.company_name_en}
                  onChange={(e) => handleChange('company_name_en', e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Company Name (Arabic)
                </label>
                <input
                  type="text"
                  required
                  dir="rtl"
                  value={settings.company_name_ar}
                  onChange={(e) => handleChange('company_name_ar', e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
                  style={{ fontFamily: 'var(--font-cairo), sans-serif' }}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Commercial Registration (CR Number)
                </label>
                <input
                  type="text"
                  required
                  value={settings.cr_number}
                  onChange={(e) => handleChange('cr_number', e.target.value)}
                  className="w-full text-sm font-mono font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Physical Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* 2. Communication & Contact */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Phone className="w-4 h-4 text-[#c5a059]" /> Contact Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Phone
                </label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* 3. Financial & VAT Defaults */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-[#c5a059]" /> Financial &amp; Commercial Terms
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Currency
                </label>
                <input
                  type="text"
                  value={settings.currency}
                  onChange={(e) => handleChange('currency', e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default VAT Rate (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={settings.vat_rate}
                  onChange={(e) => handleChange('vat_rate', Number(e.target.value) || 0)}
                  className="w-full text-sm font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Validity (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="365"
                  value={settings.default_validity_days}
                  onChange={(e) => handleChange('default_validity_days', Number(e.target.value) || 30)}
                  className="w-full text-sm font-semibold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Default Payment Terms
                </label>
                <input
                  type="text"
                  value={settings.default_payment_terms}
                  onChange={(e) => handleChange('default_payment_terms', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* 4. Authorized Signatory & Brand Assets */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-sm font-extrabold text-[#0c2340] uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileCheck2 className="w-4 h-4 text-[#c5a059]" /> Authorized Signatory &amp; Brand Assets
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Person Name
                </label>
                <input
                  type="text"
                  value={settings.authorized_person_name}
                  onChange={(e) => handleChange('authorized_person_name', e.target.value)}
                  className="w-full text-sm font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-[#0c2340]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Authorized Designation
                </label>
                <input
                  type="text"
                  value={settings.authorized_person_designation}
                  onChange={(e) => handleChange('authorized_person_designation', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-700"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Footer Tagline
                </label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  className="w-full text-sm bg-slate-50 border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>

              {/* Logo Upload Option */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Custom Logo (Optional)
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 text-xs font-medium text-slate-700">
                  <Upload className="w-4 h-4 text-[#c5a059]" />
                  <span>Choose logo file (PNG / JPG / SVG)...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {settings.logo_url && (
                  <button
                    type="button"
                    onClick={() => handleChange('logo_url', '')}
                    className="text-[11px] text-rose-600 hover:underline mt-1"
                  >
                    Reset to default client emblem
                  </button>
                )}
              </div>

              {/* Signature Upload */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Upload Digital Signature / Stamp (Optional)
                </label>
                <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-100 text-xs font-medium text-slate-700">
                  <Upload className="w-4 h-4 text-[#c5a059]" />
                  <span>Choose signature image (transparent PNG recommended)...</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleSignatureUpload}
                    className="hidden"
                  />
                </label>
                {settings.signature_url && (
                  <div className="mt-2 flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={settings.signature_url}
                      alt="Signature preview"
                      className="h-10 border border-slate-200 rounded p-1 bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange('signature_url', '')}
                      className="text-[11px] text-rose-600 hover:underline"
                    >
                      Remove signature
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="bg-[#0c2340] hover:bg-[#12335c] text-white font-bold px-8 py-3 rounded-xl text-sm shadow-md flex items-center gap-2 border border-[#c5a059]"
            >
              <Save className="w-4 h-4 text-[#f5e197]" />
              {saving ? 'Saving Changes...' : 'Save All Company Settings'}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
