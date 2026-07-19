import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

/* ================= Admin Dashboard ================= */
export function AdminDashboard() {
  const [stats, setStats] = useState({ jobs: 0, applicants: 0, applications: 0 });

  useEffect(() => {
    const load = async () => {
      const [{ count: jobs }, { count: applicants }, { count: applications }] = await Promise.all([
        supabase.from('jobs').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('applications').select('*', { count: 'exact', head: true }),
      ]);
      setStats({ jobs: jobs || 0, applicants: applicants || 0, applications: applications || 0 });
    };
    load();
  }, []);

  return (
    <div className="page admin-page">
      <h1>Admin Dashboard</h1>

      <div className="admin-stats">
        <div className="admin-stat-card">
          <span className="admin-stat-number">{stats.jobs}</span>
          <span className="admin-stat-label">Total Jobs</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-number">{stats.applicants}</span>
          <span className="admin-stat-label">Registered Users</span>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-number">{stats.applications}</span>
          <span className="admin-stat-label">Applications</span>
        </div>
      </div>

      <div className="admin-quick-links">
        <Link to="/admin/jobs" className="btn btn-primary">Manage Jobs</Link>
        <Link to="/admin/jobs/new" className="btn btn-secondary">+ Add New Job</Link>
        <Link to="/admin/bulk-upload" className="btn btn-secondary">Bulk Upload Jobs</Link>
        <Link to="/admin/applicants" className="btn btn-secondary">View Applicants / CVs</Link>
      </div>
    </div>
  );
}

/* ================= Admin Jobs List ================= */
export function AdminJobs() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    setLoading(true);
    const { data } = await supabase.from('jobs').select('*').order('created_at', { ascending: false });
    setJobs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const toggleActive = async (job: any) => {
    await supabase.from('jobs').update({ is_active: !job.is_active }).eq('id', job.id);
    loadJobs();
  };

  const deleteJob = async (id: string) => {
    if (!confirm('Delete this job permanently?')) return;
    await supabase.from('jobs').delete().eq('id', id);
    loadJobs();
  };

  return (
    <div className="page admin-page">
      <div className="admin-page-header">
        <h1>Manage Jobs</h1>
        <div>
          <Link to="/admin/bulk-upload" className="btn btn-secondary">Bulk Upload</Link>
          <Link to="/admin/jobs/new" className="btn btn-primary">+ New Job</Link>
        </div>
      </div>

      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Company</th>
              <th>City</th>
              <th>Status</th>
              <th>Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.company}</td>
                <td>{job.city || '-'}</td>
                <td>
                  <span className={`status-badge ${job.is_active ? 'active' : 'inactive'}`}>
                    {job.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td>{new Date(job.created_at).toLocaleDateString()}</td>
                <td className="admin-table-actions">
                  <Link to={`/admin/jobs/${job.id}/edit`}>Edit</Link>
                  <button onClick={() => toggleActive(job)}>
                    {job.is_active ? 'Hide' : 'Show'}
                  </button>
                  <button className="danger" onClick={() => deleteJob(job.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ================= Admin Job Add/Edit Form ================= */
const emptyForm = {
  title: '', company: '', category: '', city: '', country: 'Saudi Arabia',
  salary_min: '', salary_max: '', currency: 'SAR', job_type: 'Full-time',
  description: '', requirements: '', contact_email: '', contact_phone: '',
};

export function AdminJobForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      const { data } = await supabase.from('jobs').select('*').eq('id', id).single();
      if (data) {
        setForm({
          title: data.title || '', company: data.company || '', category: data.category || '',
          city: data.city || '', country: data.country || 'Saudi Arabia',
          salary_min: data.salary_min?.toString() || '', salary_max: data.salary_max?.toString() || '',
          currency: data.currency || 'SAR', job_type: data.job_type || 'Full-time',
          description: data.description || '', requirements: data.requirements || '',
          contact_email: data.contact_email || '', contact_phone: data.contact_phone || '',
        });
      }
    };
    load();
  }, [id, isEdit]);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const payload = {
      ...form,
      salary_min: form.salary_min ? Number(form.salary_min) : null,
      salary_max: form.salary_max ? Number(form.salary_max) : null,
      posted_by: user?.id,
    };
    if (isEdit) {
      await supabase.from('jobs').update(payload).eq('id', id);
    } else {
      await supabase.from('jobs').insert(payload);
    }
    setSaving(false);
    navigate('/admin/jobs');
  };

  return (
    <div className="page admin-page">
      <h1>{isEdit ? 'Edit Job' : 'Add New Job'}</h1>
      <form className="admin-form" onSubmit={handleSubmit}>
        <label>Job Title *</label>
        <input required value={form.title} onChange={(e) => handleChange('title', e.target.value)} />

        <label>Company Name *</label>
        <input required value={form.company} onChange={(e) => handleChange('company', e.target.value)} />

        <div className="form-row">
          <div>
            <label>Category</label>
            <input value={form.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="e.g. Construction, IT, Driving" />
          </div>
          <div>
            <label>Job Type</label>
            <select value={form.job_type} onChange={(e) => handleChange('job_type', e.target.value)}>
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>City</label>
            <input value={form.city} onChange={(e) => handleChange('city', e.target.value)} placeholder="Riyadh, Jeddah..." />
          </div>
          <div>
            <label>Country</label>
            <input value={form.country} onChange={(e) => handleChange('country', e.target.value)} />
          </div>
        </div>

        <div className="form-row">
          <div>
            <label>Salary Min</label>
            <input type="number" value={form.salary_min} onChange={(e) => handleChange('salary_min', e.target.value)} />
          </div>
          <div>
            <label>Salary Max</label>
            <input type="number" value={form.salary_max} onChange={(e) => handleChange('salary_max', e.target.value)} />
          </div>
          <div>
            <label>Currency</label>
            <input value={form.currency} onChange={(e) => handleChange('currency', e.target.value)} />
          </div>
        </div>

        <label>Description</label>
        <textarea rows={5} value={form.description} onChange={(e) => handleChange('description', e.target.value)} />

        <label>Requirements</label>
        <textarea rows={4} value={form.requirements} onChange={(e) => handleChange('requirements', e.target.value)} />

        <div className="form-row">
          <div>
            <label>Contact Email</label>
            <input type="email" value={form.contact_email} onChange={(e) => handleChange('contact_email', e.target.value)} />
          </div>
          <div>
            <label>Contact Phone</label>
            <input value={form.contact_phone} onChange={(e) => handleChange('contact_phone', e.target.value)} />
          </div>
        </div>

        <button className="btn btn-primary" disabled={saving}>
          {saving ? 'Saving…' : isEdit ? 'Update Job' : 'Publish Job'}
        </button>
      </form>
    </div>
  );
}

