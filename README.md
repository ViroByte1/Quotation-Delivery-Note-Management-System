# QASD WA QEEMA Trading &ndash; Quotation & Delivery Note Management System
### مؤسسة قصد وقيمة التجارية &ndash; نظام إدارة عروض الأسعار وسندات التسليم

A production-ready, mobile-first commercial document management application designed and built for **QASD WA QEEMA TRADING EST.** based in Rabigh City, Kingdom of Saudi Arabia.

---

## 🌟 Key Capabilities

1. **Pixel-Perfect Reference Match**:
   - Recreates the exact layout of the client's supplied physical quotation:
     - Outer circular gold & navy emblem with intertwining stylized **QQ** monogram and star.
     - Separator bar, Arabic legal title (`مؤسسة قصد وقيمة التجارية`), English corporate title (`QASD WA QEEMA TRADING EST.`).
     - Distinct navy blue pill banner bar with CR (`7012340258`), Rabigh City, Phone (`059 946 8908`), and Email (`info@brightwaytrading.sa`).
     - Dark navy table header with gold grid cell borders.
     - Gold-bordered Totals section with Subtotal, VAT 15%, and Grand Total in Saudi Riyals (SAR).
     - Standard 3-point prefilled and editable commercial terms.
     - Authorized signature block for **Abid Mughal (Managing Director)**.
     - Golden Riyadh/Saudi skyline silhouette illustration with tagline: *"Building a Brighter Future Together"*.

2. **Price-Free Material Delivery Notes**:
   - Strictly hides commercial pricing from drivers, site workers, and third-party logistics.
   - Includes item description, quantity delivered, unit (Pieces, Boxes, Sets, Meters, Lots), and quality remarks.
   - Complete 4-box sign-off section: **Prepared By**, **Delivered By**, **Received By**, and **Customer Signature & Stamp Box**.
   - One-click generation directly from any approved Quotation.

3. **High-Resolution Vector PDF & Print Engine**:
   - Generates client-ready A4 portrait PDFs directly in the browser via `html2canvas` + `jsPDF`.
   - Native print stylesheet (`@media print`) that automatically strips navigation, buttons, and headers for physical printing.

4. **Zero-Friction Live Demo Mode**:
   - Out-of-the-box instant access without requiring sign-up or immediate database setup.
   - Populated with realistic Saudi industrial projects (Petro Rabigh refinery supplies, KAEC logistics warehousing, Yanbu marine fittings).
   - Allows prospective clients and partners to explore the complete workflow and download real PDFs immediately.

5. **Enterprise Database Architecture**:
   - PostgreSQL schema with Row Level Security (RLS) for Supabase free-tier deployment.
   - Sequential document number generator routines (`QWQ-YYYY-####` and `QWQ-DN-YYYY-####`).

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: Sonner
- **PDF Generation**: `jspdf` + `html2canvas`
- **Database & Auth**: Supabase PostgreSQL with Row Level Security (RLS)
- **Deployment**: Vercel

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd qasd-wa-qeema-trading
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
*(Note: If left blank or unconfigured, the application runs automatically in interactive Demo Mode with persisted local storage!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Create a free account at [Supabase](https://supabase.com).
2. Create a new project named `qasd-wa-qeema`.
3. Go to the **SQL Editor** tab in your Supabase dashboard.
4. Copy the entire contents of `supabase/schema.sql` and run it.
5. This automatically creates:
   - `profiles`
   - `company_settings`
   - `clients`
   - `quotations`
   - `quotation_items`
   - `delivery_notes`
   - `delivery_note_items`
   - Document number sequences & functions
   - Row Level Security (RLS) policies

### Creating the Initial Administrator Account
1. In your Supabase Dashboard, go to **Authentication -> Users**.
2. Click **Add User -> Create User**.
3. Enter:
   - Email: `admin@brightwaytrading.sa` (or your preferred admin email)
   - Password: A secure password (e.g., `Admin@123456`)
   - Auto Confirm User: **Checked**
4. The administrator can now log in at `/login` and manage all business documents.

---

## ☁️ Vercel Deployment Instructions

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com) and click **Add New -> Project**.
3. Import your repository.
4. In the **Environment Variables** section, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (optional, for backend admin scripts)
5. Click **Deploy**.
6. Your application will be live at `https://your-project.vercel.app`.

---

## 🏢 Company Profile Reference

- **Company Name (EN)**: QASD WA QEEMA TRADING EST.
- **Company Name (AR)**: مؤسسة قصد وقيمة التجارية
- **Commercial Registration (CR)**: 7012340258
- **Location**: Rabigh City, Kingdom of Saudi Arabia
- **Phone**: 059 946 8908
- **Email**: info@brightwaytrading.sa
- **Authorized Person**: Abid Mughal
- **Designation**: Managing Director
- **Tagline**: Building a Brighter Future Together
