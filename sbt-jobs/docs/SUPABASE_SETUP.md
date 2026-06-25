# Supabase Setup Guide for SBT Jobs

This guide explains how to set up your free Supabase database, authentication, and file storage for **SBT Jobs (Shama Al Bayan Trading)**.

---

## Step 1: Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and log in or sign up.
2. Click **New Project** and select your organization.
3. Fill in the project details:
   - **Name**: `SBT Jobs`
   - **Database Password**: *Choose a secure password and remember it!*
   - **Region**: Select a region close to Saudi Arabia (e.g., `me-central-1` or `eu-west-3`).
4. Click **Create new project** and wait for it to provision (takes around 1–2 minutes).

---

## Step 2: Create Database Tables (SQL Schema)
Go to the **SQL Editor** tab in the left-hand navigation in your Supabase dashboard, click **New Query**, paste the following SQL, and click **Run**:

```sql
-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  salary TEXT NOT NULL,
  category TEXT NOT NULL,
  job_type TEXT NOT NULL CHECK (job_type IN ('Full-time', 'Part-time', 'Contract', 'Remote')),
  experience TEXT NOT NULL,
  short_description TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT,
  benefits TEXT,
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  posted_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  deadline DATE NOT NULL
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  nationality TEXT NOT NULL,
  current_city TEXT NOT NULL,
  job_id TEXT NOT NULL,
  position_applied TEXT NOT NULL,
  experience_years NUMERIC NOT NULL,
  expected_salary NUMERIC NOT NULL,
  message TEXT,
  cv_url TEXT,
  status TEXT DEFAULT 'New' CHECK (status IN ('New', 'Shortlisted', 'Rejected', 'Hired')),
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Create contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Turn on Row-Level Security (RLS) for privacy
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- CREATE RLS POLICIES FOR PUBLIC USER ACCESS
-- 1. Jobs: Public read access
CREATE POLICY "Allow public read jobs" ON public.jobs 
  FOR SELECT USING (true);

-- 2. Applications: Public insert only (no public reading of other applications!)
CREATE POLICY "Allow public insert applications" ON public.applications 
  FOR INSERT WITH CHECK (true);

-- 3. Contact Messages: Public insert only
CREATE POLICY "Allow public insert contact messages" ON public.contact_messages 
  FOR INSERT WITH CHECK (true);

-- CREATE RLS POLICIES FOR AUTHENTICATED ADMIN ACCESS
-- 1. Jobs: Full write access for admins
CREATE POLICY "Allow admin manage jobs" ON public.jobs 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 2. Applications: Full access for admins
CREATE POLICY "Allow admin manage applications" ON public.applications 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 3. Contact Messages: Full access for admins
CREATE POLICY "Allow admin view contact messages" ON public.contact_messages 
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

---

## Step 3: Set Up Storage Bucket for CV Uploads
1. Navigate to the **Storage** section in the left sidebar of the Supabase dashboard.
2. Click **New Bucket**.
3. Set Bucket Name to exactly `cvs`.
4. Make the bucket **Public** (or keep it private and use signed URLs. To keep it simple and free for your vanilla JS code, set it to **Public** so that direct CV links load easily).
5. Click **Save**.

### Storage Security Policies
Go to **Policies** under the Storage settings for the `cvs` bucket and create these rules:
- **Allow Public Uploads**: Select `INSERT` permission for anyone (`anon` role).
- **Allow Public Read**: Select `SELECT` permission for anyone (`anon` role) or authenticated admins.

Alternatively, you can run this SQL script in the SQL editor to set up storage permissions:
```sql
-- Allow anonymous CV uploads to the cvs bucket
CREATE POLICY "Allow public upload CVs" ON storage.objects
  FOR INSERT TO public WITH CHECK (bucket_id = 'cvs');

-- Allow public viewing of CV files
CREATE POLICY "Allow public select CVs" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'cvs');

-- Allow authenticated admin full control
CREATE POLICY "Allow authenticated full storage access" ON storage.objects
  FOR ALL TO authenticated USING (bucket_id = 'cvs');
```

---

## Step 4: Create your Admin Credentials
1. Go to **Authentication** tab on the left.
2. Click **Users** -> **Add User** -> **Create User**.
3. Input `admin@sbt.com` and a secure password (e.g. `admin123` or your own).
4. Uncheck "Send email confirmation" to activate the user immediately, then click **Create User**.

---

## Step 5: Connect keys to sbt-jobs
Copy your project API keys from **Project Settings** -> **API**:
1. Copy the **Project URL** and paste it into `/js/supabase.js` as the `SUPABASE_URL` value.
2. Copy the **Anon/Public Key** and paste it into `/js/supabase.js` as the `SUPABASE_ANON_KEY` value.
