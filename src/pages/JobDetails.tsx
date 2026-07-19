import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Job } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [applied, setApplied] = useState(false);
  const [applying, setApplying] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
      setJob(data as Job | null);

      if (user) {
        const { data: existing } = await supabase
          .from('applications')
          .select('id')
          .eq('job_id', id)
          .eq('applicant_id', user.id)
          .maybeSingle();
        setApplied(!!existing);
      }
    };
    load();
  }, [id, user]);

  const handleApply = async () => {
    if (!user) return;
    if (!profile?.cv_url) {
      setMessage('Please upload your CV in your profile before applying.');
      return;
    }
    setApplying(true);
    const { error } = await supabase
      .from('applications')
      .insert({ job_id: id, applicant_id: user.id });
    setApplying(false);
    if (error) {
      setMessage('Something went wrong. Please try again.');
    } else {
      setApplied(true);
      setMessage('Application submitted successfully!');
    }
  };

  if (!job) return <div className="page-loading">Loading…</div>;

  return (
    <div className="page job-details-page">
      <div className="job-details-card">
        <h1>{job.title}</h1>
        <p className="job-details-company">{job.company}</p>

        <div className="job-details-meta">
          <span>📍 {job.city ? `${job.city}, ` : ''}{job.country}</span>
          <span>💼 {job.job_type}</span>
          {job.category && <span>🏷 {job.category}</span>}
          <span>
            💰{' '}
            {job.salary_min
              ? `${job.currency} ${job.salary_min.toLocaleString()}${job.salary_max ? ` - ${job.salary_max.toLocaleString()}` : '+'}`
              : 'Not disclosed'}
          </span>
        </div>

        {job.description && (
          <section>
            <h2>Job Description</h2>
            <p className="job-details-text">{job.description}</p>
          </section>
        )}

        {job.requirements && (
          <section>
            <h2>Requirements</h2>
            <p className="job-details-text">{job.requirements}</p>
          </section>
        )}

        {message && <div className="notice">{message}</div>}

        {!user ? (
          <Link to="/login" className="btn btn-primary">Login to Apply</Link>
        ) : applied ? (
          <button className="btn btn-disabled" disabled>✓ Already Applied</button>
        ) : (
          <button className="btn btn-primary" onClick={handleApply} disabled={applying}>
            {applying ? 'Submitting…' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}
