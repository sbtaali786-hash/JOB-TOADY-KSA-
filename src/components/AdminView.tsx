/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Briefcase, Mail, Plus, Edit2, Trash2, X, RefreshCw, Star, Search, Calendar, ChevronDown, UploadCloud, FileSpreadsheet, AlertCircle, CheckCircle, Download } from 'lucide-react';
import { Job, ContactMessage } from '../types';
import { db } from '../supabase';

interface AdminViewProps {
  jobs: Job[];
  onRefreshJobs: () => Promise<void>;
}

export default function AdminView({ jobs, onRefreshJobs }: AdminViewProps) {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeTab, setActiveTab] = useState<'jobs' | 'messages'>('jobs');
  const [loading, setLoading] = useState(true);

  // Job form modal state
  const [showJobModal, setShowJobModal] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  
  // Job Form Fields
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('JOB TODAY KSA');
  const [location, setLocation] = useState('Riyadh, Saudi Arabia');
  const [salary, setSalary] = useState('');
  const [category, setCategory] = useState('Safety & HSE');
  const [jobType, setJobType] = useState<'Full-time' | 'Part-time' | 'Contract' | 'Remote'>('Full-time');
  const [experience, setExperience] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [benefits, setBenefits] = useState('');
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<'active' | 'inactive'>('active');
  const [deadline, setDeadline] = useState('');

  // New Job Contact Details & Specific info
  const [whatsappNumber, setWhatsappNumber] = useState('+966508202459');
  const [phoneNumber, setPhoneNumber] = useState('+966508202459');
  const [emailAddress, setEmailAddress] = useState('jobs@jobtodayksa.com');
  const [dutyHours, setDutyHours] = useState('8 Hours / Day');
  const [accommodation, setAccommodation] = useState('Provided by Company');
  const [transportation, setTransportation] = useState('Provided by Company');
  const [food, setFood] = useState('Provided');
  const [contactPerson, setContactPerson] = useState('Recruitment Desk');
  const [isUrgent, setIsUrgent] = useState(false);

  // Bulk upload modal states
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [parsedBulkJobs, setParsedBulkJobs] = useState<Job[]>([]);
  const [bulkErrors, setBulkErrors] = useState<string[]>([]);
  const [isUploadingBulk, setIsUploadingBulk] = useState(false);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const msgs = await db.getContactMessages();
      setMessages(msgs);
    } catch (err) {
      console.error('Failed to fetch admin dashboard details', err);
    } finally {
      setLoading(false);
    }
  };

  // Download CSV template
  const handleDownloadTemplate = () => {
    const csvHeaders = [
      'Title', 'Company', 'Location', 'Salary', 'Category', 'Job Type', 'Experience',
      'Short Description', 'Description', 'Requirements', 'Benefits', 'Deadline',
      'WhatsApp', 'Phone', 'Email', 'Duty Hours', 'Accommodation', 'Transportation',
      'Food', 'Contact Person', 'Featured', 'Is Urgent'
    ].join(',');

    const sampleRow = [
      '"HSE Inspector"', '"JOB TODAY KSA"', '"Riyadh, Saudi Arabia"', '"SAR 7,000 - 9,500"', '"Safety & HSE"', '"Full-time"', '"4+ Years"',
      '"We are seeking a safety specialist to oversee daily operations and hazard preventions in construction sites."',
      '"This is an exciting opportunity for safety specialists to oversee daily hazard preventions. Duties include performing routine safety audits and reporting."',
      '"• OSHA or NEBOSH Certification\\n• Valid driving licence"',
      '"• Company accommodation\\n• Full insurance cover"',
      '"2026-09-30"', '"+966508202459"', '"+966508202459"', '"jobs@jobtodayksa.com"', '"8 Hours / Day"', '"Provided"', '"Provided"', '"Provided"', '"Recruitment Manager"', '"true"', '"false"'
    ].join(',');

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(`${csvHeaders}\n${sampleRow}`);
    const link = document.createElement("a");
    link.setAttribute("href", csvContent);
    link.setAttribute("download", "jobs_bulk_template_jobtodayksa.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Helper to parse CSV/TSV
  const parseBulkCSVAndTSVText = (text: string) => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length < 2) {
      setParsedBulkJobs([]);
      setBulkErrors(['No data found or template header is missing.']);
      return;
    }

    const headerLine = lines[0];
    const isTabSeparated = headerLine.includes('\t');
    const separator = isTabSeparated ? '\t' : ',';

    const splitCSVLine = (line: string, sep: string): string[] => {
      const result: string[] = [];
      let curVal = '';
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === sep && !inQuotes) {
          result.push(curVal.trim().replace(/^"|"$/g, ''));
          curVal = '';
        } else {
          curVal += char;
        }
      }
      result.push(curVal.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const headers = splitCSVLine(headerLine, separator).map(h => h.trim().toLowerCase());
    const parsedJobs: Job[] = [];
    const errors: string[] = [];

    const requiredHeaders = ['title', 'salary', 'short description', 'description'];
    const missing = requiredHeaders.filter(h => !headers.includes(h));
    if (missing.length > 0) {
      setParsedBulkJobs([]);
      setBulkErrors([`Missing required columns in your file header: "${missing.join(', ')}". Please download the sample template to view required columns.`]);
      return;
    }

    for (let idx = 1; idx < lines.length; idx++) {
      const rowLine = lines[idx];
      const columns = splitCSVLine(rowLine, separator);
      if (columns.length === 0 || (columns.length === 1 && !columns[0])) {
        continue;
      }

      const getVal = (headerName: string, fallback: string = ''): string => {
        const colIdx = headers.indexOf(headerName);
        if (colIdx !== -1 && colIdx < columns.length) {
          return columns[colIdx].trim() || fallback;
        }
        return fallback;
      };

      const title = getVal('title');
      const company = getVal('company', 'JOB TODAY KSA');
      const location = getVal('location', 'Riyadh, Saudi Arabia');
      const salary = getVal('salary');
      const category = getVal('category', 'Safety & HSE');
      const jobTypeVal = getVal('job type', 'Full-time');
      const experience = getVal('experience', '3+ Years');
      const shortDesc = getVal('short description');
      const description = getVal('description');
      const requirements = getVal('requirements', '• NEBOSH IGC or OSHA Certification\n• Relevant years of KSA experience').replace(/\\n/g, '\n');
      const benefits = getVal('benefits', '• Shared bachelor accommodation\n• Healthcare insurance cover\n• Flight tickets').replace(/\\n/g, '\n');
      
      let deadline = getVal('deadline');
      if (!deadline) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 60);
        deadline = futureDate.toISOString().split('T')[0];
      }

      const whatsapp = getVal('whatsapp', '+966508202459');
      const phone = getVal('phone', '+966508202459');
      const email = getVal('email', 'jobs@jobtodayksa.com');
      const dutyHours = getVal('duty hours', '8 Hours / Day');
      const accommodation = getVal('accommodation', 'Provided by Company');
      const transportation = getVal('transportation', 'Provided by Company');
      const food = getVal('food', 'Provided');
      const contactPerson = getVal('contact person', 'Recruitment Desk');
      
      const isUrgentVal = getVal('is urgent').toLowerCase();
      const isUrgent = isUrgentVal === 'true' || isUrgentVal === 'yes' || isUrgentVal === '1';

      const featuredVal = getVal('featured').toLowerCase();
      const featured = featuredVal === 'true' || featuredVal === 'yes' || featuredVal === '1';

      if (!title) {
        errors.push(`Row ${idx + 1}: Job Title is blank.`);
        continue;
      }
      if (!salary) {
        errors.push(`Row ${idx + 1} (${title || 'Unnamed'}): Salary is blank.`);
        continue;
      }
      if (!shortDesc) {
        errors.push(`Row ${idx + 1} (${title}): Short description is blank.`);
        continue;
      }
      if (!description) {
        errors.push(`Row ${idx + 1} (${title}): Full description is blank.`);
        continue;
      }

      let job_type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote' = 'Full-time';
      const typeLower = jobTypeVal.toLowerCase();
      if (typeLower.includes('part')) job_type = 'Part-time';
      else if (typeLower.includes('contract')) job_type = 'Contract';
      else if (typeLower.includes('remote')) job_type = 'Remote';

      const job: Job = {
        id: 'job-' + Date.now().toString() + '-' + idx + '-' + Math.random().toString(36).substring(2, 5),
        title,
        company,
        location,
        salary,
        category,
        job_type,
        experience,
        short_description: shortDesc,
        description,
        requirements,
        benefits,
        featured,
        status: 'active',
        posted_at: new Date().toISOString(),
        deadline,
        whatsapp_number: whatsapp,
        phone_number: phone,
        email_address: email,
        duty_hours: dutyHours,
        accommodation,
        transportation,
        food,
        contact_person: contactPerson,
        is_urgent: isUrgent
      };

      parsedJobs.push(job);
    }

    setParsedBulkJobs(parsedJobs);
    setBulkErrors(errors);
  };

  const handleBulkTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setBulkInputText(val);
    parseBulkCSVAndTSVText(val);
  };

  const processFileContent = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setBulkInputText(text);
      parseBulkCSVAndTSVText(text);
    };
    reader.readAsText(file);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFileContent(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFileContent(e.target.files[0]);
    }
  };

  const handleCommitBulkUpload = async () => {
    if (parsedBulkJobs.length === 0) {
      alert('No valid jobs are ready to upload. Please review your file and template requirements.');
      return;
    }

    setIsUploadingBulk(true);
    try {
      await db.saveJobsBulk(parsedBulkJobs);
      await onRefreshJobs();
      alert(`Successfully uploaded ${parsedBulkJobs.length} new jobs to the platform!`);
      
      setShowBulkModal(false);
      setBulkInputText('');
      setParsedBulkJobs([]);
      setBulkErrors([]);
    } catch (err) {
      console.error(err);
      alert('An error occurred during bulk jobs submission.');
    } finally {
      setIsUploadingBulk(false);
    }
  };

  // Open modal for Adding Job
  const handleAddJobClick = () => {
    setEditingJob(null);
    setTitle('');
    setCompany('JOB TODAY KSA');
    setLocation('Riyadh, Saudi Arabia');
    setSalary('');
    setCategory('Safety & HSE');
    setJobType('Full-time');
    setExperience('3+ Years');
    setShortDesc('');
    setDescription('');
    setRequirements('• NEBOSH IGC or OSHA Certification\n• Relevant years of KSA experience');
    setBenefits('• Shared bachelor accommodation\n• Healthcare insurance cover\n• Flight tickets');
    setFeatured(false);
    setStatus('active');
    
    // Default Contact values
    setWhatsappNumber('+966508202459');
    setPhoneNumber('+966508202459');
    setEmailAddress('jobs@jobtodayksa.com');
    setDutyHours('8 Hours / Day');
    setAccommodation('Provided by Company');
    setTransportation('Provided by Company');
    setFood('Provided');
    setContactPerson('Recruitment Desk');
    setIsUrgent(false);

    // Set a default deadline 60 days from now
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 60);
    setDeadline(futureDate.toISOString().split('T')[0]);

    setShowJobModal(true);
  };

  // Open modal for Editing Job
  const handleEditJobClick = (job: Job) => {
    setEditingJob(job);
    setTitle(job.title);
    setCompany(job.company);
    setLocation(job.location);
    setSalary(job.salary);
    setCategory(job.category);
    setJobType(job.job_type);
    setExperience(job.experience);
    setShortDesc(job.short_description);
    setDescription(job.description);
    setRequirements(job.requirements);
    setBenefits(job.benefits);
    setFeatured(job.featured);
    setStatus(job.status);
    setDeadline(job.deadline);

    // Populating editing job custom contact fields
    setWhatsappNumber(job.whatsapp_number || '+966508202459');
    setPhoneNumber(job.phone_number || '+966508202459');
    setEmailAddress(job.email_address || 'jobs@jobtodayksa.com');
    setDutyHours(job.duty_hours || '8 Hours / Day');
    setAccommodation(job.accommodation || 'Provided by Company');
    setTransportation(job.transportation || 'Provided by Company');
    setFood(job.food || 'Provided');
    setContactPerson(job.contact_person || 'Recruitment Desk');
    setIsUrgent(!!job.is_urgent);

    setShowJobModal(true);
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !salary || !shortDesc || !description || !deadline) {
      alert('Please fill in all primary fields.');
      return;
    }

    const payload: Job = {
      id: editingJob ? editingJob.id : 'job-' + Date.now().toString(),
      title,
      company,
      location,
      salary,
      category,
      job_type: jobType,
      experience,
      short_description: shortDesc,
      description,
      requirements,
      benefits,
      featured,
      status,
      posted_at: editingJob ? editingJob.posted_at : new Date().toISOString(),
      deadline,
      // Contact properties
      whatsapp_number: whatsappNumber,
      phone_number: phoneNumber,
      email_address: emailAddress,
      duty_hours: dutyHours,
      accommodation,
      transportation,
      food,
      contact_person: contactPerson,
      is_urgent: isUrgent
    };

    try {
      await db.saveJob(payload);
      setShowJobModal(false);
      await onRefreshJobs();
      alert('Job listing saved successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to save job listing.');
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to delete this job listing?')) {
      return;
    }

    try {
      await db.deleteJob(id);
      await onRefreshJobs();
    } catch (err) {
      console.error(err);
      alert('Failed to delete job.');
    }
  };

  const handleToggleActive = async (job: Job) => {
    const updated: Job = {
      ...job,
      status: job.status === 'active' ? 'inactive' : 'active'
    };
    try {
      await db.saveJob(updated);
      await onRefreshJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (job: Job) => {
    const updated: Job = {
      ...job,
      featured: !job.featured
    };
    try {
      await db.saveJob(updated);
      await onRefreshJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      
      {/* Upper header summary */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-blue-950 tracking-tight sm:text-3xl">Admin Controller Dashboard</h1>
          <p className="text-xs text-gray-500 mt-1">Add job offerings, manage active status, and view direct contact messages.</p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={fetchAdminData}
            className="rounded-xl border border-gray-200 bg-white p-2.5 text-gray-700 hover:bg-gray-50 transition shadow-sm cursor-pointer"
            title="Refresh database entries"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={() => {
              setBulkInputText('');
              setParsedBulkJobs([]);
              setBulkErrors([]);
              setShowBulkModal(true);
            }}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 transition cursor-pointer"
          >
            <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            <span>Bulk Upload (Excel/CSV)</span>
          </button>
          <button
            onClick={handleAddJobClick}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Numerical Stats widgets row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex justify-between items-start text-blue-600 mb-2">
            <Briefcase className="h-5 w-5" />
          </div>
          <p className="text-2xl font-extrabold text-blue-950">{jobs.filter(j => j.status === 'active').length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Active Job Openings</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex justify-between items-start text-amber-600 mb-2">
            <Briefcase className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-blue-950">{jobs.filter(j => j.status !== 'active').length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Draft / Inactive Jobs</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex justify-between items-start text-purple-600 mb-2">
            <Mail className="h-5 w-5" />
          </div>
          <p className="text-2xl font-extrabold text-blue-950">{messages.length}</p>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Direct Contact Messages</p>
        </div>
      </div>

      {/* Tabs navigation row */}
      <div className="border-b border-gray-100 flex gap-6 mb-8 text-sm">
        {(['jobs', 'messages'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`font-semibold pb-3 transition border-b-2 capitalize ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'jobs' ? 'Manage Job Posts' : 'Contact Messages'}
          </button>
        ))}
      </div>

      {/* TABLE/LISTINGS INTERFACES BASED ON ACTIVE TAB */}
      {activeTab === 'jobs' && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100 text-gray-400 uppercase font-bold tracking-wider">
                <th className="p-4">Vacancy Details</th>
                <th className="p-4">Location & Salary</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50/50 transition">
                  <td className="p-4">
                    <span className="font-bold text-blue-950 block text-sm leading-tight">{job.title}</span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block mt-1">{job.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-gray-600 block">{job.location}</span>
                    <span className="text-blue-900 font-bold block mt-0.5">{job.salary}</span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(job)}
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                        job.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-gray-100 text-gray-400 border border-gray-200'
                      }`}
                    >
                      {job.status === 'active' ? 'Active' : 'Draft'}
                    </button>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleFeatured(job)}
                      className={`p-1.5 rounded transition ${job.featured ? 'text-amber-500 hover:text-amber-600' : 'text-gray-300 hover:text-gray-400'}`}
                      title={job.featured ? 'Remove from Featured' : 'Mark as Featured'}
                    >
                      <Star className={`h-4, w-4 ${job.featured ? 'fill-amber-500' : ''}`} />
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEditJobClick(job)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-blue-600 transition"
                        title="Edit Job details"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition hover:border-red-100"
                        title="Delete vacancy"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
          {messages.length === 0 ? (
            <p className="text-center py-12 text-xs text-gray-400 font-semibold">No messages recorded in database yet.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <div key={msg.id} className="p-6 hover:bg-gray-50/50 transition">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="font-bold text-blue-950 text-sm leading-tight">{msg.name}</h3>
                      <p className="text-[11px] text-gray-400 font-medium mt-0.5">{msg.email} • Phone: {msg.phone}</p>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{new Date(msg.created_at).toLocaleString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wide mb-1.5">Subject: {msg.subject}</h4>
                  <p className="text-xs text-gray-600 whitespace-pre-line leading-relaxed">{msg.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= EDIT/ADD JOB MODAL DIALOG ================= */}
      {showJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowJobModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-lg font-extrabold text-blue-950 border-b border-gray-50 pb-3 mb-6">
              {editingJob ? 'Modify Job Posting' : 'Create New Job vacancy'}
            </h2>

            <form onSubmit={handleSaveJob} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Job Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. HSE Officer"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Location in Saudi Arabia</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Riyadh, Saudi Arabia"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Salary Display (SAR)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SAR 6,000 - 8,500"
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Sector Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Safety & HSE">Safety & HSE</option>
                    <option value="Technical & Engineering">Technical & Engineering</option>
                    <option value="Admin & Office">Admin & Office</option>
                    <option value="Trades & Labor">Trades & Labor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Job Contract Type</label>
                  <select
                    value={jobType}
                    onChange={(e) => setJobType(e.target.value as any)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Required Experience (e.g. 3+ Years)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4+ Years"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Apply Deadline</label>
                  <input
                    type="date"
                    required
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Short Card Summary (max 2 sentences)</label>
                <input
                  type="text"
                  required
                  placeholder="Provide a quick card snippet detail of the vacancy..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Full Job Description</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Detailed project scope, daily duties, and organizational structure..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Requirements (one per line)</label>
                  <textarea
                    rows={4}
                    placeholder="• NEBOSH / OSHA&#10;• Valid driving licence..."
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Benefits (one per line)</label>
                  <textarea
                    rows={4}
                    placeholder="• Housing provided&#10;• GOSI coverage..."
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  />
                </div>
              </div>

              {/* ================= NEW CONTACT & DUY/FACILITY FIELDS ================= */}
              <div className="border-t border-slate-100 pt-4 mt-4">
                <h3 className="text-sm font-extrabold text-blue-900 uppercase tracking-wider mb-4">Recruitment Contact & Duty Details</h3>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">WhatsApp Contact Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +966508202459"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Call Phone Number</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. +966508202459"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Contact Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. jobs@jobtodayksa.com"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Contact Person Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Recruitment Desk (Optional)"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Duty Hours / Shift Details</label>
                    <input
                      type="text"
                      placeholder="e.g. 8 Hours / Day, 6 Days/week"
                      value={dutyHours}
                      onChange={(e) => setDutyHours(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Accommodation Status</label>
                    <input
                      type="text"
                      placeholder="e.g. Provided by Company"
                      value={accommodation}
                      onChange={(e) => setAccommodation(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Transportation Status</label>
                    <input
                      type="text"
                      placeholder="e.g. Provided by Company"
                      value={transportation}
                      onChange={(e) => setTransportation(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Food Facility Status</label>
                    <input
                      type="text"
                      placeholder="e.g. Provided / Allowance"
                      value={food}
                      onChange={(e) => setFood(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 py-2.5 px-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 border-t border-gray-50 pt-4">
                <label className="flex items-center gap-2 font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                  <span>Mark as Featured Opening</span>
                </label>

                <label className="flex items-center gap-2 font-bold text-red-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500 h-4 w-4"
                  />
                  <span>Urgent Recruitment Badge</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-700">Listing Status:</span>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="rounded border border-gray-200 px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option value="active">Active (Visible to applicants)</option>
                    <option value="inactive">Draft (Hidden)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white hover:bg-blue-700 transition cursor-pointer shadow-md shadow-blue-100"
              >
                Save Job Details & Deploy
              </button>
            </form>
          </div>
        </div>
      )}
      {/* ================= BULK JOBS UPLOAD MODAL ================= */}
      {showBulkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-blue-950/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Close Button */}
            <button
              onClick={() => setShowBulkModal(false)}
              className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="border-b border-gray-50 pb-4 mb-6">
              <div className="flex items-center gap-2 mb-1">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
                <h2 className="text-lg font-extrabold text-blue-950">Bulk Import Job Vacancies</h2>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                Add hundreds of job postings simultaneously. You can download our template, modify it, and upload or paste the content directly.
              </p>
            </div>

            {/* Template Download Prompt */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex gap-2.5 items-start text-xs">
                <AlertCircle className="h-4.5 w-4.5 shrink-0 text-blue-600 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-950 block">Need the exact CSV layout?</span>
                  <span className="text-gray-500 text-[11px] block mt-0.5 leading-relaxed">
                    Download our official template. It includes columns for Job Title, Company, Category, WhatsApp/Email, Salary displays, and other recruiting configurations.
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="flex items-center gap-1.5 shrink-0 rounded-xl bg-white border border-blue-200 text-blue-700 px-3.5 py-2 text-xs font-bold hover:bg-blue-50 transition cursor-pointer shadow-sm"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Get Template CSV</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Left Side: Upload or Paste */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider">Step 1: Choose Import Method</h3>
                
                {/* Drag and Drop Box */}
                <div 
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleFileDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition flex flex-col items-center justify-center cursor-pointer ${
                    dragActive 
                      ? 'border-blue-600 bg-blue-50/30' 
                      : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                  onClick={() => document.getElementById('bulk-file-input')?.click()}
                >
                  <input 
                    type="file" 
                    id="bulk-file-input" 
                    className="hidden" 
                    accept=".csv, .txt" 
                    onChange={handleFileSelect} 
                  />
                  <UploadCloud className="h-8 w-8 text-blue-500 mb-2" />
                  <span className="text-xs font-bold text-gray-700 block">Drag & Drop your CSV file here</span>
                  <span className="text-[10px] text-gray-400 block mt-0.5">or click to browse local files</span>
                </div>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-100"></div>
                  <span className="flex-shrink mx-4 text-[10px] text-gray-400 font-bold uppercase tracking-widest">or paste data directly</span>
                  <div className="flex-grow border-t border-gray-100"></div>
                </div>

                {/* Paste Text Area */}
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 uppercase tracking-wider mb-1.5">Paste Excel Table / CSV Rows</label>
                  <textarea
                    rows={6}
                    value={bulkInputText}
                    onChange={handleBulkTextChange}
                    placeholder="Title,Company,Location,Salary,Category,Job Type,Experience,Short Description,Description&#10;&quot;HSE Specialist&quot;,&quot;JOB TODAY KSA&quot;,&quot;Jubail&quot;,&quot;SAR 9,000&quot;,&quot;Safety & HSE&quot;,&quot;Full-time&quot;,&quot;5 Years&quot;,&quot;Quick summary...&quot;,&quot;Full description...&quot;"
                    className="w-full rounded-xl border border-gray-200 p-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-mono leading-relaxed"
                  />
                  <span className="text-[10px] text-gray-400 block mt-1 leading-normal">
                    Tip: Copy rows from Excel, Google Sheets, or a text editor and paste them straight here. Tab-separated data is supported!
                  </span>
                </div>
              </div>

              {/* Right Side: Parsing Summary & Warnings */}
              <div className="flex flex-col h-full min-h-[300px]">
                <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4">Step 2: Preview & Validation</h3>
                
                {/* Feedback panels */}
                <div className="flex-1 space-y-4 overflow-y-auto max-h-[360px] pr-1">
                  
                  {/* Ready to upload status */}
                  {parsedBulkJobs.length > 0 && (
                    <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-4 flex gap-2.5 items-start text-xs text-emerald-800">
                      <CheckCircle className="h-4.5 w-4.5 shrink-0 text-emerald-600 mt-0.5" />
                      <div>
                        <span className="font-bold block text-emerald-950">
                          {parsedBulkJobs.length} Jobs Ready to Import!
                        </span>
                        <span className="text-[11px] block mt-0.5 leading-normal">
                          All columns conform to system standards. Press "Import Jobs" below to commit these entries to the databases.
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Errors / Warnings log */}
                  {bulkErrors.length > 0 && (
                    <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 flex gap-2.5 items-start text-xs text-amber-800">
                      <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
                      <div>
                        <span className="font-bold block text-amber-950">
                          Validation Warnings ({bulkErrors.length})
                        </span>
                        <div className="mt-1.5 space-y-1 max-h-36 overflow-y-auto text-[10px] font-mono pr-1">
                          {bulkErrors.map((err, i) => (
                            <p key={i} className="leading-tight">• {err}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty state when nothing uploaded */}
                  {parsedBulkJobs.length === 0 && bulkErrors.length === 0 && (
                    <div className="rounded-xl border border-dashed border-gray-200 p-8 text-center flex flex-col items-center justify-center text-gray-400 h-full">
                      <FileSpreadsheet className="h-8 w-8 mb-2 text-gray-300" />
                      <span className="text-xs font-bold block">No preview data loaded</span>
                      <span className="text-[10px] mt-0.5 leading-relaxed block max-w-[240px]">
                        Upload a CSV file or paste spreadsheet columns on the left to see parsing validation here.
                      </span>
                    </div>
                  )}

                  {/* Parsed jobs scroll lists preview */}
                  {parsedBulkJobs.length > 0 && (
                    <div className="border border-gray-100 rounded-xl overflow-hidden bg-white">
                      <div className="bg-gray-50 border-b border-gray-100 px-3 py-2 text-[10px] uppercase font-bold tracking-wider text-gray-400">
                        Parsed listings preview list
                      </div>
                      <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                        {parsedBulkJobs.map((j, i) => (
                          <div key={i} className="p-2.5 text-[11px] flex justify-between gap-4">
                            <div>
                              <strong className="text-blue-950 block leading-tight">{j.title}</strong>
                              <span className="text-gray-400 text-[9px] font-semibold block">{j.company} • {j.category}</span>
                            </div>
                            <div className="text-right">
                              <span className="text-blue-900 font-bold block">{j.salary}</span>
                              <span className="text-gray-400 text-[9px] block">{j.location}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Actions Row */}
            <div className="border-t border-gray-50 pt-4 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowBulkModal(false)}
                className="rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              
              <button
                type="button"
                onClick={handleCommitBulkUpload}
                disabled={parsedBulkJobs.length === 0 || isUploadingBulk}
                className={`flex items-center gap-1.5 rounded-xl bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition cursor-pointer ${
                  (parsedBulkJobs.length === 0 || isUploadingBulk) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isUploadingBulk ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Importing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    <span>Deploy {parsedBulkJobs.length} parsed jobs</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
