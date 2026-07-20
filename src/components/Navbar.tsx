import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          Job Today <span>KSA</span>
        </Link>

        <button className="navbar-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          ☰
        </button>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          <Link to="/" onClick={() => setOpen(false)}>Jobs</Link>

          {user ? (
            <>
              <Link to="/profile" onClick={() => setOpen(false)}>My Profile</Link>
              {profile?.is_admin && (
                <Link to="/admin" onClick={() => setOpen(false)} className="navbar-admin-link">
                  Admin Dashboard
                </Link>
              )}
              <button className="navbar-logout" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/signup" className="navbar-cta" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
