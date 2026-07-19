import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';

import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import { Login, Signup } from './pages/AuthPages';
import Profile from './pages/Profile';
import {
  AdminDashboard,
  AdminJobs,
  AdminJobForm,
  AdminBulkUpload,
  AdminApplicants,
} from './pages/AdminPages';

import './index.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/jobs" element={<AdminRoute><AdminJobs /></AdminRoute>} />
          <Route path="/admin/jobs/new" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
          <Route path="/admin/jobs/:id/edit" element={<AdminRoute><AdminJobForm /></AdminRoute>} />
          <Route path="/admin/bulk-upload" element={<AdminRoute><AdminBulkUpload /></AdminRoute>} />
          <Route path="/admin/applicants" element={<AdminRoute><AdminApplicants /></AdminRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
