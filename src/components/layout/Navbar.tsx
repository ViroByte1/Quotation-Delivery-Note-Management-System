'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/brand/Logo';
import { useAuth } from '@/lib/auth-context';
import {
  FileText,
  Truck,
  LayoutDashboard,
  Settings,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Eye,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Quotations', href: '/dashboard/quotations', icon: FileText },
    { label: 'Delivery Notes', href: '/dashboard/delivery-notes', icon: Truck },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    { label: 'Sample Reference', href: '/sample-quotation', icon: Eye },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <Logo size={42} />
              <div className="flex flex-col">
                <span className="font-extrabold text-[#0c2340] text-sm tracking-wide group-hover:text-[#c5a059] transition-colors">
                  QASD WA QEEMA
                </span>
                <span className="text-[11px] text-slate-500 font-medium hidden sm:inline" dir="rtl">
                  مؤسسة قصد وقيمة التجارية
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 ml-8">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-xs lg:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-[#0c2340] text-[#f5e197] shadow-xs'
                        : 'text-slate-600 hover:text-[#0c2340] hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Quick Actions & User Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/dashboard/quotations/new"
              className="hidden sm:inline-flex items-center gap-1.5 bg-[#0c2340] hover:bg-[#12335c] text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors shadow-xs border border-[#c5a059]/40"
            >
              <PlusCircle className="w-3.5 h-3.5 text-[#f5e197]" />
              New Quotation
            </Link>

            <Link
              href="/dashboard/delivery-notes/new"
              className="hidden lg:inline-flex items-center gap-1.5 bg-[#c5a059] hover:bg-[#b98b2e] text-[#0c2340] text-xs font-bold px-3 py-2 rounded-md transition-colors shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              New Delivery Note
            </Link>

            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden xl:flex flex-col text-right">
                  <span className="text-xs font-bold text-[#0c2340] leading-none">
                    {user.full_name || 'Abid Mughal'}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {user.role === 'admin' ? 'Managing Director' : 'Staff'}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  title="Sign out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold text-[#0c2340] hover:text-[#c5a059] px-3 py-2"
              >
                Sign In
              </Link>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-md hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg animate-in fade-in duration-200">
          <div className="flex flex-col gap-1 pb-3 mb-2 border-b border-slate-100">
            <Link
              href="/dashboard/quotations/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#0c2340] text-white text-xs font-semibold py-2.5 rounded-md"
            >
              <PlusCircle className="w-4 h-4 text-[#f5e197]" />
              Create Quotation
            </Link>
            <Link
              href="/dashboard/delivery-notes/new"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#c5a059] text-[#0c2340] text-xs font-bold py-2.5 rounded-md mt-1"
            >
              <PlusCircle className="w-4 h-4" />
              Create Delivery Note
            </Link>
          </div>

          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-semibold ${
                  isActive
                    ? 'bg-[#0c2340] text-[#f5e197]'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}

        </div>
      )}
    </header>
  );
}

