# SBT Jobs - Shama Al Bayan Trading Recruitment Portal

A clean, modern, fully-featured, and responsive Recruitment Job Portal designed specifically for **Shama Al Bayan Trading (SBT Services)** in Saudi Arabia. 

This repository contains two production-ready builds:
1. **Full-Stack React + Vite Build** (located at the root folder `/`), utilizing TypeScript, Tailwind CSS, motion-ready layout animations, and the official `@supabase/supabase-js` database bindings.
2. **Standard Vanilla HTML, CSS, & JS Static Build** (located inside the `/sbt-jobs` directory), perfect for immediate drag-and-drop deployment on completely free hosting providers like Netlify, Vercel, or GitHub Pages.

---

## Technical Features & Architectural Map

### 1. Robust Offline Sandbox Fallback
Both the React app and the Vanilla JS static build feature an automated, transparent database bridge:
- **Sandbox Mode (No configuration required)**: Pre-loaded with **15 professional Saudi Arabia vacancies** in safety (HSE Officers, Engineers, Managers), technical fields (QA/QC inspectors, Civil Site Engineers, Work Permit Receivers), and clerical/office positions. Candidates can apply and submit files, and administrators can log in (using `admin@sbt.com` / `admin123`) to create, update, or delete jobs immediately.
- **Supabase Cloud Mode**: Connecting your live Supabase database is as simple as adding your API credentials inside `/src/supabase.ts` (React) or `/js/supabase.js` (Vanilla HTML). Once the keys are detected, the app automatically transitions to live Cloud Persistence, uploading CV files to Supabase Storage and saving applicants securely to cloud-hosted PostgreSQL tables.

### 2. High-Contrast Corporate Blue Branding
- Custom corporate typography utilizing Google Fonts' **Inter** (sans-serif) paired with clean geometric spacings.
- Responsive bento grid views for desktop and mobile displays.
- Visual status indicators for job deadlines, salary displays in **SAR**, and candidate states.
- Dedicated, floating, interactive **SBT WhatsApp widget** mapped directly to `+966508202459` for immediate candidate routing.

---

## Quick Sourcing Directories Map (`/sbt-jobs`)

```
/sbt-jobs
├── index.html            # Public website homepage with search and categories card grids
├── jobs.html             # Advanced job search interface with salary and category filters
├── job-details.html      # Complete job descriptions page with requirements list & related roles
├── apply.html            # Candidate application form with drag-and-drop CV attachment input
├── employers.html        # Detailed services listing for corporate manpower bulk-sourcing
├── about.html            # Company executive overview, mission, vision, and core values
├── contact.html          # Contact form with email, WhatsApp hotline links, and maps
├── login.html            # Secure authorization screen for administrative managers
├── admin.html            # Rich administration dashboard with applicant screening controls
│
├── /css
│   ├── style.css         # Global corporate theme branding definitions and transitions
│   ├── admin.css         # Admin table structures, statistics grid, and overlay modal specs
│   └── responsive.css    # Responsive device breakpoint media queries
│
├── /js
│   ├── main.js           # Header scroll effects, mobile navigation drawers, homepage loaders
│   ├── jobs.js           # Dynamic listings search query, detail specifications injector
│   ├── apply.js          # Sourcing applications submissions validation and progress tracker
│   ├── auth.js           # Admin local cookie and Supabase session management handlers
│   └── supabase.js       # Core Supabase connection adapter with 15 preseeded vacancies
│
└── /docs
    ├── SUPABASE_SETUP.md # Database schemas, SQL query copy-pastes, and storage policies
    └── DEPLOYMENT_GUIDE.md # Immediate hosting guides for Netlify, Vercel, and GitHub Pages
```

---

## Local Sandbox Access
To preview or demonstrate the system immediately:
1. Open any of the HTML pages (e.g., `index.html`) in your browser, or spin up a local server.
2. Navigate to `login.html` and authenticate using these developer preview credentials:
   - **Email**: `admin@sbt.com`
   - **Password**: `admin123`
3. Enter the Admin Panel to test adding vacancies, editing active roles, screening test applications, or checking contact logs.

---

## Connecting Your Live Supabase Backend
For detailed instructions on configuring PostgreSQL tables, storage buckets for CV file uploads, and RLS policies, refer to:
👉 **[`/sbt-jobs/docs/SUPABASE_SETUP.md`](./docs/SUPABASE_SETUP.md)**

## Production Deployment
For a step-by-step guide to hosting your static folder for free on Netlify or GitHub Pages, refer to:
👉 **[`/sbt-jobs/docs/DEPLOYMENT_GUIDE.md`](./docs/DEPLOYMENT_GUIDE.md)**
