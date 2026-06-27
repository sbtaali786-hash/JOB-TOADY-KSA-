/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Calendar, Award, Clock, ChevronRight } from 'lucide-react';
import { Job } from '../types';
import AdsterraBanner from './AdsterraBanner';

interface HomeViewProps {
  jobs: Job[];
  onNavigate: (page: string, data?: any) => void;
  onSearch: (filters: { title: string; category: string; location: string }) => void;
}

export default function HomeView({ jobs, onNavigate, onSearch }: HomeViewProps) {
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);

  // Filter and sort only active jobs
  const activeJobs = jobs.filter(j => j.status === 'active');

  // Sort by newest first
  const sortedJobs = [...activeJobs].sort((a, b) => {
    const dateA = new Date(a.posted_at || 0).getTime();
    const dateB = new Date(b.posted_at || 0).getTime();
    return dateB - dateA;
  });

  // Filter in real-time
  const filteredJobs = sortedJobs.filter(job => {
    const matchesTitle = 
      job.title.toLowerCase().includes(searchTitle.toLowerCase()) || 
      job.company.toLowerCase().includes(searchTitle.toLowerCase()) ||
      (job.short_description && job.short_description.toLowerCase().includes(searchTitle.toLowerCase()));
    
    const matchesCategory = searchCategory === '' ? true : job.category === searchCategory;
    
    const matchesLocation = 
      searchLocation === '' ? true : job.location.toLowerCase().includes(searchLocation.toLowerCase());

    return matchesTitle && matchesCategory && matchesLocation;
  });

  // Unique categories for the dropdown
  const categories = Array.from(new Set(activeJobs.map(j => j.category).filter(Boolean)));
  
  // Unique locations for the dropdown / autocompletion suggestions
  const locations = Array.from(new Set(activeJobs.map(j => {
    // extract city name e.g. "Riyadh, Saudi Arabia" -> "Riyadh"
    return j.location.split(',')[0].trim();
  }).filter(Boolean)));

  const formatSAR = (val: string) => {
    return val.toLowerCase().includes('sar') ? val : `SAR ${val}`;
  };

  const handleJobClick = (job: Job) => {
    try {
      window.open('https://undergocutlery.com/hm7cfikbt?key=130ae9f2d618184b943d9986130a2181', '_blank');
    } catch (err) {
      console.warn('Popup blocked:', err);
    }
    onNavigate('job-details', job);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      
      {/* Indeed/LinkedIn style Top Search Bar Container */}
      <section className="bg-white border-b border-slate-200 py-10 shadow-sm">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="mb-6">
            <h1 className="text-3xl font-black text-slate-950 tracking-tight sm:text-4xl">
              Find Your Next Job in Saudi Arabia
            </h1>
            <p className="text-sm text-slate-500 mt-2 font-medium">
              JOB TODAY KSA • Premium Professional Recruitment & Manpower Services
            </p>
          </div>

          {/* Search form wrapper (no submit button needed as it filters in real time) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-lg grid grid-cols-1 gap-3 sm:grid-cols-3">
            
            {/* Title / Keywords Search */}
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Job title, keywords, or company"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Category selection */}
            <div className="relative flex items-center">
              <Briefcase className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <select
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="">All Job Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Location selection */}
            <div className="relative flex items-center">
              <MapPin className="absolute left-3.5 h-4 w-4 text-slate-400" />
              <select
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full rounded-xl bg-slate-50 border border-slate-200 py-3 pl-10 pr-4 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition appearance-none cursor-pointer"
              >
                <option value="">All Locations</option>
                {locations.map((loc, i) => (
                  <option key={i} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

          </div>
        </div>
      </section>

      {/* Adsterra Sponsored Ad Placement under Header */}
      <div className="mt-4">
        <AdsterraBanner />
      </div>

      {/* Latest Jobs Container */}
      <section className="mx-auto max-w-4xl px-4 mt-8">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Latest Jobs</h2>
            <p className="text-xs text-slate-500 mt-1">Showing {filteredJobs.length} matching jobs</p>
          </div>
          {searchTitle || searchCategory || searchLocation ? (
            <button
              onClick={() => {
                setSearchTitle('');
                setSearchCategory('');
                setSearchLocation('');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              Clear Filters
            </button>
          ) : null}
        </div>

        {/* Jobs list */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-slate-300 mb-3" />
            <p className="text-slate-800 font-bold text-base">No vacancies found matching your search</p>
            <p className="text-slate-500 text-xs mt-1">Try adjusting your keywords, location or category parameters.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.slice(0, visibleCount).map((job) => (
              <div
                key={job.id}
                onClick={() => handleJobClick(job)}
                className="group cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-150 relative overflow-hidden"
              >
                {job.is_urgent && (
                  <div className="absolute top-0 right-0 bg-red-600 text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-sm">
                    Urgent
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                  <div>
                    {/* Job Title */}
                    <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-blue-600 group-hover:underline leading-snug">
                      {job.title}
                    </h3>
                    
                    {/* Company Name */}
                    <p className="text-sm font-semibold text-slate-600 mt-0.5">{job.company}</p>

                    {/* Meta info row */}
                    <div className="mt-4 flex flex-wrap gap-y-2 gap-x-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{job.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{job.experience || '3+ Years Required'}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>{job.job_type}</span>
                      </span>
                    </div>

                    {/* Salary badge & Short description */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-bold text-blue-700 border border-blue-100">
                        {formatSAR(job.salary)}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {job.short_description}
                    </p>
                  </div>

                  {/* Apply / View Button on the right (desktop) or bottom (mobile) */}
                  <div className="md:self-center shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJobClick(job);
                      }}
                      className="w-full md:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-5 py-2.5 text-xs tracking-wide shadow-sm transition duration-150 cursor-pointer block text-center"
                    >
                      Apply Now
                    </button>
                    <p className="text-[10px] text-slate-400 text-center mt-1.5 font-medium flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(job.posted_at || '').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </p>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Load More Button */}
        {filteredJobs.length > visibleCount && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 5)}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-6 py-3 text-xs font-extrabold text-slate-700 shadow-sm transition cursor-pointer"
            >
              <span>Load More Jobs</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </section>
    </div>
  );
}
