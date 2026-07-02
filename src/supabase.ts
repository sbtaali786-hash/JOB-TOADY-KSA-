/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Job, Application, ContactMessage } from './types';

// These can be configured in your .env or directly during deployment
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'YOUR_SUPABASE_URL');

// Create the Supabase client if credentials exist
export const supabase = isSupabaseConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

// Initial 15 High-Quality Sample Jobs for Saudi Arabia
const SAMPLE_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'HSE Officer',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 6,000 - 8,500',
    category: 'Safety & HSE',
    job_type: 'Full-time',
    experience: '3+ Years',
    short_description: 'We are seeking a certified HSE Officer to monitor on-site health, safety, and environment compliance at our construction and industrial project sites in Riyadh.',
    description: `As an HSE Officer, you will ensure that all on-site activities comply with Saudi government safety regulations, client requirements, and our corporate safety policy. You will conduct daily site inspections, deliver toolbox talks, identify potential hazards, and report incidents directly to the HSE Engineer and Site Manager. This role requires high vigilance and a proactive attitude towards creating a zero-harm workplace environment.`,
    requirements: `• Diploma in Engineering or Occupational Health & Safety.
• NEBOSH IGC or OSHA Certification is mandatory.
• 3 to 5 years of field experience in construction or oil & gas projects in Saudi Arabia.
• Valid Saudi driving license is a strong plus.
• Strong communication skills in English (Arabic is a plus).
• Knowledge of local Aramco / SABIC safety standards is preferred.`,
    benefits: `• Competitve basic salary based on experience.
• Free shared bachelor accommodation and site transportation.
• Health insurance coverage as per Saudi Labor Law.
• Paid annual leave with return flight ticket.
• Overtime allowance where applicable.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-31',
    whatsapp_number: '+966508202459',
    phone_number: '+966508202459',
    email_address: 'jobs@jobtodayksa.com',
    duty_hours: '8 Hours / Day',
    accommodation: 'Provided by Company',
    transportation: 'Provided by Company',
    food: 'Provided',
    contact_person: 'Recruitment Manager',
    is_urgent: true
  },
  {
    id: 'job-2',
    title: 'HSE Engineer',
    company: 'JOB TODAY KSA',
    location: 'Jeddah, Saudi Arabia',
    salary: 'SAR 9,000 - 13,000',
    category: 'Safety & HSE',
    job_type: 'Full-time',
    experience: '5+ Years',
    short_description: 'Looking for an experienced HSE Engineer to design, implement, and oversee comprehensive health and safety programs for large-scale building projects in Jeddah.',
    description: `The HSE Engineer will take structural responsibility for hazard evaluation, accident prevention, and technical compliance at major client facilities. You will collaborate with site project managers, draft HSE plans, review sub-contractor safety dossiers, conduct regular safety audits, and lead accident investigations to implement corrective and preventive action (CAPA).`,
    requirements: `• Bachelor's Degree in Civil, Mechanical, or Environmental Engineering.
• NEBOSH Diploma or equivalent international safety credentials.
• Minimum 5 years of dedicated experience as an HSE Engineer in Saudi Arabia.
• Deep understanding of OHSAS 18001 / ISO 45001 management systems.
• Fully proficient in technical report writing and safety compliance audits.
• Proficient in English (spoken and written).`,
    benefits: `• Competitive monthly salary.
