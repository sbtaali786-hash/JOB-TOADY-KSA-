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
  AlertCircle
} from 'lucide-react';
import { Job } from '../types';

interface JobDetailsViewProps {
  job: Job;
  allJobs: Job[];
  onNavigate: (page: string, data?: any) => void;
}

export default function JobDetailsView({ job, allJobs, onNavigate }: JobDetailsViewProps) {
  const [copied, setCopied] = useState(false);

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

  const getEmailUrl = (email: string | undefined, title: string) => {
    const targetEmail = email || 'sbtservices7@sbtcabin.com';
    const subject = encodeURIComponent(`Direct Inquiry: ${title} Position`);
    const body = encodeURIComponent(`Dear Recruitment Desk,\n\nI am contacting you regarding the "${title}" vacancy posted on JOB TODAY KSA.\n\nPlease find my request to connect for direct screening.\n\nBest regards.`);
    return `mailto:${targetEmail}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Back button */}
      <button
        onClick={() => onNavigate('jobs')}
        className="mb-6 flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-900 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to Job Search</span>
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        
        {/* Main Job details column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700">
                  {job.category}
                </span>
                <span className="rounded bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-600">
                  {job.job_type}
                </span>
              </div>
              
              {job.is_urgent && (
                <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-100 px-2.5 py-0.5 text-[10px] font-extrabold text-red-600 uppercase tracking-wider animate-pulse">
                  <AlertCircle className="h-3 w-3" />
                  Urgent Hire
                </span>
              )}
            </div>

            <h1 className="text-2xl font-extrabold text-blue-950 sm:text-3xl tracking-tight leading-tight">
              {job.title}
            </h1>
            <p className="text-sm font-semibold text-blue-600 mt-1">{job.company}</p>

            {/* Quick Metadata */}
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-gray-50 pt-6 text-xs text-gray-600 font-medium sm:grid-cols-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Location</span>
                  <span className="text-gray-900">{job.location}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Salary SAR</span>
                  <span className="text-gray-900 font-bold text-blue-950">{formatSAR(job.salary)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Experience</span>
                  <span className="text-gray-900">{job.experience || '3+ Years'}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
                <div>
                  <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Posted Date</span>
                  <span className="text-gray-900">{new Date(job.posted_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8 space-y-6">
            <div>
              <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2 mb-3">
                <ClipboardCheck className="h-4 w-4 text-blue-600" />
                <span>Job Overview & Purpose</span>
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Conditions Section (Duty Hours, Accommodation, Transportation, Food) */}
            <div className="border-t border-gray-50 pt-6">
              <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2 mb-4">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                <span>Working Conditions & Facility Details</span>
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duty Hours</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.duty_hours || '8 Hours / Day'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Accommodation</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.accommodation || 'Company Provided'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transportation</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.transportation || 'Company Provided'}</span>
                </div>
                <div className="bg-slate-50/70 rounded-xl p-3 border border-slate-100 text-center">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Food Facility</span>
                  <span className="text-xs font-bold text-slate-700 block mt-1">{job.food || 'Provided / Allowance'}</span>
                </div>
              </div>
            </div>

            {/* Requirements List */}
            {requirementsList.length > 0 && (
              <div className="border-t border-gray-50 pt-6">
                <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2 mb-3">
                  <Award className="h-4 w-4 text-blue-600" />
                  <span>Key Requirements & Certifications</span>
                </h2>
                <ul className="space-y-2.5 text-sm text-gray-600">
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
              <div className="border-t border-gray-50 pt-6">
                <h2 className="text-base font-extrabold text-blue-950 flex items-center gap-2 mb-3">
                  <Smile className="h-4 w-4 text-blue-600" />
                  <span>Benefits & Allowances</span>
                </h2>
                <ul className="space-y-2.5 text-sm text-gray-600">
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
          {/* Direct Contact Card (Instead of Apply Card) */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider text-center mb-1">Direct Recruitment Contact</h3>
            <p className="text-xs text-gray-500 text-center mb-5">Skip complex application forms. Contact the hiring desk immediately via WhatsApp, Call, or Email.</p>

            {/* Optional Contact Person */}
            {job.contact_person && (
              <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/30 text-center mb-4">
                <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-bold">Contact Person</span>
                <span className="text-xs font-extrabold text-blue-950 block mt-0.5">{job.contact_person}</span>
              </div>
            )}

            {/* 3 Contact Buttons */}
            <div className="space-y-2.5">
              {/* WhatsApp Button */}
              <a
                href={getWhatsAppUrl(job.whatsapp_number, job.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold py-3 shadow-md shadow-emerald-100 transition text-sm text-center"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Contact via WhatsApp</span>
              </a>

              {/* Call Phone Button */}
              <a
                href={getPhoneUrl(job.phone_number)}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold py-3 shadow-md shadow-blue-100 transition text-sm text-center"
              >
                <Phone className="h-4 w-4" />
                <span>Call Recruitment Desk</span>
              </a>

              {/* Email Contact Button */}
              <a
                href={getEmailUrl(job.email_address, job.title)}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-extrabold py-3 transition text-sm text-center"
              >
                <Mail className="h-4 w-4 text-slate-400" />
                <span>Inquire via Email</span>
              </a>
            </div>

            <button
              onClick={handleShare}
              className="w-full mt-4 rounded-xl border border-dashed border-gray-200 py-2.5 text-xs font-bold text-gray-500 hover:bg-gray-50 transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5 text-gray-400" />
              <span>{copied ? 'Link Copied!' : 'Share This Vacancy'}</span>
            </button>

            <div className="mt-5 pt-5 border-t border-gray-100 text-[11px] text-gray-400 text-center">
              <p>Apply Deadline: <strong className="text-gray-600">{job.deadline}</strong></p>
            </div>
          </div>

          {/* Related Jobs card list */}
          {relatedJobs.length > 0 && (
            <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="text-sm font-bold text-blue-950 uppercase tracking-wider border-b border-gray-100 pb-3 mb-4">
                Related Vacancies
              </h3>
              <div className="space-y-4">
                {relatedJobs.map((rJob) => (
                  <div
                    key={rJob.id}
                    onClick={() => onNavigate('job-details', rJob)}
                    className="group cursor-pointer border-b border-gray-50 pb-3 last:border-0 last:pb-0"
                  >
                    <h4 className="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-1">
                      {rJob.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{rJob.location}</p>
                    <p className="text-[11px] font-bold text-blue-600 mt-1">{formatSAR(rJob.salary)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
