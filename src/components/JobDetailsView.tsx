/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  MapPin, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Clock, 
  Share2, 
  ClipboardCheck, 
  Award, 
  Smile, 
  Check,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  AlertCircle,
  FileText,
  X,
  UploadCloud
} from 'lucide-react';
import { Job } from '../types';
import { db } from '../supabase';

interface JobDetailsViewProps {
  job: Job;
  allJobs: Job[];
  onNavigate: (page: string, data?: any) => void;
}

export default function JobDetailsView({ job, allJobs, onNavigate }: JobDetailsViewProps) {
  const [copied, setCopied] = useState(false);
  
  // Apply Form State
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [currentCity, setCurrentCity] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [coverMessage, setCoverMessage] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find related jobs in same category, excluding current
  const relatedJobs = allJobs
    .filter(j => j.category === job.category && j.id !== job.id && j.status === 'active')
    .slice(0, 3);

  const formatSAR = (val: string) => {
    return val.toLowerCase().includes('sar') ? val : `SAR ${val}`;
  };

  // Split description, requirements, benefits into arrays if they are multiline strings
  const requirementsList = job.requirements ? job.requirements.split('\n').filter(Boolean) : [];
  const benefitsList = job.benefits ? job.benefits.split('\n').filter(Boolean) : [];

  // Intelligently extract qualification from requirements or fallback to a standard description
  const getQualification = () => {
    const keywords = ['degree', 'diploma', 'bachelor', 'b.e.', 'master', 'certification', 'nebosh', 'osha', 'accredited'];
    for (const req of requirementsList) {
      const lower = req.toLowerCase();
      if (keywords.some(keyword => lower.includes(keyword))) {
        // clean up leading list bullet points
        return req.replace(/^[•\s-*]+/, '').trim();
      }
    }
    return 'Diploma / Degree or relevant certified training in engineering/safety';
  };

  const qualificationStr = getQualification();

  // Helper URLs for direct contact
  const getWhatsAppUrl = (num: string | undefined, title: string) => {
    const targetNum = num || '0508202459';
    let cleanNum = targetNum.replace(/[^0-9]/g, '');
    if (cleanNum.startsWith('05')) {
      cleanNum = '966' + cleanNum.substring(1);
    } else if (cleanNum.startsWith('5')) {
      cleanNum = '966' + cleanNum;
    } else if (!cleanNum.startsWith('966')) {
      cleanNum = '966' + cleanNum;
    }
    const text = encodeURIComponent(`Hello JOB TODAY KSA, I am interested in applying for the "${title}" vacancy. Please guide me on the next steps.`);
    return `https://wa.me/${cleanNum}?text=${text}`;
  };

  const getPhoneUrl = (num: string | undefined) => {
    const targetNum = num || '0508202459';
    let cleanNum = targetNum.replace(/\s+/g, '');
    if (cleanNum.startsWith('05') && !cleanNum.startsWith('+966') && !cleanNum.startsWith('966')) {
      cleanNum = '+966' + cleanNum.substring(1);
    }
    return `tel:${cleanNum}`;
  };

  const getEmailUrl = (emailStr: string | undefined, title: string) => {
    const targetEmail = emailStr || 'sbtservices7@sbtcabin.com';
    const subject = encodeURIComponent(`Direct Inquiry: ${title} Position`);
    const body = encodeURIComponent(`Dear Recruitment Desk,\n\nI am contacting you regarding the "${title}" vacancy posted on JOB TODAY KSA.\n\nPlease find my request to connect for direct screening.\n\nBest regards.`);
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  // Submit Application Form
  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (!fullName || !email || !phone || !nationality || !currentCity || !experienceYears || !expectedSalary) {
      setErrorMsg('Please fill in all mandatory application fields.');
      return;
    }

    if (!cvFile) {
      setErrorMsg('Please select your CV / Resume (PDF, DOC, or DOCX format) to upload.');
      return;
    }

    setIsSubmitting(true);
    try {
      const appPayload = {
        full_name: fullName,
        email: email,
        phone: phone,
        nationality: nationality,
        current_city: currentCity,
        job_id: job.id,
        position_applied: job.title,
        experience_years: Number(experienceYears),
        expected_salary: Number(expectedSalary),
        message: coverMessage,
        cv_url: '' // Will be updated by DB handler file upload
      };

      await db.submitApplication(appPayload, cvFile);
      setSubmitSuccess(true);
      
      // Clear inputs
      setFullName('');
      setEmail('');
      setPhone('');
      setNationality('');
      setCurrentCity('');
      setExperienceYears('');
      setExpectedSalary('');
      setCoverMessage('');
      setCvFile(null);
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMsg(err?.message || 'Something went wrong while submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('home')}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-900 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Jobs Portal</span>
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Main Job details column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 relative overflow-hidden">
            {job.is_urgent && (
              <span className="absolute top-0 right-0 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider px-4 py-1.5 rounded-bl-2xl shadow-sm">
                Urgent Hiring
              </span>
            )}

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                {job.category}
              </span>
              <span className="rounded bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {job.job_type}
              </span>
            </div>

            <h1 className="text-2xl font-black text-slate-950 sm:text-3xl tracking-tight leading-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-blue-600 mt-1">{job.company}</p>

            {/* Quick Metadata including Qualification */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-xs text-slate-600 font-medium sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Location</span>
                  <span className="text-slate-900 font-semibold">{job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Salary</span>
                  <span className="text-slate-900 font-black text-blue-700">{formatSAR(job.salary)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Experience</span>
                  <span className="text-slate-900 font-semibold">{job.experience || '3+ Years'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Posted Date</span>
                  <span className="text-slate-900 font-semibold">{new Date(job.posted_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
            </div>

            {/* Prominent Qualification Section */}
            <div className="mt-5 bg-slate-50 border border-slate-100 rounded-xl p-4 flex items-start gap-3">
              <Award className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Qualification Required</span>
                <span className="text-xs text-slate-800 font-bold leading-relaxed">{qualificationStr}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2 mb-3 border-b border-slate-50 pb-2">
                <ClipboardCheck className="h-4 w-4 text-blue-600" />
                <span>Job Description</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Conditions Section (Duty Hours, Accommodation, Transportation, Food) */}
            <div className="pt-2">
              <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2 mb-4 border-b border-slate-50 pb-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Working Conditions & Facilities</span>
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-150 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duty Hours</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.duty_hours || '8 Hours / Day'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-150 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accommodation</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.accommodation || 'Company Provided'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-150 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transportation</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.transportation || 'Company Provided'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-150 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Food Facility</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.food || 'Provided / Allowance'}</span>
                </div>
              </div>
            </div>

            {/* Requirements List */}
            {requirementsList.length > 0 && (
              <div className="pt-2">
                <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2 mb-3 border-b border-slate-50 pb-2">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Key Requirements & Certifications</span>
                </h2>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {requirementsList.map((req, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="rounded-full bg-blue-50 p-0.5 text-blue-600 shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{req.startsWith('•') || req.startsWith('-') ? req.substring(1).trim() : req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Benefits List */}
            {benefitsList.length > 0 && (
              <div className="pt-2">
                <h2 className="text-base font-extrabold text-slate-950 flex items-center gap-2 mb-3 border-b border-slate-50 pb-2">
                  <Smile className="h-4 w-4 text-blue-600" />
                  <span>Benefits & Allowances</span>
                </h2>
                <ul className="space-y-2.5 text-sm text-slate-600">
                  {benefitsList.map((ben, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="rounded-full bg-blue-50 p-0.5 text-blue-600 shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </span>
                      <span>{ben.startsWith('•') || ben.startsWith('-') ? ben.substring(1).trim() : ben}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Action Panel Sidebar */}
        <div className="space-y-6">
          {/* Direct Contact Card with Apply Now functionality */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider text-center mb-1">Direct Recruitment</h3>
            <p className="text-xs text-slate-500 text-center mb-5">Interested in this vacancy? Apply immediately using our direct application form below or contact the recruitment desk.</p>

            {/* Optional Contact Person */}
            {job.contact_person && (
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-center mb-4">
                <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Recruitment Officer</span>
                <span className="text-xs font-bold text-slate-800 block mt-0.5">{job.contact_person}</span>
              </div>
            )}

            {/* Direct Apply Now Button & Instant Contact Actions */}
            <div className="space-y-2.5">
              
              {/* PRIMARY APPLY NOW FORM BUTTON */}
              <button
                onClick={() => setIsApplyModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black py-3.5 shadow-md shadow-blue-100 transition text-sm text-center cursor-pointer"
              >
                <ClipboardCheck className="h-4.5 w-4.5" />
                <span>Apply Now</span>
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100"></div>
                <span className="flex-shrink mx-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">Or Contact Directly</span>
                <div className="flex-grow border-t border-slate-100"></div>
              </div>

              {/* WhatsApp Button */}
              <a
                href={getWhatsAppUrl(job.whatsapp_number, job.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 shadow-md shadow-emerald-100 transition text-xs text-center"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact via WhatsApp</span>
              </a>

              {/* Call Phone Button */}
              <a
                href={getPhoneUrl(job.phone_number)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 hover:bg-black text-white font-extrabold py-3 shadow-md transition text-xs text-center"
              >
                <Phone className="h-4 w-4" />
                <span>Call Recruitment Desk</span>
              </a>

              {/* Email Contact Button */}
              <a
                href={getEmailUrl(job.email_address, job.title)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold py-3 transition text-xs text-center"
              >
                <Mail className="h-4 w-4 text-slate-400" />
                <span>Inquire via Email</span>
              </a>
            </div>

            <button
              onClick={handleShare}
              className="w-full mt-4 rounded-xl border border-dashed border-slate-200 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{copied ? 'Link Copied!' : 'Share Vacancy Link'}</span>
            </button>

            <div className="mt-5 pt-5 border-t border-slate-100 text-[11px] text-slate-400 text-center">
              <p>Application Deadline: <strong className="text-slate-600 font-bold">{job.deadline || 'Ongoing'}</strong></p>
              <p className="mt-1">Inquiry Mail: <strong className="text-slate-600 font-bold">{job.email_address || 'sbtservices7@sbtcabin.com'}</strong></p>
            </div>
          </div>

          {/* Related Jobs card list */}
          {relatedJobs.length > 0 && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-3 mb-4">
                Related Vacancies
              </h3>
              <div className="space-y-4">
                {relatedJobs.map((rJob) => (
                  <div
                    key={rJob.id}
                    onClick={() => onNavigate('job-details', rJob)}
                    className="group cursor-pointer border-b border-slate-50 pb-3 last:border-0 last:pb-0"
                  >
                    <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 group-hover:underline transition line-clamp-1">
                      {rJob.title}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">{rJob.location}</p>
                    <p className="text-[11px] font-bold text-blue-600 mt-1">{formatSAR(rJob.salary)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>

      {/* FULL SCREEN MODAL: APPLY NOW FORM */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8">
            
            {/* Modal Header */}
            <div className="bg-slate-950 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-lg tracking-tight">Submit Job Application</h3>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">{job.title} • {job.company}</p>
              </div>
              <button
                onClick={() => {
                  setIsApplyModalOpen(false);
                  setSubmitSuccess(false);
                  setErrorMsg('');
                }}
                className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {submitSuccess ? (
                <div className="text-center py-8">
                  <div className="mx-auto h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Check className="h-8 w-8 stroke-[3]" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Application Submitted!</h4>
                  <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                    Your resume and details have been successfully uploaded to JOB TODAY KSA's operations department.
                  </p>
                  <p className="text-xs text-slate-400 mt-4">
                    Our recruitment managers will get back to you shortly after review.
                  </p>
                  <button
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setSubmitSuccess(false);
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-6 py-3 text-xs shadow transition cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="rounded-xl bg-red-50 border border-red-100 p-3.5 flex items-start gap-2 text-xs text-red-600 font-medium">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Two column grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +9665XXXXXXXX"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Nationality *</label>
                      <input
                        type="text"
                        required
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="e.g. Saudi, Indian, Pakistani"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Current City (KSA) *</label>
                      <input
                        type="text"
                        required
                        value={currentCity}
                        onChange={(e) => setCurrentCity(e.target.value)}
                        placeholder="e.g. Riyadh, Jubail"
                        className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Exp. Years *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={experienceYears}
                          onChange={(e) => setExperienceYears(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Exp Salary *</label>
                        <input
                          type="number"
                          required
                          min="0"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          placeholder="SAR / Mon"
                          className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Cover Note / Message</label>
                    <textarea
                      rows={3}
                      value={coverMessage}
                      onChange={(e) => setCoverMessage(e.target.value)}
                      placeholder="Brief description of your expertise, certificates held (e.g., NEBOSH IGC, Aramco approvals, etc.)"
                      className="w-full rounded-lg border border-slate-200 py-2.5 px-3 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                    />
                  </div>

                  {/* File Upload section */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Attach CV / Resume (PDF or Word) *</label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-500 rounded-xl p-4 text-center cursor-pointer relative bg-slate-50 transition">
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setCvFile(e.target.files[0]);
                          }
                        }}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      <div className="flex flex-col items-center justify-center">
                        <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
                        {cvFile ? (
                          <div className="flex items-center gap-1.5 text-xs text-blue-700 font-bold bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="truncate max-w-[200px]">{cvFile.name}</span>
                          </div>
                        ) : (
                          <>
                            <p className="text-xs text-slate-700 font-bold">Click or drag file here to upload</p>
                            <p className="text-[10px] text-slate-400 mt-1">Accepts PDF, DOCX, DOC (Max 5MB)</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsApplyModalOpen(false);
                        setErrorMsg('');
                      }}
                      className="rounded-xl border border-slate-200 py-2.5 px-4 text-xs font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-black py-2.5 px-6 text-xs shadow-sm transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          <span>Uploading CV...</span>
                        </>
                      ) : (
                        <span>Submit Application</span>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
