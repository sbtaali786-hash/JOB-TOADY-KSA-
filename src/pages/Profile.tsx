import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [city, setCity] = useState(profile?.city || '');
  const [nationality, setNationality] = useState(profile?.nationality || '');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone, city, nationality })
      .eq('id', user.id);
    setSaving(false);
    if (!error) {
      setMessage('Profile updated.');
      refreshProfile();
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    const file = e.target.files[0];

    if (file.type !== 'application/pdf') {
      setMessage('Please upload a PDF file only.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage('File too large. Max size is 5MB.');
      return;
    }

    setUploading(true);
    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage.from('cvs').upload(filePath, file, {
      upsert: true,
    });

    if (uploadError) {
      setUploading(false);
      setMessage('Upload failed. Please try again.');
      return;
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ cv_url: filePath, cv_filename: file.name })
      .eq('id', user.id);

    setUploading(false);
    if (!updateError) {
      setMessage('CV uploaded successfully.');
      refreshProfile();
    }
  };

  return (
    <div className="page">
      <div className="profile-card">
        <h1>My Profile</h1>
        <p className="auth-subtitle">{user?.email}</p>

        {message && <div className="notice">{message}</div>}

        <section className="cv-section">
          <h2>CV / Resume</h2>
          {profile?.cv_filename ? (
            <p className="cv-current">📄 Current: {profile.cv_filename}</p>
          ) : (
            <p className="cv-current cv-missing">No CV uploaded yet.</p>
          )}
          <label className="btn btn-secondary">
            {uploading ? 'Uploading…' : 'Upload New CV (PDF)'}
            <input type="file" accept="application/pdf" onChange={handleCvUpload} hidden disabled={uploading} />
          </label>
        </section>

        <form onSubmit={handleSaveDetails} className="profile-form">
          <h2>Personal Details</h2>

          <label>Full Name</label>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} />

          <label>Phone Number</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+966..." />

          <label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} />

          <label>Nationality</label>
          <input value={nationality} onChange={(e) => setNationality(e.target.value)} />

          <button className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
