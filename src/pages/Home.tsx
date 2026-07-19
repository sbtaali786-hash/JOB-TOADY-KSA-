import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Job } from '../lib/supabase';

/* ---------- Adsterra Native Banner (inline, one instance per page) ---------- */
const ADSTERRA_CONTAINER_ID = 'container-a73bfcc22984758c5363c728bdb709b6';
const ADSTERRA_SCRIPT_SRC = 'https://undergocutlery.com/a73bfcc22984758c5363c728bdb709b6/invoke.js';

function AdsterraNative() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const target = document.createElement('div');
    target.id = ADSTERRA_CONTAINER_ID;
    wrapper.innerHTML = '';
    wrapper.appendChild(target);

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = 'false';
    script.src = ADSTERRA_SCRIPT_SRC;
    wrapper.appendChild(script);

    return () => {
      wrapper.innerHTML = '';
    };
  }, []);

  return <div ref={wrapperRef} className="ad-slot ad-slot-native" />;
}

/* ---------- Job Card ---------- */
function JobCard({ job }: { job: Job }) {
  const salaryText =
    job.salary_min && job.salary_max
      ? `${job.currency} ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}`
      : job.salary_min
      ? `${job.currency} ${job.salary_min.toLocaleString()}+`
      : 'Salary not disclosed';

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-top">
        <h3>{job.title}</h3>
        <span className="job-type-badge">{job.job_type}</span>
      </div>
      <p className="job-company">{job.company}</p>
      <div className="job-meta">
        <span>📍 {job.city ? `${job.city}, ` : ''}{job.country}</span>
        {job.category && <span>🏷 {job.category}</span>}
      </div>
      <div className="job-card-bottom">
        <span className="job-salary">{salaryText}</span>
        <span className="job-date">
          {new Date(job.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>
    </Link>
  );
}

/* ---------- Home Page ---------- */
export default function Home() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      if (!error && data) setJobs(data as Job[]);
      setLoading(false);
    };
    loadJobs();
  }, []);

  const filtered = jobs.filter((j) => {
    const matchesSearch =
      !search ||
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !category || j.category === category;
    const matchesCity = !city || j.city === city;
    return matchesSearch && matchesCategory && matchesCity;
  });

  const categories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean))) as string[];
  const cities = Array.from(new Set(jobs.map((j) => j.city).filter(Boolean))) as string[];

  return (
    <div className="page">
      <section className="hero">
        <h1>Find Your Next Job in Saudi Arabia</h1>
        <p>Latest verified job vacancies across KSA — updated daily</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search job title or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </section>

      <AdsterraNative />

      <div className="filters">
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">All Cities</option>
          {cities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="page-loading">Loading jobs…</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">No jobs found. Try a different search, or check back soon.</div>
      ) : (
        <div className="job-grid">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
