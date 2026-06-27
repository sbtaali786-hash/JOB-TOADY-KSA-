/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, Eye, EyeOff, Info } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../supabase';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
  onNavigate: (page: string) => void;
}

export default function LoginView({ onLoginSuccess, onNavigate }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Direct Master Password check requested by the user
      if (password === 'admin12512') {
        onLoginSuccess(email || 'admin@jobtodayksa.com');
        onNavigate('admin');
        return;
      }

      if (isSupabaseConfigured && supabase) {
        // Real Supabase Authentication
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) {
          throw new Error(authError.message);
        }

        if (data && data.user) {
          onLoginSuccess(data.user.email || email);
          onNavigate('admin');
        }
      } else {
        // Fallback local auth for instant preview
        if (email.toLowerCase() === 'admin@sbt.com' && (password === 'admin123' || password === 'admin12512')) {
          onLoginSuccess(email);
          onNavigate('admin');
        } else {
          setError('Invalid credentials. Please use the master password "admin12512".');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:py-24">
      
      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-extrabold text-blue-950 tracking-tight">Admin Portal Access</h1>
        <p className="text-xs text-gray-500 mt-1">Manage jobs, applications, and customer contact inquiries.</p>
      </div>

      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
        
        {/* Connection status notification */}
        <div className="mb-6 rounded-xl p-3.5 flex items-start gap-2.5 text-xs border bg-blue-50 border-blue-100 text-blue-700">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-blue-900">
              Admin Portal Security
            </span>
            <span className="text-[11px] block mt-0.5 leading-relaxed">
              Use the authorized master password <strong className="font-black text-blue-900 underline">admin12512</strong> along with any email address to open and manage the JOB TODAY KSA admin dashboard.
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-100 p-3 text-xs text-red-600 font-medium flex items-center gap-1.5">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type="email"
                required
                placeholder="admin@sbt.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition cursor-pointer"
          >
            {loading ? 'Authenticating Admin...' : 'Log In to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}
