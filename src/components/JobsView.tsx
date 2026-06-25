/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Filter, Calendar, DollarSign, X, MessageSquare } from 'lucide-react';
import { Job } from '../types';

interface JobsViewProps {
  jobs: Job[];
  onNavigate: (page: string, data?: any) => void;
  initialFilters: { title: string; category: string; location: string };
  onClearInitialFilters: () => void;
}

export default function JobsView({ jobs, onNavigate, initialFilters, onClearInitialFilters }: JobsViewProps) {
  const [searchTerm, setSearchTerm] = useState(initialFilters.title || '');
  const [categoryFilter, setCategoryFilter] = useState(initialFilters.category || '');
  const [locationFilter, setLocationFilter] = useState(initialFilters.location || '');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');

  // Sync initial filters if updated by parent
  useEffect(() => {
    if (initialFilters.title !== undefined) setSearchTerm(initialFilters.title);
    if (initialFilters.category !== undefined) setCategoryFilter(initialFilters.category);
    if (initialFilters.location !== undefined) setLocationFilter(initialFilters.location);
  }, [initialFilters]);

  const activeJobs = jobs.filter(j => j.status === 'active');

  // Filter logic
  const filteredJobs = activeJobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.short_description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? job.category === categoryFilter : true;
    
    const matchesLocation = locationFilter ? job.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    
    const matchesJobType = jobTypeFilter ? job.job_type === jobTypeFilter : true;

    // Custom rough salary filter based on text extraction
    let matchesSalary = true;
    if (salaryFilter) {
      const salaryNum = parseInt(job.salary.replace(/[^0-9]/g, ''), 10) || 0;
      if (salaryFilter === 'under_5k') {
        matchesSalary = salaryNum < 5000;
      } else if (salaryFilter === '5k_to_10k') {
        matchesSalary = salaryNum >= 5000 && salaryNum <= 10000;
      } else if (salaryFilter === 'over_10k') {
        matchesSalary = salaryNum > 10000;
      }
    }

    return matchesSearch && matchesCategory && matchesLocation && matchesJobType && matchesSalary;
  });

  const clearAllFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setLocationFilter('');
    setJobTypeFilter('');
    setSalaryFilter('');
    onClearInitialFilters();
  };

  const categories = Array.from(new Set(activeJobs.map(j => j.category)));
  const locations = Array.from(new Set(activeJobs.map(j => j.location.split(',')[0])));

  const formatSAR = (val: string) => {
    return val.includes('SAR') ? val : `SAR ${val}`;
  };

  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 py-8">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Title */}
        <div className="mb-8 text-center md:text-left">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1">Explore Openings</span>
          <h1 className="text-2xl font-bold text-slate-850 tracking-tight sm:text-3xl">
            Available Positions in Saudi Arabia
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Filter and apply for verified vacancies in HSE, Engineering, Administration, and Trades.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Sidebar Filters - styled as Bento grid sidebar element */}
          <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <span className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                <Filter className="h-4 w-4 text-blue-600" />
                <span>Filter Vacancies</span>
              </span>
              {(searchTerm || categoryFilter || locationFilter || jobTypeFilter || salaryFilter) && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800 transition flex items-center gap-0.5"
                >
                  <X className="h-3 w-3" />
                  Clear
                </button>
              )}
            </div>

            <div className="space-y-6">
              {/* Search Term */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Search Keyword</label>
                <div className="relative">
                  <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Keyword, role, skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Category</label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat, i) => (
                    <option key={i} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Location</label>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">All Regions</option>
                  <option value="Riyadh">Riyadh Region</option>
                  <option value="Jubail">Jubail Industrial</option>
                  <option value="Dammam">Dammam / Eastern</option>
                  <option value="Jeddah">Jeddah</option>
                  <option value="NEOM">NEOM</option>
                  <option value="Yanbu">Yanbu</option>
                  <option value="Khobar">Khobar</option>
                </select>
              </div>

              {/* Job Type Toggle */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Job Type</label>
                <div className="flex flex-col space-y-1.5">
                  {['', 'Full-time', 'Contract', 'Part-time'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setJobTypeFilter(type)}
                      className={`text-left text-xs py-1.5 px-3 rounded-lg transition font-medium ${
                        jobTypeFilter === type
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {type === '' ? 'All Job Types' : type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Salary Range Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Salary Expectation</label>
                <select
                  value={salaryFilter}
                  onChange={(e) => setSalaryFilter(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-blue-500 bg-white"
                >
                  <option value="">All Ranges</option>
                  <option value="under_5k">Under SAR 5,000</option>
                  <option value="5k_to_10k">SAR 5,000 - 10,000</option>
                  <option value="over_10k">Above SAR 10,000</option>
                </select>
              </div>
            </div>
          </div>

          {/* Jobs Main List Panel */}
          <div className="lg:col-span-8">
            {/* Header Row */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Showing {filteredJobs.length} Vacanc{filteredJobs.length === 1 ? 'y' : 'ies'}
              </span>
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
                <div className="flex justify-center mb-4">
                  <Briefcase className="h-12 w-12 text-slate-300" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No Jobs Found Matching Search</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Try widening your filters, clearing keywords, or search other regions in Saudi Arabia.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6 group"
                  >
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                          {job.category}
                        </span>
                        {job.featured && (
                          <span className="rounded bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                            Featured
                          </span>
                        )}
                        <span className="text-[11px] font-medium text-slate-400">
                          • {job.job_type}
                        </span>
                      </div>

                      <h2 
                        className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition cursor-pointer" 
                        onClick={() => onNavigate('job-details', job)}
                      >
                        {job.title}
                      </h2>
                      
                      <p className="text-xs text-slate-400 mt-0.5">{job.company}</p>

                      <p className="mt-3 text-xs text-slate-500 leading-relaxed max-w-xl">
                        {job.short_description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1 text-blue-600 font-semibold">
                          <DollarSign className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                          <span>{formatSAR(job.salary)}</span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>Deadline: {job.deadline}</span>
                        </span>
                      </div>
                    </div>

                    {/* Buttons Row */}
                    <div className="shrink-0 sm:w-36 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex items-center justify-end">
                      <button
                        onClick={() => onNavigate('job-details', job)}
                        className="w-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 text-center text-xs font-bold shadow-sm transition cursor-pointer"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
