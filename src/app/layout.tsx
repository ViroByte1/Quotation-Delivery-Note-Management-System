import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ToastProvider } from '@/components/ui/ToastProvider';

export const dynamic = 'force-dynamic';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'QASD WA QEEMA TRADING EST. | Quotation & Delivery Note Management',
  description: 'Enterprise Quotation and Delivery Note management system for QASD WA QEEMA TRADING EST. (مؤسسة قصد وقيمة التجارية) - Rabigh City, Saudi Arabia.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-slate-50 text-slate-900 min-h-screen selection:bg-[#c5a059]/30`}
      >
        <AuthProvider>
          {children}
          <ToastProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
