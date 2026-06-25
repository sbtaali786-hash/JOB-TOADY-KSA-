/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string; // in SAR, e.g. "SAR 8,000 - 12,000"
  category: string;
  job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string; // e.g. "3 - 5 Years"
  short_description: string;
  description: string;
  requirements: string; // newline separated or markdown
  benefits: string; // newline separated or markdown
  featured: boolean;
  status: 'active' | 'inactive';
  posted_at: string; // ISO date string
  deadline: string; // YYYY-MM-DD
  whatsapp_number?: string;
  phone_number?: string;
  email_address?: string;
  duty_hours?: string;
  accommodation?: string;
  transportation?: string;
  food?: string;
  contact_person?: string;
  is_urgent?: boolean;
}

export interface Application {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nationality: string;
  current_city: string;
  job_id: string;
  position_applied: string;
  experience_years: number;
  expected_salary: number; // in SAR
  message: string;
  cv_url: string; // URL from Supabase Storage
  status: 'New' | 'Shortlisted' | 'Rejected' | 'Hired';
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  created_at: string;
}
