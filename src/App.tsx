/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import JobsView from './components/JobsView';
import JobDetailsView from './components/JobDetailsView';
import EmployersView from './components/EmployersView';
import AboutView from './components/AboutView';
import ContactView from './components/ContactView';
import LoginView from './components/LoginView';
import AdminView from './components/AdminView';
import { Job } from './types';
import { db, supabase } from './supabase';
import { MessageSquare } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Search parameters flowing from Home to Jobs view
  const [initialFilters, setInitialFilters] = useState({ title: '', category: '', location: '' });

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);
  const [adminEmail, setAdminEmail] = useState<string>('');

  // Floating WhatsApp configuration
  const WHATSAPP_NUMBER = '966508202459';
  const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

  useEffect(() => {
    // Check local storage session on mount
    const savedLogin = localStorage.getItem('job_today_ksa_admin_logged');
    const savedEmail = localStorage.getItem('job_today_ksa_admin_email');
    if (savedLogin === 'true' && savedEmail) {
      setIsAdminLoggedIn(true);
      setAdminEmail(savedEmail);
    }

    // Check if Supabase Session is active
    if (supabase) {
      supabase.auth.getSession().then(({ data }) => {
        if (data && data.session && data.session.user) {
          setIsAdminLoggedIn(true);
          setAdminEmail(data.session.user.email || '');
          localStorage.setItem('job_today_ksa_admin_logged', 'true');
          localStorage.setItem('job_today_ksa_admin_email', data.session.user.email || '');
        }
      });

      // Listen for auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session && session.user) {
          setIsAdminLoggedIn(true);
          setAdminEmail(session.user.email || '');
          localStorage.setItem('job_today_ksa_admin_logged', 'true');
          localStorage.setItem('job_today_ksa_admin_email', session.user.email || '');
        } else {
          setIsAdminLoggedIn(false);
          setAdminEmail('');
          localStorage.removeItem('job_today_ksa_admin_logged');
          localStorage.removeItem('job_today_ksa_admin_email');
        }
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, []);

  // Synchronize state with URL path on mount/load or popstate
  const syncRouteWithUrl = (allJobs: Job[]) => {
    const path = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const jobId = searchParams.get('id');

    if (path === '/admin') {
      setCurrentPage('admin');
    } else if (path === '/jobs') {
      if (jobId && allJobs.length > 0) {
        const foundJob = allJobs.find(j => j.id === jobId);
        if (foundJob) {
          setSelectedJob(foundJob);
          setCurrentPage('job-details');
          return;
        }
      }
      setCurrentPage('jobs');
    } else if (path === '/employers') {
      setCurrentPage('employers');
    } else if (path === '/about') {
      setCurrentPage('about');
    } else if (path === '/contact') {
      setCurrentPage('contact');
    } else {
      setCurrentPage('home');
    }
  };

  // Fetch jobs on mount
  useEffect(() => {
    loadJobsData();
  }, []);

  const loadJobsData = async () => {
    setLoading(true);
    try {
      const data = await db.getJobs();
      setJobs(data);
      syncRouteWithUrl(data);
    } catch (e) {
      console.error('Error listing jobs:', e);
    } finally {
      setLoading(false);
    }
  };

  // Watch for popstate to allow back/forward navigation to work flawlessly
  useEffect(() => {
    const handlePopState = () => {
      syncRouteWithUrl(jobs);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [jobs]);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Update URL path without full reload to keep default '/' to HomeView
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else if (page === 'jobs') {
      window.history.pushState({}, '', '/jobs');
    } else if (page === 'employers') {
      window.history.pushState({}, '', '/employers');
    } else if (page === 'about') {
      window.history.pushState({}, '', '/about');
    } else if (page === 'contact') {
      window.history.pushState({}, '', '/contact');
    } else if (page === 'job-details' && data) {
      window.history.pushState({}, '', `/jobs?id=${data.id}`);
      setSelectedJob(data);
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const handleSearchFromHome = (filters: { title: string; category: string; location: string }) => {
    setInitialFilters(filters);
  };

  const handleClearInitialFilters = () => {
    setInitialFilters({ title: '', category: '', location: '' });
  };

  const handleLoginSuccess = (email: string) => {
    setIsAdminLoggedIn(true);
    setAdminEmail(email);
    localStorage.setItem('job_today_ksa_admin_logged', 'true');
    localStorage.setItem('job_today_ksa_admin_email', email);
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setIsAdminLoggedIn(false);
    setAdminEmail('');
    localStorage.removeItem('job_today_ksa_admin_logged');
    localStorage.removeItem('job_today_ksa_admin_email');
    setCurrentPage('home');
  };

  return (
    <div className="flex min-h-screen flex-col font-sans bg-gray-50 text-gray-800 antialiased">
      
      {/* Sticky Header */}
      <Header 
        currentPage={currentPage} 
        onNavigate={handleNavigate} 
        isAdminLoggedIn={isAdminLoggedIn} 
        onLogout={handleLogout} 
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {loading && (
          <div className="flex h-96 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {!loading && (
          <>
            {currentPage === 'home' && (
              <HomeView 
                jobs={jobs} 
                onNavigate={handleNavigate} 
                onSearch={handleSearchFromHome} 
              />
            )}
            
            {currentPage === 'jobs' && (
              <JobsView 
                jobs={jobs} 
                onNavigate={handleNavigate} 
                initialFilters={initialFilters}
                onClearInitialFilters={handleClearInitialFilters}
              />
            )}
            
            {currentPage === 'job-details' && selectedJob && (
              <JobDetailsView 
                job={selectedJob} 
                allJobs={jobs} 
                onNavigate={handleNavigate} 
              />
            )}
            
            {currentPage === 'employers' && (
              <EmployersView 
                onNavigate={handleNavigate} 
              />
            )}
            
            {currentPage === 'about' && (
              <AboutView />
            )}
            
            {currentPage === 'contact' && (
              <ContactView />
            )}
            
            {currentPage === 'login' && (
              <LoginView 
                onLoginSuccess={handleLoginSuccess} 
                onNavigate={handleNavigate} 
              />
            )}
            
            {currentPage === 'admin' && (
              isAdminLoggedIn ? (
                <AdminView 
                  jobs={jobs} 
                  onRefreshJobs={loadJobsData} 
                />
              ) : (
                <LoginView 
                  onLoginSuccess={handleLoginSuccess} 
                  onNavigate={handleNavigate} 
                />
              )
            )}
          </>
        )}
      </main>

      {/* Corporate Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Global WhatsApp Widget */}
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-xl hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all duration-150 group"
        title="Chat on WhatsApp with JOB TODAY KSA"
      >
        <MessageSquare className="h-6 w-6" />
        <span className="absolute right-16 scale-0 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white shadow-lg transition duration-150 group-hover:scale-100 whitespace-nowrap">
          WhatsApp JOB TODAY KSA Recruitment
        </span>
      </a>

      {/* Vercel Web Analytics tracking */}
      <Analytics />

    </div>
  );
}
