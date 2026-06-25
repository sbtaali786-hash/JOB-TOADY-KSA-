/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Shield, Users, Trophy, ChevronRight, MessageSquare, Building2, CheckCircle2 } from 'lucide-react';
import { Job } from '../types';

interface HomeViewProps {
  jobs: Job[];
  onNavigate: (page: string, data?: any) => void;
  onSearch: (filters: { title: string; category: string; location: string }) => void;
}

export default function HomeView({ jobs, onNavigate, onSearch }: HomeViewProps) {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // Get active and featured jobs
  const featuredJobs = jobs.filter(j => j.featured && j.status === 'active').slice(0, 6);

  // Hardcoded categories for easy access
  const categories = [
    { name: 'Safety & HSE', count: jobs.filter(j => j.category === 'Safety & HSE' && j.status === 'active').length, icon: Shield, bg: 'bg-blue-50 text-blue-600' },
    { name: 'Technical & Engineering', count: jobs.filter(j => j.category === 'Technical & Engineering' && j.status === 'active').length, icon: Briefcase, bg: 'bg-amber-50 text-amber-600' },
    { name: 'Admin & Office', count: jobs.filter(j => j.category === 'Admin & Office' && j.status === 'active').length, icon: Building2, bg: 'bg-emerald-50 text-emerald-600' },
    { name: 'Trades & Labor', count: jobs.filter(j => j.category === 'Trades & Labor' && j.status === 'active').length, icon: Users, bg: 'bg-purple-50 text-purple-600' },
  ];

  const handleFormSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ title: searchTitle, category: searchCategory, location: searchLocation });
    onNavigate('jobs');
  };

  const handleCategoryClick = (catName: string) => {
    onSearch({ title: '', category: catName, location: '' });
    onNavigate('jobs');
  };

  const formatSAR = (val: string) => {
    return val.includes('SAR') ? val : `SAR ${val}`;
  };

  return (
    <div className="bg-gray-50/50">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-blue-950 py-20 text-white md:py-28">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
          <div className="max-w-3xl text-center md:text-left">
            <span className="inline-block rounded-full bg-blue-900/80 px-4 py-1 text-xs font-bold uppercase tracking-wider text-blue-300 border border-blue-800/30 mb-4">
              Your Gateway to Saudi Arabia Recruitment
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
              Professional Staffing & <br className="hidden md:inline" />
              <span className="text-blue-400">HSE Manpower Solutions</span>
            </h1>
            <p className="mt-4 text-base text-gray-300 md:text-lg">
              JOB TODAY KSA supplies verified, certified safety and technical talent across Riyadh, Jubail, Jeddah, NEOM, and Dammam. Start your career or scale your workforce with KSA's trusted recruitment partner.
            </p>
            
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-4">
              <button 
                onClick={() => onNavigate('jobs')}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-bold shadow-lg shadow-blue-900/40 hover:bg-blue-500 transition-all duration-150"
              >
                Browse KSA Jobs
              </button>
              <button 
                onClick={() => onNavigate('employers')}
                className="rounded-lg border border-gray-700 bg-blue-900/30 px-6 py-3 text-sm font-bold text-gray-200 hover:bg-blue-900/60 hover:text-white transition"
              >
                Hire Certified Staff
              </button>
              <a 
                href="https://wa.me/966508202459"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold hover:bg-emerald-500 transition"
              >
                <MessageSquare className="h-4 w-4" />
                <span>WhatsApp Recruiting Desk</span>
              </a>
            </div>
          </div>

          {/* Search Box Card */}
          <div className="mt-12 rounded-2xl border border-gray-800 bg-blue-900/20 p-6 backdrop-blur-md">
            <form onSubmit={handleFormSearch} className="grid grid-cols-1 gap-4 sm:grid-cols-4">
              <div className="relative">
                <Search className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Job Title (e.g. HSE Officer)"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-800 py-3 px-4 text-sm text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Job Categories</option>
                  <option value="Safety & HSE">Safety & HSE</option>
                  <option value="Technical & Engineering">Technical & Engineering</option>
                  <option value="Admin & Office">Admin & Office</option>
                  <option value="Trades & Labor">Trades & Labor</option>
                </select>
              </div>
              <div className="relative">
                <MapPin className="absolute top-3.5 left-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Location (e.g. Riyadh)"
                  value={searchLocation}
                  onChange={(e) => setSearchLocation(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/60 border border-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md hover:bg-blue-500 transition"
              >
                Find Jobs Now
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 text-center">
            <div>
              <p className="text-3xl font-extrabold text-blue-900 md:text-4xl">15+</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Pre-Seeded Roles</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-900 md:text-4xl">4+</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Key Disciplines</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-900 md:text-4xl">100%</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">KSA Labor Compliant</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-900 md:text-4xl">24/7</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mt-1">Support Available</p>
            </div>
          </div>
        </div>
      </section>

      {/* Job Categories Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight">Search by Industry Sectors</h2>
            <p className="mt-2 text-sm text-gray-600">Discover active vacancies tailored for key industrial and business developments</p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((cat, idx) => {
              const IconComp = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="group cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:border-blue-500 hover:shadow-md transition duration-150"
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${cat.bg} mb-4 font-bold group-hover:scale-105 transition`}>
                    <IconComp className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900">{cat.name}</h3>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{cat.count} Active Openings</span>
                    <span className="flex items-center text-blue-600 font-bold group-hover:translate-x-1 transition duration-150">
                      Explore <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="bg-white py-16 border-y border-gray-100">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Immediate Hiring</span>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight mt-1">Featured Hot Openings</h2>
            </div>
            <button 
              onClick={() => onNavigate('jobs')}
              className="mt-4 sm:mt-0 flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline transition"
            >
              Browse All Jobs ({jobs.length}) <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredJobs.map((job) => (
              <div 
                key={job.id} 
                className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition-all border-l-4 border-l-blue-600"
              >
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {job.category}
                  </span>
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                    {job.job_type}
                  </span>
                </div>
                
                <h3 className="mt-4 text-base font-bold text-blue-950 line-clamp-1">
                  {job.title}
                </h3>
                
                <p className="text-xs font-semibold text-gray-500 mt-0.5">{job.company}</p>

                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                    <span className="font-semibold text-blue-900">{formatSAR(job.salary)}</span>
                  </div>
                </div>

                <p className="mt-4 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {job.short_description}
                </p>

                <div className="mt-6 pt-4 border-t border-gray-50">
                  <button
                    onClick={() => onNavigate('job-details', job)}
                    className="w-full block rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-center text-xs font-bold shadow-sm transition cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            
            {/* Visuals column */}
            <div className="relative">
              <div className="rounded-2xl bg-blue-900 p-8 text-white shadow-xl md:p-10">
                <h3 className="text-xl font-bold uppercase tracking-wider text-blue-300">JOB TODAY KSA</h3>
                <p className="mt-4 text-sm text-gray-200 leading-relaxed">
                  Established with a commitment to assist Saudi Arabia's massive vision projects (NEOM, Aramco Expansions, Municipal projects), JOB TODAY KSA handles end-to-end recruitment pipelines, certifying safety and engineering supervisors so companies can minimize compliance risks and execute timelines seamlessly.
                </p>
                <div className="mt-8 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded bg-blue-800 p-1 text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Certified Professionals Only</h4>
                      <p className="text-xs text-gray-300">Every safety manager, HSE engineer, or receiver holds accredited NEOM/Aramco approvals.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded bg-blue-800 p-1 text-emerald-400 shrink-0 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Compliant Mobilization</h4>
                      <p className="text-xs text-gray-300">Full sponsorship transfer compliance under KSA Qiwa and Ajeer systems.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Corporate Safety Supplier</span>
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl tracking-tight mt-1">Why Corporate Clients Choose Us</h2>
              <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                Finding qualified industrial personnel who understand rigorous Saudi safety standards is challenging. JOB TODAY KSA bridges this gap by acting as a specialized agency with pre-screened talent ready for rapid mobilization.
              </p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Zero-Harm Orientation</h4>
                    <p className="text-xs text-gray-500 mt-1">Our candidates focus strictly on OSHA/NEBOSH guidelines to minimize accidents.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600 shrink-0">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Elite Talent Directory</h4>
                    <p className="text-xs text-gray-500 mt-1">Direct reach into Aramco, SABIC, and Royal Commission-experienced staff networks.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="bg-blue-600 py-16 text-white text-center">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl font-extrabold tracking-tight">Need Skilled Manpower In KSA?</h2>
          <p className="mt-4 text-base text-blue-100 max-w-xl mx-auto">
            Contact JOB TODAY KSA today to hire HSE Officers, Supervisors, Electricians, or Site Engineers for your upcoming projects.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => onNavigate('contact')}
              className="rounded-lg bg-white px-6 py-3 text-sm font-bold text-blue-900 shadow hover:bg-gray-100 transition"
            >
              Contact SBT Office
            </button>
            <a 
              href="https://wa.me/966508202459"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-sm font-bold text-white hover:bg-emerald-500 transition shadow-lg"
            >
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp Direct Hire</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