/* ================= Bulk Upload ================= */
export function AdminBulkUpload() {
  const { user } = useAuth();
  const [rows, setRows] = useState<any[]>([]);
  const [fileName, setFileName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult('');
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        setRows(results.data.filter((r: any) => r.title && r.company));
      },
    });
  };

  const handleUploadAll = async () => {
    if (!rows.length) return;
    setUploading(true);
    const payload = rows.map((r) => ({
      title: r.title, company: r.company, category: r.category || null, city: r.city || null,
      country: r.country || 'Saudi Arabia',
      salary_min: r.salary_min ? Number(r.salary_min) : null,
      salary_max: r.salary_max ? Number(r.salary_max) : null,
      currency: r.currency || 'SAR', job_type: r.job_type || 'Full-time',
      description: r.description || null, requirements: r.requirements || null,
      contact_email: r.contact_email || null, contact_phone: r.contact_phone || null,
      posted_by: user?.id,
    }));
    const { error } = await supabase.from('jobs').insert(payload);
    setUploading(false);
    if (error) {
      setResult(`Failed: ${error.message}`);
    } else {
      setResult(`Success! ${payload.length} jobs uploaded.`);
      setRows([]);
      setFileName('');
    }
  };

  const downloadTemplate = () => {
    const header = 'title,company,category,city,country,salary_min,salary_max,currency,job_type,description,requirements,contact_email,contact_phone\n';
    const example = 'Site Supervisor,Al Rashid Construction,Construction,Riyadh,Saudi Arabia,4000,6000,SAR,Full-time,"Oversee daily site operations","3+ years experience, valid Iqama",hr@example.com,+966500000000\n';
    const blob = new Blob([header + example], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobs-bulk-upload-template.csv';
    a.click();
  };

  return (
    <div className="page admin-page">
      <h1>Bulk Upload Jobs</h1>
      <p className="auth-subtitle">Upload a CSV file to add many jobs at once.</p>

      <button className="btn btn-secondary" onClick={downloadTemplate}>⬇ Download CSV Template</button>

      <div className="bulk-upload-box">
        <label className="btn btn-primary">
          Choose CSV File
          <input type="file" accept=".csv" onChange={handleFile} hidden />
        </label>
        {fileName && <span className="bulk-filename">{fileName}</span>}
      </div>

      {result && <div className="notice">{result}</div>}

      {rows.length > 0 && (
        <>
          <h2>Preview ({rows.length} jobs found)</h2>
          <table className="admin-table">
            <thead>
              <tr><th>Title</th><th>Company</th><th>City</th><th>Salary</th></tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((r, i) => (
                <tr key={i}>
                  <td>{r.title}</td><td>{r.company}</td><td>{r.city}</td>
                  <td>{r.salary_min} - {r.salary_max} {r.currency}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length > 10 && <p>...and {rows.length - 10} more</p>}
          <button className="btn btn-primary" onClick={handleUploadAll} disabled={uploading}>
            {uploading ? 'Uploading…' : `Confirm & Upload ${rows.length} Jobs`}
          </button>
        </>
      )}
    </div>
  );
}

/* ================= Applicants / CVs ================= */
export function AdminApplicants() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, phone, city, nationality, cv_url, cv_filename, created_at')
        .order('created_at', { ascending: false });
      setUsers(data || []);
      setLoading(false);
    };
    load();
  }, []);

  const downloadCv = async (path: string, filename: string) => {
    const { data } = await supabase.storage.from('cvs').createSignedUrl(path, 60);
    if (data?.signedUrl) {
      const a = document.createElement('a');
      a.href = data.signedUrl;
      a.download = filename;
      a.target = '_blank';
      a.click();
    }
  };

  return (
    <div className="page admin-page">
      <h1>Registered Users & CVs</h1>
      {loading ? (
        <div className="page-loading">Loading…</div>
      ) : (
        <table className="admin-table">
          <thead>
            <tr><th>Name</th><th>Phone</th><th>City</th><th>Nationality</th><th>Joined</th><th>CV</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.full_name || '-'}</td>
                <td>{u.phone || '-'}</td>
                <td>{u.city || '-'}</td>
                <td>{u.nationality || '-'}</td>
                <td>{new Date(u.created_at).toLocaleDateString()}</td>
                <td>
                  {u.cv_url ? (
                    <button onClick={() => downloadCv(u.cv_url, u.cv_filename || 'cv.pdf')}>Download</button>
                  ) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
                  }