• Premium medical insurance for self.
• End of service benefits.
• Annual performance-based bonus.
• Company-provided transportation or car allowance.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-09-15',
    whatsapp_number: '+966508202459',
    phone_number: '+966508202459',
    email_address: 'recruitment@jobtodayksa.com',
    duty_hours: '8 Hours / Day',
    accommodation: 'Provided by Company',
    transportation: 'Provided by Company',
    food: 'SAR 300 Allowance',
    contact_person: 'HR Department',
    is_urgent: false
  },
  {
    id: 'job-3',
    title: 'Safety Manager',
    company: 'JOB TODAY KSA',
    location: 'Dammam, Saudi Arabia',
    salary: 'SAR 15,000 - 22,000',
    category: 'Safety & HSE',
    job_type: 'Full-time',
    experience: '8+ Years',
    short_description: 'Senior Safety Manager required to manage country-wide safety programs, lead the HSE division, and coordinate with Aramco-approved project managers.',
    description: `We are hiring a visionary Safety Manager to establish corporate-wide safety cultures, oversee multiple projects, represent JOB TODAY KSA in high-level client meetings, and ensure ISO 45001 certification standards are strictly adhered to. You will lead a team of HSE Engineers and Officers, conduct high-impact risk assessments, and streamline compliance with regional safety statutes.`,
    requirements: `• Bachelor's Degree in Safety Engineering or relevant technical discipline.
• Graduate IOSH (GradIOSH) or Certified Safety Professional (CSP) preferred.
• 8 to 12 years of progressive HSE leadership experience, with at least 5 years in Saudi Arabia.
• Proven track record in successfully managing safety on Aramco or Royal Commission projects.
• Strong leadership and organizational command.`,
    benefits: `• Executive salary package.
• Family medical insurance.
• Annual family flight tickets.
• Fully paid company car and phone.
• High career growth potential in a growing organization.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-20',
    whatsapp_number: '+966508202459',
    phone_number: '+966508202459',
    email_address: 'admin@jobtodayksa.com',
    duty_hours: '10 Hours / Day',
    accommodation: 'Executive Housing Provided',
    transportation: 'Company Vehicle Provided',
    food: 'Catered Meals Provided',
    contact_person: 'Director of Operations',
    is_urgent: true
  },
  {
    id: 'job-4',
    title: 'Safety Supervisor',
    company: 'JOB TODAY KSA',
    location: 'Jubail, Saudi Arabia',
    salary: 'SAR 7,000 - 9,500',
    category: 'Safety & HSE',
    job_type: 'Full-time',
    experience: '4+ Years',
    short_description: 'Urgently hiring a Safety Supervisor for petrochemical and industrial maintenance shut-downs in Jubail Industrial City.',
    description: `The Safety Supervisor will supervise field activities, ensuring workers follow permit-to-work (PTW) rules, use appropriate PPE, and carry out work safely. This role involves active supervision of hot work, confined space entries, and critical lifts. You will report directly to the HSE Manager and deliver daily safe work reviews.`,
    requirements: `• Technical diploma with safety certificates.
• Minimum 4 years of industrial or refinery shutdown experience.
• Familiarity with gas detection equipment, lock-out/tag-out (LOTO), and scaffold safety.
• Good commanding skills with workers.
• English language proficiency.`,
    benefits: `• Excellent basic salary.
• Free food, accommodation, and transport provided by the company.
• Medical insurance and paid annual leaves.
• Overtime benefits for additional hours worked during shutdowns.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-07-31'
  },
  {
    id: 'job-5',
    title: 'Work Permit Receiver (WPR)',
    company: 'JOB TODAY KSA',
    location: 'Khobar, Saudi Arabia',
    salary: 'SAR 5,500 - 7,500',
    category: 'Technical & Engineering',
    job_type: 'Full-time',
    experience: '2+ Years',
    short_description: 'Aramco-certified Work Permit Receiver (WPR) required for mechanical construction and pipe-laying projects in the Eastern Province.',
    description: `As a Work Permit Receiver, you will be authorized to initiate, receive, and sign off on hot, cold, and confined space work permits on behalf of JOB TODAY KSA. You will ensure that all safety conditions specified on the permit are physically implemented at the work location before and during work execution.`,
    requirements: `• Valid Saudi Aramco Work Permit Receiver certification is highly preferred.
• High School Diploma or technical certification.
• Minimum 2 years of experience as a receiver in industrial plants.
• Strong knowledge of gas testing and hazardous zone requirements.
• Good verbal English communication.`,
    benefits: `• Stable salary package.
• Air-conditioned accommodation and free site transport.
• Food allowance or catered meals.
• Comprehensive medical coverage.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-15'
  },
  {
    id: 'job-6',
    title: 'Document Controller',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 4,500 - 6,000',
    category: 'Admin & Office',
    job_type: 'Full-time',
    experience: '2+ Years',
    short_description: 'Accurate and detail-oriented Document Controller needed to manage engineering submittals, correspondence, and project files in our head office.',
    description: `The Document Controller will be responsible for maintaining an organized system for receiving, registering, tracking, distributing, and archiving all project documents. You will manage drawing revisions, transmit submittals to clients, and ensure project teams have immediate access to the latest technical specifications.`,
    requirements: `• Bachelor's Degree or Diploma in Office Administration, IT, or equivalent.
• Minimum 2 years of document control experience within construction, trading, or engineering.
• Highly proficient with MS Excel, electronic document management systems (EDMS), and Aconex.
• Fluent in English (both spoken and written).
• Excellent organization and files tracking skills.`,
    benefits: `• Comfortable professional office environment.
• Medical insurance cover.
• Ticket allowance.
• Annual salary appraisal.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-30'
  },
  {
    id: 'job-7',
    title: 'Industrial Electrician',
    company: 'JOB TODAY KSA',
    location: 'Yanbu, Saudi Arabia',
    salary: 'SAR 3,500 - 5,000',
    category: 'Trades & Labor',
    job_type: 'Full-time',
    experience: '3+ Years',
    short_description: 'We require skilled Industrial Electricians for electrical cable tray laying, termination, and panel wiring in Yanbu industrial projects.',
    description: `Industrial Electricians will handle the physical installation of electrical systems, including conduits, cable routing, terminal connection of motors, high-voltage panel boards, and troubleshooting electrical control loops. You must follow standard electrical codes and project-specific blueprints safely.`,
    requirements: `• ITI / Vocational Training in Electrical Trade.
• Minimum 3 years of experience as an industrial electrician in Saudi Arabia.
• Competency in reading electrical drawings, wiring schematics, and single-line diagrams.
• Basic conversational English to understand safety and work briefs.`,
    benefits: `• Basic salary + free shared accommodation.
• Site transportation provided.
• Fully covered medical insurance.
• Hourly overtime paid at standard rates.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-10'
  },
  {
    id: 'job-8',
    title: 'Civil Supervisor',
    company: 'JOB TODAY KSA',
    location: 'NEOM, Saudi Arabia',
    salary: 'SAR 8,500 - 11,000',
    category: 'Technical & Engineering',
    job_type: 'Full-time',
    experience: '5+ Years',
    short_description: 'Civil Supervisor required to oversee excavation, concrete casting, and finishing activities for infrastructure packages in NEOM.',
    description: `As a Civil Supervisor, you will supervise concrete pouring, rebar layouts, shuttering, leveling, and site backfilling. You will coordinate with sub-contractor labor teams, ensure drawings are followed exactly, verify dimensions, and maintain strict quality standards while adhering to safety schedules.`,
    requirements: `• Diploma in Civil Engineering.
• 5+ years of practical field experience in civil construction.
• Prior experience working in high-pace mega projects (NEOM/Red Sea experience is highly valued).
• Ability to lead, schedule, and direct a crew of up to 30 workers.
• Valid Saudi driving license.`,
    benefits: `• Excellent salary package with NEOM remote area allowance.
• Full boarding, accommodation, and high-quality meals provided in camp.
• Regular rotation leaves with return tickets.
• Premium health insurance.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-09-01'
  },
  {
    id: 'job-9',
    title: 'QA/QC Inspector (Civil)',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 9,000 - 12,500',
    category: 'Technical & Engineering',
    job_type: 'Full-time',
    experience: '5+ Years',
    short_description: 'Certified QA/QC Inspector wanted to supervise concrete testing, structural inspection, and document quality packages in Riyadh metro/building expansion.',
    description: `The QC Inspector will formulate and execute inspection test plans (ITP), verify reinforcing steel, monitor concrete sampling/testing, inspect earthworks, and raise non-conformance reports (NCR) when deviations are spotted. You will coordinate client inspections and compile comprehensive QA/QC final dossiers.`,
    requirements: `• Degree or Diploma in Civil Engineering.
• Certified ISO 9001 Internal Auditor or equivalent QC certification.
• 5 years of quality control experience in civil works in Saudi Arabia.
• Approval from Saudi government departments or municipal bodies is preferred.
• High proficiency in drafting method statements and material approval forms.`,
    benefits: `• Very attractive basic salary.
• Standard housing and transportation allowance.
• Annual medical card and air ticket.
• Professional certification training support.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-25'
  },
  {
    id: 'job-10',
    title: 'Pipe Fitter',
    company: 'JOB TODAY KSA',
    location: 'Jubail, Saudi Arabia',
    salary: 'SAR 3,000 - 4,500',
    category: 'Trades & Labor',
    job_type: 'Full-time',
    experience: '3+ Years',
    short_description: 'Skilled Pipe Fitters wanted for carbon steel and stainless steel pipe preparation, alignment, and fitting in Jubail plants.',
    description: `Pipe Fitters will read isometric drawings, measure, cut, bevel, and fit pipes for welding. You will assist the mechanical fabrication crew on site and ensure joint alignments match precise specifications.`,
    requirements: `• ITI or vocational training in pipe fitting/fabrication.
• Minimum 3 years of field experience in plant piping, refinery, or water network setups.
• Ability to read and interpret complex piping isometric drawings.
• Basic understanding of safety regulations in plant environments.`,
    benefits: `• Basic salary + guaranteed overtime.
• Free food, clean bachelor accommodation, and industrial site transport.
• Medical insurance and return flight benefits.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-05'
  },
  {
    id: 'job-11',
    title: 'Mechanical Technician',
    company: 'JOB TODAY KSA',
    location: 'Dammam, Saudi Arabia',
    salary: 'SAR 4,500 - 6,500',
    category: 'Trades & Labor',
    job_type: 'Full-time',
    experience: '4+ Years',
    short_description: 'Seeking Mechanical Technicians with expert knowledge in pump alignment, compressor maintenance, and rotating equipment overhauling.',
    description: `Mechanical Technicians will perform preventive maintenance, mechanical diagnostic tests, and overhauling of rotating machines such as pumps, fans, blowers, and steam turbine ancillaries on site. You will inspect alignments using dial indicators or laser systems.`,
    requirements: `• Diploma in Mechanical Engineering or vocational training certification.
• 4 to 7 years of industrial mechanical maintenance experience in Saudi Arabia.
• Skilled in reading mechanical cross-sectional drawings and alignment sheets.
• Hands-on expertise with laser alignment tools and torque wrenches.`,
    benefits: `• Good basic pay + site allowances.
• Free company accommodation and transport.
• Health insurance and flight ticket.
• End of service benefits.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-15'
  },
  {
    id: 'job-12',
    title: 'Store Keeper',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 4,000 - 5,500',
    category: 'Admin & Office',
    job_type: 'Full-time',
    experience: '2+ Years',
    short_description: 'Organized Store Keeper required to manage inventory, receive tools, and log materials in our centralized construction yard.',
    description: `The Store Keeper will inspect all incoming goods, verify against delivery orders, organize the storage racks, issue tool/materials to workers, update inventory database entries, and prepare stock replenishment reports.`,
    requirements: `• Diploma or secondary education.
• Minimum 2 years of storekeeping experience in contracting or trading.
• Knowledge of computer applications (MS Office / ERP software).
• Able to maintain accurate physical and digital stock cards.
• Good numerical and organization skills.`,
    benefits: `• Decent basic salary.
• Free housing and transportation allowance.
• Health insurance and paid leaves.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-30'
  },
  {
    id: 'job-13',
    title: 'Site Engineer (Civil)',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 8,500 - 12,000',
    category: 'Technical & Engineering',
    job_type: 'Full-time',
    experience: '4+ Years',
    short_description: 'Hiring a Site Engineer to oversee subcontractor works, execute foundations, concrete structures, and finishings according to plans.',
    description: `As a Site Engineer, you will manage everyday site operations, prepare progress reports, coordinate material deliveries, supervise laborers and foremen, resolve engineering issues with design drawings, and check that works conform to high engineering qualities.`,
    requirements: `• Bachelor's Degree in Civil Engineering.
• Registered member of the Saudi Council of Engineers (SCE).
• 4 to 6 years of site execution experience in Saudi Arabia.
• Competency in reading AutoCAD and structure drawings.
• Good leadership, communication, and client coordination skills.`,
    benefits: `• Competitive monthly package.
    • Medical insurance, paid vacation, and ticket.
    • Company car or vehicle allowance.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-09-05'
  },
  {
    id: 'job-14',
    title: 'Admin Assistant',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 4,000 - 5,500',
    category: 'Admin & Office',
    job_type: 'Full-time',
    experience: '2+ Years',
    short_description: 'An Admin Assistant is needed for our Riyadh regional office to coordinate travel, answer queries, scan documents, and support HR.',
    description: `The Admin Assistant will support daily business operations. Duties include managing phone calls, booking client visits/flights, organizing HR files, greeting visitors, preparing basic memos/letters, and procuring general office supplies.`,
    requirements: `• Secondary school diploma or equivalent. Higher diploma preferred.
• 2+ years of general administrative or secretarial experience.
• Highly proficient in typing, MS Office (Word, PowerPoint, Excel).
• Good communication in English; bilingual (Arabic/English) is preferred.
• High attention to tidiness and detail.`,
    benefits: `• Pleasant working environment.
• Standard medical insurance coverage.
• Ticket allowance.
• Regular working hours with Friday off.`,
    featured: false,
    status: 'active',
    posted_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-31'
  },
  {
    id: 'job-15',
    title: 'Procurement Officer',
    company: 'JOB TODAY KSA',
    location: 'Riyadh, Saudi Arabia',
    salary: 'SAR 6,500 - 9,000',
    category: 'Admin & Office',
    job_type: 'Full-time',
    experience: '3+ Years',
    short_description: 'Seeking a Procurement Officer to handle supplier negotiations, local materials sourcing, and purchase order tracking in Riyadh.',
    description: `You will source construction and safety equipment, float inquiries to local suppliers, prepare comparative quotation summaries, negotiate prices and lead-times, draft final Purchase Orders, and coordinate with site stores to verify delivery dates and quality.`,
    requirements: `• Degree in Business Administration, Supply Chain, or engineering.
• Minimum 3 years of local procurement experience in the Saudi construction or trading market.
• Active directory of local safety gear, civil and mechanical material vendors in Riyadh/Dammam.
• Excellent negotiation, contract evaluation, and communication skills.
• Bilingual (Arabic & English) is highly advantageous.`,
    benefits: `• Monthly package commensurate with qualifications.
• Private health insurance.
• Performance-based annual bonuses.
• Flight allowance.`,
    featured: true,
    status: 'active',
    posted_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    deadline: '2026-08-31'
  }
];

// Helper methods to read/write state with either Supabase or LocalStorage
export const db = {
  // --- JOBS ---
  async getJobs(): Promise<Job[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (!error && data) {
        return data as Job[];
      }
      console.warn('Supabase fetch failed or returned empty. Falling back to LocalStorage.', error);
    }

    // Local Storage Fallback
    const stored = localStorage.getItem('job_today_ksa_jobs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse jobs from localStorage', e);
      }
    }

    // If empty, initialize localStorage with sample jobs
    localStorage.setItem('job_today_ksa_jobs', JSON.stringify(SAMPLE_JOBS));
    return SAMPLE_JOBS;
  },

  async saveJob(job: Job): Promise<Job> {
    if (supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .upsert(job)
        .select();
      
      if (!error && data && data[0]) {
        return data[0] as Job;
      }
      console.error('Supabase saveJob failed. Saving to LocalStorage instead.', error);
    }

    // Local Storage Fallback
    const jobs = await this.getJobs();
    const idx = jobs.findIndex(j => j.id === job.id);
    if (idx !== -1) {
      jobs[idx] = { ...job };
    } else {
      jobs.unshift(job);
    }
    localStorage.setItem('job_today_ksa_jobs', JSON.stringify(jobs));
    return job;
  },

  async saveJobsBulk(jobsList: Job[]): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('jobs')
        .upsert(jobsList);
      if (!error) return true;
      console.error('Supabase saveJobsBulk failed. Saving to LocalStorage instead.', error);
    }

    const jobs = await this.getJobs();
    for (const job of jobsList) {
      const idx = jobs.findIndex(j => j.id === job.id);
      if (idx !== -1) {
        jobs[idx] = { ...job };
      } else {
        jobs.unshift(job);
      }
    }
    localStorage.setItem('job_today_ksa_jobs', JSON.stringify(jobs));
    return true;
  },

  async deleteJob(id: string): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('jobs')
        .delete()
        .eq('id', id);
      if (!error) return true;
      console.error('Supabase deleteJob failed. Deleting from LocalStorage instead.', error);
    }

    const jobs = await this.getJobs();
    const filtered = jobs.filter(j => j.id !== id);
    localStorage.setItem('job_today_ksa_jobs', JSON.stringify(filtered));
    return true;
  },

  // --- APPLICATIONS ---
  async getApplications(): Promise<Application[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data as Application[];
      }
      console.warn('Supabase fetch applications failed. Falling back to LocalStorage.', error);
    }

    const stored = localStorage.getItem('job_today_ksa_applications');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse applications', e);
      }
    }
    return [];
  },

  async submitApplication(application: Omit<Application, 'id' | 'created_at' | 'status'>, cvFile?: File): Promise<Application> {
    const newApp: Application = {
      ...application,
      id: crypto.randomUUID ? crypto.randomUUID() : 'app-' + Math.random().toString(36).substring(2, 9),
      status: 'New',
      created_at: new Date().toISOString(),
      cv_url: application.cv_url || ''
    };

    // If file is passed and Supabase is configured, upload it
    if (cvFile && supabase) {
      try {
        const fileExt = cvFile.name.split('.').pop();
        const fileName = `${newApp.id}_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('cvs')
          .upload(fileName, cvFile, { cacheControl: '3600', upsert: true });

        if (!error && data) {
          // Get public URL
          const { data: publicUrlData } = supabase.storage
            .from('cvs')
            .getPublicUrl(fileName);
          
          if (publicUrlData) {
            newApp.cv_url = publicUrlData.publicUrl;
          }
        } else {
          console.error('CV upload to Supabase storage failed:', error);
        }
      } catch (err) {
        console.error('Error during CV upload:', err);
      }
    }

    // Fallback CV URL if empty and file is loaded
    if (!newApp.cv_url && cvFile) {
      newApp.cv_url = `blob:${URL.createObjectURL(cvFile)}`; // simple client-side preview
    }

    if (supabase) {
      const { data, error } = await supabase
        .from('applications')
        .insert(newApp)
        .select();
      
      if (!error && data && data[0]) {
        return data[0] as Application;
      }
      console.error('Supabase submitApplication failed. Saving locally.', error);
    }

    // Save locally
    const apps = await this.getApplications();
    apps.unshift(newApp);
    localStorage.setItem('job_today_ksa_applications', JSON.stringify(apps));
    return newApp;
  },

  async updateApplicationStatus(id: string, status: Application['status']): Promise<boolean> {
    if (supabase) {
      const { error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id);
      if (!error) return true;
      console.error('Supabase update status failed. Updating locally.', error);
    }

    const apps = await this.getApplications();
    const idx = apps.findIndex(a => a.id === id);
    if (idx !== -1) {
      apps[idx].status = status;
      localStorage.setItem('job_today_ksa_applications', JSON.stringify(apps));
      return true;
    }
    return false;
  },

  // --- CONTACT MESSAGES ---
  async getContactMessages(): Promise<ContactMessage[]> {
    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data as ContactMessage[];
      }
      console.warn('Supabase fetch messages failed. Falling back to LocalStorage.', error);
    }

    const stored = localStorage.getItem('job_today_ksa_messages');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse contact messages', e);
      }
    }
    return [];
  },

  async submitContactMessage(message: Omit<ContactMessage, 'id' | 'created_at'>): Promise<ContactMessage> {
    const newMsg: ContactMessage = {
      ...message,
      id: crypto.randomUUID ? crypto.randomUUID() : 'msg-' + Math.random().toString(36).substring(2, 9),
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('contact_messages')
        .insert(newMsg)
        .select();
      
      if (!error && data && data[0]) {
        return data[0] as ContactMessage;
      }
      console.error('Supabase submitContactMessage failed. Saving locally.', error);
    }

    const msgs = await this.getContactMessages();
    msgs.unshift(newMsg);
    localStorage.setItem('job_today_ksa_messages', JSON.stringify(msgs));
    return newMsg;
  }
};
